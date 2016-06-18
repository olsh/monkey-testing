'use strict';

(function () {
  var scriptId = 'monkey-testing-script';
  if (document.getElementById(scriptId)) {
    return;
  }

  var s = document.createElement('script');
  s.id = scriptId;
  s.src = 'https://rawgit.com/olsh/monkey-testing/master/src/gremlins/gremlins-wrapper.js';
  document.body.appendChild(s);

  window.addEventListener('message', function(event) {
    // We only accept messages from ourselves
    if (event.source != window) {
      return;
    }

    if (event.data.type === 'GremlinsState') {
      chrome.runtime.sendMessage(event.data, function (response) {});
    }
  }, false);

  chrome.runtime.onMessage.addListener(function (message, sender, response) {
    if(message.type !== 'UpdateGremlinsState') {
      return;
    }

    window.postMessage(message, '*');
  })
})();
