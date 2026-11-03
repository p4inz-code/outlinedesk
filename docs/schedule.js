/* schedule.js — the scheduling engine behind the Timeline.

   Pure and dependency-free: used by the main process (tools, exports) and loaded as a plain script by the
   renderer, so the Timeline and every export agree. It never mutates its input.

     Schedule.compute(model, { calendar, anchor, today }) → { items, span, anchor, projectFinish, cycle }
       model = { nodes, edges, childrenOf }   (a Project's nodes/edges, or the UI's synced state)
       items[id] = { s, f, d, float, critical, late, container }       s / f are day numbers, d is working days

   Rules (docs/OFFLINE_LEAD_PLAN.md §2):
     * all date maths is in integer UTC day numbers, so daylight saving and month ends cannot bite;
     * a card starts at the latest of: the project anchor, its own "start no earlier than" (`start`), the
       day after every dependency finishes, and its parent's gate; weekends and holidays are skipped;
     * `days` is whole working days (default 1; a milestone is 0 and sits on the day its dependencies finish);
     * containers span their children; a dependency on a container means "after ALL of it";
     * float = working days between a card's finish and its latest allowed finish (the project finish, or the
       card's `due` when earlier); critical = unfinished leaf with float <= 0;
     * linear time (Kahn order over start/finish vertices), no recursion, survives cycles.                    */
