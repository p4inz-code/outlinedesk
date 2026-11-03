/* Download page helpers: mark the card that fits the visitor's computer, copy buttons, and a checksum checker.
   Everything happens in the browser. Nothing is sent anywhere and nothing is stored. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var all = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* which system is this? Windows and Linux only; anything else gets no badge */
  var ua = (navigator.userAgent || '') + ' ' + (navigator.platform || '');
  var mine = /Windows/i.test(ua) ? 'windows' : (/Linux|X11/i.test(ua) && !/Android/i.test(ua)) ? 'linux' : '';
  if (mine) {
    var card = $('[data-os="' + mine + '"]');
    if (card) { card.classList.add('mine'); var b = $('.here', card); if (b) b.hidden = false; }
  }
  var unsupported = $('#unsupported');
  if (unsupported && !mine) unsupported.hidden = false;

  /* copy buttons: copy the text of the element named in data-copy */
  all('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var src = $(btn.getAttribute('data-copy')); if (!src) return;
      var text = src.textContent.trim(), label = btn.getAttribute('data-label') || 'Copy';
      var done = function (ok) { btn.textContent = ok ? 'Copied' : 'Select and copy'; setTimeout(function () { btn.textContent = label; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { selectText(src); done(false); });
      else { selectText(src); done(false); }
    });
  });
  function selectText(el) { var r = document.createRange(); r.selectNodeContents(el); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }

  /* checksum checker: compare what the visitor pasted with the published values */
  var input = $('#hash-in'), out = $('#hash-out'), go = $('#hash-go');
  function check() {
    var v = (input.value || '').toLowerCase().replace(/[^0-9a-f]/g, '');
    out.className = 'sx-callout hash-result';
    if (!v) { out.textContent = 'Paste the 64 character SHA-256 value of your downloaded file.'; return; }
    if (v.length !== 64) { out.textContent = 'That is ' + v.length + ' characters. A SHA-256 value has 64 (digits 0 to 9 and letters a to f).'; return; }
    var hit = all('[data-os]').filter(function (c) { return c.getAttribute('data-sha') === v; })[0];
    if (hit) { out.classList.add('ok'); out.textContent = 'Match. This is the official ' + hit.getAttribute('data-name') + '.'; }
    else { out.classList.add('bad'); out.textContent = 'No match. This is not one of the published files. Download it again from this page and check again.'; }
  }
  if (go && input && out) { go.addEventListener('click', check); input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); check(); } }); }
}());
