'use strict';

(function () {
  var backgroundPage = chrome.extension.getBackgroundPage();
  backgroundPage.injectScript();
  backgroundPage.queryStatus(onStateUpdated);

  var startButton = document.getElementById('start-button');
  var stopButton = document.getElementById('stop-button');
  var seedInput = document.getElementById('seed-number');

  var startContainer = document.getElementById('start-container');
  var stopContainer = document.getElementById('stop-container');
  var loadingContainer = document.getElementById('loading-container');

  startButton.addEventListener('click', startGremlins);
  stopButton.addEventListener('click', stopGremlins);

  chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
      if(message.type !== 'GremlinsState') {
        return;
      }

      onStateUpdated(message.state);
    });

  function showStopUi() {
    startContainer.style.display = 'none';
    stopContainer.style.display = 'block';
    loadingContainer.style.display = 'none';
  }

  function showStartUi() {
    startContainer.style.display = 'block';
    stopContainer.style.display = 'none';
    loadingContainer.style.display = 'none';
  }

  function startGremlins() {
    if (seedInput.checkValidity()) {
      backgroundPage.startGremlins(seedInput.value);
    }
  }
  
  function stopGremlins() {
    backgroundPage.stopGremlins();
  }

  function onStateUpdated(state){
    switch (state) {
      case 'loaded':
        showStartUi();
        break;
      case 'started':
        showStopUi();
        break;
      case 'stopped':
        showStartUi();
        break;
    }
  }
})();