(function (root) {
  'use strict';

  const DAY_MS = 86400000;
  const MAX_DAYS = 3650;

  /* ── dates: integer day numbers (days since 1970-01-01, UTC) ── */
  function dayOf(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    if (!m) return null;
    const t = Date.UTC(+m[1], +m[2] - 1, +m[3]);
    const d = new Date(t);
    if (d.getUTCFullYear() !== +m[1] || d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) return null;   // 2026-02-31 is not a date
    return Math.floor(t / DAY_MS);
  }
  function iso(day) { return new Date(day * DAY_MS).toISOString().slice(0, 10); }
  const weekday = (day) => (((day + 4) % 7) + 7) % 7;                  // 0 = Sunday; 1970-01-01 was a Thursday
  function todayDay(now) { const d = new Date(now === undefined ? Date.now() : now); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS); }

  /* ── calendar ── */
  const DEFAULT_CALENDAR = Object.freeze({ workdays: [1, 2, 3, 4, 5], holidays: [] });
  function makeCalendar(cal) {
    const wd = cal && Array.isArray(cal.workdays) ? cal.workdays.filter((x) => Number.isInteger(x) && x >= 0 && x <= 6) : DEFAULT_CALENDAR.workdays;
    const work = new Set(wd.length ? wd : DEFAULT_CALENDAR.workdays);        // a calendar with no working day would loop forever
    const hol = new Set(((cal && cal.holidays) || []).map(dayOf).filter((x) => x !== null));
    const isWork = (d) => work.has(weekday(d)) && !hol.has(d);
    const nextWork = (d) => { let g = 0; while (!isWork(d) && g++ < 4000) d++; return d; };           // d itself when it is a working day
    const prevWork = (d) => { let g = 0; while (!isWork(d) && g++ < 4000) d--; return d; };
    const addWork = (d, k) => { d = nextWork(d); for (let i = 0; i < k; i++) d = nextWork(d + 1); return d; };      // k working days after d
    const subWork = (d, k) => { d = prevWork(d); for (let i = 0; i < k; i++) d = prevWork(d - 1); return d; };
    /* working days strictly after a up to and including b (negative when b is before a) */
    const between = (a, b) => {
      if (a === b) return 0;
      const sign = b > a ? 1 : -1, lo = Math.min(a, b), hi = Math.max(a, b);
      let n = 0;
      if (hi - lo > 800) { const weeks = Math.floor((hi - lo) / 7) - 1; n += weeks * work.size; for (let d = lo + weeks * 7 + 1; d <= hi; d++) if (isWork(d)) n++; n -= holidaysIn(lo + 1, lo + weeks * 7); }
      else for (let d = lo + 1; d <= hi; d++) if (isWork(d)) n++;
      return sign * n;
    };
    const holidaysIn = (a, b) => { let n = 0; hol.forEach((h) => { if (h >= a && h <= b && work.has(weekday(h))) n++; }); return n; };
    return { isWork, nextWork, prevWork, addWork, subWork, between };
  }

  const durationOf = (n) => {
    if (Number.isInteger(n.days) && n.days >= 0) return Math.min(n.days, MAX_DAYS);
    return n.type === 'milestone' ? 0 : 1;
  };

  function compute(model, opts) {
    opts = opts || {};
    const cal = makeCalendar(opts.calendar);
    /* which statuses count as finished: by KIND. model.statuses (a project's status list) or model.kindOf(statusId); with neither, the id is the kind (the four built-in ids) */
    const kindMap = model.statuses ? new Map(model.statuses.map((x) => [x.id, x.kind])) : null;
    const isDone = typeof model.kindOf === 'function' ? (n) => model.kindOf(n.status) === 'done' : kindMap ? (n) => kindMap.get(n.status) === 'done' : (n) => n.status === 'done';
    const nodes = model.nodes, edges = model.edges, kids = model.childrenOf || {};
    const ids = Object.keys(nodes).filter((id) => nodes[id].kind === undefined || nodes[id].kind === 'card');
    const N = ids.length, ix = new Map();
    ids.forEach((id, i) => ix.set(id, i));
    const items = {};
    if (!N) return { items, span: null, anchor: opts.anchor || null, projectFinish: null, cycle: false };

    const parent = new Int32Array(N).fill(-1), childList = ids.map(() => []);
    for (let i = 0; i < N; i++) {
      const p = nodes[ids[i]].parentId;
      if (p && ix.has(p)) { parent[i] = ix.get(p); childList[parent[i]].push(i); }
    }
    const isLeaf = (i) => childList[i].length === 0;
    const preds = ids.map(() => []), succs = ids.map(() => []);          // dependency edges between cards: P → X means X waits for P
    for (const eid in edges) {
      const e = edges[eid];
      if (e.kind && e.kind !== 'depends') continue;
      if (!ix.has(e.from) || !ix.has(e.to) || e.from === e.to) continue;
      preds[ix.get(e.to)].push(ix.get(e.from)); succs[ix.get(e.from)].push(ix.get(e.to));
    }

    /* anchor: explicit, else the earliest constraint, else today */
    let anchor = dayOf(opts.anchor);
    if (anchor === null) { for (let i = 0; i < N; i++) { const s = dayOf(nodes[ids[i]].start); if (s !== null && (anchor === null || s < anchor)) anchor = s; } }
    if (anchor === null) anchor = todayDay(opts.today);
    anchor = cal.nextWork(anchor);

    /* vertices: S(i) = 2i (start gate), F(i) = 2i+1 (finish). Edges: F(P)→S(X); S(parent)→S(child); F(child)→F(parent); S(leaf)→F(leaf) */
    const V = 2 * N, indeg = new Int32Array(V), out = Array.from({ length: V }, () => []);
    const link = (a, b) => { out[a].push(b); indeg[b]++; };
    for (let i = 0; i < N; i++) {
      for (const p of preds[i]) link(2 * p + 1, 2 * i);
      if (parent[i] >= 0) { link(2 * parent[i], 2 * i); link(2 * i + 1, 2 * parent[i] + 1); }
      if (isLeaf(i)) link(2 * i, 2 * i + 1);
    }
    const order = [], deg = indeg.slice(), queue = [];
    for (let v = 0; v < V; v++) if (!deg[v]) queue.push(v);
    for (let h = 0; h < queue.length; h++) { const v = queue[h]; order.push(v); for (const w of out[v]) if (--deg[w] === 0) queue.push(w); }
    let cycle = false;
    if (order.length < V) { cycle = true; const done = new Set(order); for (let v = 0; v < V; v++) if (!done.has(v)) order.push(v); }

    /* forward pass */
    const G = new Float64Array(N).fill(NaN), S = new Float64Array(N).fill(NaN), F = new Float64Array(N).fill(NaN), D = new Int32Array(N);
    for (let i = 0; i < N; i++) D[i] = durationOf(nodes[ids[i]]);
    for (const v of order) {
      const i = v >> 1;
      if (!(v & 1)) {                                                  // S(i): the gate
        const n = nodes[ids[i]];
        let g = anchor;
        const c = dayOf(n.start); if (c !== null && c > g) g = c;
        if (parent[i] >= 0 && G[parent[i]] > g) g = G[parent[i]];
        let predMax = -Infinity;
        for (const p of preds[i]) if (F[p] > predMax) predMax = F[p];
        const leaf = isLeaf(i);
        if (predMax !== -Infinity) { const need = leaf && D[i] === 0 ? predMax : predMax + 1; if (need > g) g = need; }
        G[i] = cal.nextWork(g);
      } else if (isLeaf(i)) {                                          // F(leaf)
        S[i] = G[i];
        F[i] = D[i] === 0 ? G[i] : cal.addWork(G[i], D[i] - 1);
      } else {                                                         // F(container) = latest child finish, S = earliest child start
        let lo = Infinity, hi = -Infinity;
        for (const k of childList[i]) { if (S[k] < lo) lo = S[k]; if (F[k] > hi) hi = F[k]; }
        S[i] = lo === Infinity ? G[i] : lo; F[i] = hi === -Infinity ? G[i] : hi;
      }
    }
    let projectFinish = -Infinity, projectStart = Infinity;
    for (let i = 0; i < N; i++) { if (F[i] > projectFinish) projectFinish = F[i]; if (S[i] < projectStart) projectStart = S[i]; }

    /* backward pass: latest finish / latest start */
    const LF = new Float64Array(N).fill(Infinity), LS = new Float64Array(N).fill(Infinity);
    for (let k = order.length - 1; k >= 0; k--) {
      const v = order[k], i = v >> 1;
      if (v & 1) {                                                     // F(i): latest finish
        let lf = LF[i];
        if (!Number.isFinite(lf)) lf = projectFinish;
        const due = dayOf(nodes[ids[i]].due);
        if (due !== null && due < lf) lf = due;
        if (parent[i] >= 0 && Number.isFinite(LF[parent[i]]) && LF[parent[i]] < lf) lf = LF[parent[i]];
        LF[i] = lf;
        if (isLeaf(i)) LS[i] = D[i] === 0 ? lf : cal.subWork(lf, D[i] - 1);
      } else {                                                         // S(i): latest start of the gate
        if (!isLeaf(i)) { let m = Infinity; for (const k2 of childList[i]) if (LS[k2] < m) m = LS[k2]; LS[i] = m; }
        const lsGate = LS[i];
        for (const p of preds[i]) {                                    // P must finish before X may start
          if (!Number.isFinite(lsGate)) continue;
          const need = D[i] === 0 && isLeaf(i) ? lsGate : cal.prevWork(lsGate - 1);
          if (need < LF[p]) LF[p] = need;
        }
      }
    }

    for (let i = 0; i < N; i++) {
      const n = nodes[ids[i]], leaf = isLeaf(i);
      const lf = Number.isFinite(LF[i]) ? LF[i] : F[i];
      const fl = cal.between(F[i], lf);
      const due = dayOf(n.due);
      const done = isDone(n);
      const as = dayOf(n.actualStart), af = dayOf(n.actualFinish);
      items[ids[i]] = {
        s: S[i], f: F[i], d: leaf ? D[i] : null, float: leaf ? fl : null,
        critical: leaf && !done && fl <= 0,
        late: leaf && !done && due !== null && F[i] > due ? cal.between(due, F[i]) : 0,
        container: !leaf,
        /* actual dates (read only here, never used to move the plan): day numbers or null; finishedLate = working days a finished card ran past its due date */
        as, af,
        finishedLate: leaf && done && af !== null && due !== null && af > due ? cal.between(due, af) : 0
      };
    }
    /* container float / critical = the tightest child (deepest containers first, so children are always ready) */
    const depth = new Int32Array(N);
    for (let i = 0; i < N; i++) { let d = 0, c = parent[i], g = 0; while (c >= 0 && g++ < 1000) { d++; c = parent[c]; } depth[i] = d; }
    const containers = [];
    for (let i = 0; i < N; i++) if (!isLeaf(i)) containers.push(i);
    containers.sort((a, b) => depth[b] - depth[a]);
    for (const i of containers) {
      let m = Infinity, crit = false;
      for (const c of childList[i]) { const it = items[ids[c]]; if (it.float !== null && it.float < m) m = it.float; if (it.critical) crit = true; }
      items[ids[i]].float = m === Infinity ? null : m; items[ids[i]].critical = crit;
    }
    return { items, span: { s: projectStart, f: projectFinish }, anchor, projectFinish, cycle };
  }

  /* a project's nodes/edges in the shape compute() wants */
  function fromProject(p) {
    const childrenOf = {};
    for (const id in p.nodes) childrenOf[id] = p.childIds(id);
    return { nodes: p.nodes, edges: p.edges, childrenOf, statuses: p.statuses };
  }

  const api = { compute, fromProject, dayOf, iso, weekday, todayDay, makeCalendar, durationOf, DEFAULT_CALENDAR, MAX_DAYS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Schedule = api;
})(typeof self !== 'undefined' ? self : this);
