/* Light deterrence for the product images: no drag-out and no right-click menu on pictures.
   Text, links and the rest of the page keep the normal menu, so copying, translating and accessibility tools still work.
   This does not make images secret (nothing in a browser can); it only stops casual saving. Nothing is sent or stored. */
(function () {
  'use strict';
  var isPic = function (t) { return t && t.closest && t.closest('picture, figure.sx-media, .sx-stage, .sx-panels figure'); };
  document.addEventListener('contextmenu', function (e) { if (isPic(e.target)) e.preventDefault(); });
  document.addEventListener('dragstart', function (e) { if (e.target && e.target.tagName === 'IMG') e.preventDefault(); });
}());
