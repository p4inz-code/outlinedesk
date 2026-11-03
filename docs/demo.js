/* Schedule demo: uses the same engine as the app (schedule.js). Runs in the browser; sends and stores nothing. */
(function () {
  'use strict';
  var S = window.Schedule; if (!S) return;
  var $ = function (s) { return document.getElementById(s); };
  var DEFAULTS = { layout: 3, anim: 5, light: 2, sound: 3, comp: 2 };
  var NAMES = { layout: 'Layout', anim: 'Animation', light: 'Lighting', sound: 'Sound', comp: 'Comp' };
  var ORDER = ['layout', 'anim', 'light', 'sound', 'comp'];
  var WAITS = { anim: 'Layout', light: 'Animation', comp: 'Lighting and Sound' };
  var days = {}; ORDER.forEach(function (k) { days[k] = DEFAULTS[k]; });
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function label(day) { var d = new Date(day * 86400000); return DOW[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MON[d.getUTCMonth()]; }

  function model() {
    var nodes = {}, edges = {};
    ORDER.forEach(function (k) { nodes[k] = { id: k, kind: 'card', days: days[k], status: 'todo' }; });
    nodes.comp.due = '2026-11-20';
    [['layout', 'anim'], ['anim', 'light'], ['light', 'comp'], ['sound', 'comp']].forEach(function (p, i) { edges['e' + i] = { from: p[0], to: p[1], kind: 'depends' }; });
    return { nodes: nodes, edges: edges, childrenOf: {} };
  }
  function run() { return S.compute(model(), { anchor: '2026-11-09' }); }
  window.__demoModel = model;

  var rows = $('demo-rows'), sum = $('demo-sum'), note = $('demo-note');
  var els = {};
  ORDER.forEach(function (k) {
    var r = document.createElement('div'); r.className = 'demo-row';
    var name = document.createElement('div'); name.className = 'demo-name';
    var b = document.createElement('strong'); b.textContent = NAMES[k];
    var w = document.createElement('span'); w.textContent = WAITS[k] ? 'Waits for ' + WAITS[k] : 'Starts first';
    name.appendChild(b); name.appendChild(w);
    var step = document.createElement('div'); step.className = 'demo-step';
    var minus = document.createElement('button'); minus.type = 'button'; minus.className = 'demo-btn'; minus.textContent = '−'; minus.setAttribute('aria-label', 'One day shorter: ' + NAMES[k]);
    var val = document.createElement('span'); val.className = 'demo-val'; val.setAttribute('aria-live', 'polite');
    var plus = document.createElement('button'); plus.type = 'button'; plus.className = 'demo-btn'; plus.textContent = '+'; plus.setAttribute('aria-label', 'One day longer: ' + NAMES[k]);
    step.appendChild(minus); step.appendChild(val); step.appendChild(plus);
    var dates = document.createElement('div'); dates.className = 'demo-dates';
    var bar = document.createElement('div'); bar.className = 'demo-bar'; var fill = document.createElement('i'); bar.appendChild(fill);
    r.appendChild(name); r.appendChild(step); r.appendChild(dates); r.appendChild(bar);
    rows.appendChild(r);
    minus.addEventListener('click', function () { if (days[k] > 1) { days[k]--; paint(); } });
    plus.addEventListener('click', function () { if (days[k] < 10) { days[k]++; paint(); } });
    els[k] = { row: r, val: val, dates: dates, fill: fill, minus: minus, plus: plus };
  });

  function paint() {
    var res = run(), it = res.items, start = res.span.s, total = res.span.f - res.span.s + 1;
    ORDER.forEach(function (k) {
      var x = it[k], e = els[k];
      e.val.textContent = days[k] + (days[k] === 1 ? ' day' : ' days');
      e.dates.textContent = label(x.s) + ' to ' + label(x.f);
      e.fill.setAttribute('data-l', Math.round((x.s - start) / total * 100));
      e.fill.setAttribute('data-w', Math.max(4, Math.round((x.f - x.s + 1) / total * 100)));
      e.fill.style.marginLeft = ((x.s - start) / total * 100).toFixed(2) + '%';
      e.fill.style.width = Math.max(4, (x.f - x.s + 1) / total * 100).toFixed(2) + '%';
      e.row.classList.toggle('crit', !!x.critical);
      e.row.classList.toggle('late', !!x.late);
      e.minus.disabled = days[k] <= 1; e.plus.disabled = days[k] >= 10;
    });
    var late = it.comp.late, due = S.dayOf('2026-11-20');
    sum.textContent = 'Finishes ' + label(res.projectFinish) + (late ? '. ' + (res.projectFinish - due) + ' calendar days after the due date' : '. On time');
    sum.className = 'demo-sum ' + (late ? 'bad' : 'ok');
    var crit = ORDER.filter(function (k) { return it[k].critical; }).map(function (k) { return NAMES[k]; });
    note.textContent = 'Critical path: ' + crit.join(', ') + '. Work not on it can slip without moving the finish.';
  }
  $('demo-reset').addEventListener('click', function () { ORDER.forEach(function (k) { days[k] = DEFAULTS[k]; }); paint(); });
  paint();
}());
