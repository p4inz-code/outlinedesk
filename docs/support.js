/* Support page helpers: filter the answers as you type and build an email text. Nothing is sent or stored. */
(function () {
  'use strict';
  var $ = function (s) { return document.getElementById(s); };
  var q = $('sup-q'), count = $('sup-count'), faq = $('sup-faq'), hint = count ? count.textContent : '';
  if (q && faq) {
    var items = [].slice.call(faq.querySelectorAll('details'));
    q.addEventListener('input', function () {
      var words = q.value.toLowerCase().split(/\s+/).filter(Boolean), n = 0;
      items.forEach(function (d) {
        var t = d.textContent.toLowerCase(), ok = words.every(function (w) { return t.indexOf(w) >= 0; });
        d.hidden = !ok; if (ok) n++;
        if (words.length && ok) d.open = true; else if (!words.length) d.open = false;
      });
      count.textContent = words.length ? (n ? n + ' of ' + items.length + ' answers match.' : 'Nothing matches. Try one word, or use the email builder further down and we will help.') : hint;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName || '')) { e.preventDefault(); q.focus(); q.scrollIntoView({ block: 'center' }); }
    });
  }
  var sys = $('m-sys'), ver = $('m-ver'), what = $('m-what'), out = $('m-out'), copy = $('m-copy'), open = $('m-open');
  if (!out) return;
  function build() {
    var body = 'System: ' + sys.value + '\nOutlinedesk version: ' + (ver.value || 'unknown') + '\n\nWhat happened:\n' + (what.value || '(please describe what you did, what you expected and what you saw)') + '\n';
    out.value = 'Subject: Outlinedesk help\n\n' + body;
    open.href = 'mailto:atharva.patil.cg@gmail.com?subject=' + encodeURIComponent('Outlinedesk help') + '&body=' + encodeURIComponent(body);
  }
  [sys, ver, what].forEach(function (e) { e.addEventListener('input', build); e.addEventListener('change', build); });
  copy.addEventListener('click', function () {
    var done = function (ok) { copy.textContent = ok ? 'Copied' : 'Select and copy'; setTimeout(function () { copy.textContent = 'Copy the text'; }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(out.value).then(function () { done(true); }, function () { out.select(); done(false); });
    else { out.select(); done(false); }
  });
  build();
}());
