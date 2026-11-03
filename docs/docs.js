/* Guides page: filter the guide cards as you type. Nothing is sent or stored. */
(function () {
  'use strict';
  var q = document.getElementById('docs-q'), count = document.getElementById('docs-count'), grid = document.getElementById('docs-grid');
  if (!q || !grid) return;
  var cards = [].slice.call(grid.children);
  q.addEventListener('input', function () {
    var words = q.value.toLowerCase().split(/\s+/).filter(Boolean), n = 0;
    cards.forEach(function (c) { var t = c.textContent.toLowerCase(), ok = words.every(function (w) { return t.indexOf(w) >= 0; }); c.hidden = !ok; if (ok) n++; });
    count.textContent = words.length ? (n ? n + ' guides match.' : 'No guide matches. Try support instead.') : '';
  });
}());
