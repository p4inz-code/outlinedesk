/* Privacy page: show what leaves the computer with the update check on or off. Nothing is sent or stored. */
(function () {
  'use strict';
  var sw = document.getElementById('priv-sw'), title = document.getElementById('priv-title'), total = document.getElementById('priv-total'), cell = document.querySelector('#priv-rows td[data-on]');
  if (!sw || !cell) return;
  function paint() {
    var on = sw.checked;
    cell.textContent = cell.getAttribute(on ? 'data-on' : 'data-off');
    title.textContent = on ? 'With the update check on' : 'With the update check off';
    total.textContent = on ? 'With the update check on, the only thing that can leave your computer is a request for the update file.' : 'With the update check off, nothing leaves your computer at all.';
  }
  sw.addEventListener('change', paint); paint();
}());
