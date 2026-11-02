/* Outlinedesk price calculator for the pricing page. One small script, no libraries, nothing is sent anywhere.
   The numbers are a copy of the locked price sheet; test/site-pricing.test.js checks every seat count from 1 to 250 against
   src/core/plans.js, which is what the licence tools use, so the page can never show a different price from the one charged. */
(function (root) {
  'use strict';
  var P = {
    solo: { name: 'Solo', seats: 1, m: 149, y: 1599 },
    team: { name: 'Team', seats: 8, m: 1999, y: 21999, xm: 250, xy: 2750 },
    studio: { name: 'Studio', seats: 25, m: 3999, y: 43999, xm: 250, xy: 2750 },
    large: { name: 'Large', seats: 50, m: 7999, y: 87999, xm: 250, xy: 2750 },
    school: { name: 'School or lab', seats: 100, m: 1999, y: 21999 },
    custom: { name: 'Custom', min: 51, per: 150, floor: 9999 },
    student: { name: 'Student', y: 299, after: 649 }
  };
  var ORDER = ['solo', 'team', 'studio', 'large', 'custom'];

  /* price of one plan for a seat count and period ('monthly' or 'yearly'); null when the plan cannot cover that many seats */
  function price(key, seats, period) {
    var p = P[key], yearly = period === 'yearly';
    if (!p || !(seats >= 1)) return null;
    if (key === 'custom') { if (seats < p.min) return null; var mo = Math.max(p.floor, p.per * seats); return yearly ? mo * 11 : mo; }
    if (key === 'student') return yearly ? p.y : null;
    if (key === 'solo') return seats === 1 ? (yearly ? p.y : p.m) : null;
    if (key === 'school') return seats <= p.seats ? (yearly ? p.y : p.m) : null;
    var base = yearly ? p.y : p.m, extra = Math.max(0, seats - p.seats) * (yearly ? p.xy : p.xm);
    return base + extra;
  }
  /* the cheapest plan for a team: Solo for one person, then Team, Studio, Large (with extra seats) and Custom from 51 seats */
  function cheapest(seats, period) {
    var list = [];
    ORDER.forEach(function (k) { var a = price(k, seats, period); if (a !== null) list.push({ key: k, name: P[k].name, amount: a, included: P[k].seats || 0, extra: P[k].seats ? Math.max(0, seats - P[k].seats) : 0 }); });
    list.sort(function (a, b) { return a.amount - b.amount || ORDER.indexOf(a.key) - ORDER.indexOf(b.key); });
    return { best: list[0], others: list.slice(1) };
  }
  var fmt = function (n) { return '₹' + Number(n).toLocaleString('en-IN'); };
  var api = { PLANS: P, price: price, cheapest: cheapest, fmt: fmt };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.OutlinedeskPricing = api;

  /* ---- the page ---- */
  if (typeof document === 'undefined') return;
  var $ = function (id) { return document.getElementById(id); };
  var state = { period: 'monthly', seats: 5 };
  var perWord = function () { return state.period === 'yearly' ? 'a year' : 'a month'; };
  function bump(el) { if (!el) return; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  function set(id, text, animate) { var el = $(id); if (!el || el.textContent === text) return; el.textContent = text; if (animate) bump(el); }

  function paint() {
    var y = state.period === 'yearly';
    document.querySelectorAll('[data-period]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-period') === state.period)); });
    set('solo-price', fmt(price('solo', 1, state.period)), true); set('solo-per', perWord());
    set('solo-save', y ? 'Paying yearly saves about one month compared with monthly.' : 'Pay yearly and save about one month.');
    set('school-price', fmt(price('school', 100, state.period)), true); set('school-per', perWord());
    var c = cheapest(state.seats, state.period), b = c.best;
    set('rec-name', b.name + (b.key === 'solo' ? ' plan' : ' plan'), true);
    set('rec-price', fmt(b.amount), true); set('rec-per', perWord());
    var note = b.key === 'solo' ? 'One seat.' : b.key === 'custom' ? 'For more than 50 seats: ' + fmt(150) + ' per seat a month, minimum ' + fmt(9999) + '. Write to us to confirm.' : b.included + ' seats included' + (b.extra ? ', plus ' + b.extra + ' extra seat' + (b.extra === 1 ? '' : 's') + ' at ' + fmt(y ? 2750 : 250) + ' each' : '') + '.';
    set('rec-note', note);
    var alt = c.others[0];
    set('rec-alt', alt ? 'Next best: ' + alt.name + ' at ' + fmt(alt.amount) + ' ' + perWord() + '.' : '');
    if (y) set('rec-month', 'About ' + fmt(Math.round(b.amount / 12)) + ' a month.'); else set('rec-month', '');
    set('seats-num', String(state.seats) + (state.seats === 1 ? ' person' : ' people'));
    var r = $('seats-range'); if (r) { r.value = String(Math.min(state.seats, 200)); var pct = (Math.min(state.seats, 200) - 1) / 199 * 100; r.style.setProperty('--fill', pct + '%'); }
    document.querySelectorAll('[data-seats]').forEach(function (b2) { b2.setAttribute('aria-pressed', String(+b2.getAttribute('data-seats') === state.seats)); });
    var card = $('card-team'); if (card) card.setAttribute('data-plan', b.key);
  }
  function init() {
    document.querySelectorAll('[data-period]').forEach(function (b) { b.addEventListener('click', function () { state.period = b.getAttribute('data-period'); paint(); }); });
    var r = $('seats-range'); if (r) r.addEventListener('input', function () { state.seats = +r.value; paint(); });
    document.querySelectorAll('[data-seats]').forEach(function (b) { b.addEventListener('click', function () { state.seats = +b.getAttribute('data-seats'); paint(); }); });
    document.documentElement.classList.add('js');
    paint();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}(typeof window !== 'undefined' ? window : this));
