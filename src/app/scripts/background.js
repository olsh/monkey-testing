'use strict';

var global = {
  updateGremlinsType: 'UpdateGremlinsState',
  states: []
};

chrome.runtime.onMessage.addListener(function (message, sender, response) {
  if(sender.tab) {
    addOrUpdateState(sender.tab, message.state);
  }
});

function injectScript() {
  chrome.tabs.executeScript({
    file: 'content.js'
  });
}

function startGremlins(seed) {
  chrome.tabs.query({active:true,currentWindow:true},function(tabArray){
    chrome.tabs.sendMessage(tabArray[0].id, {
      type: global.updateGremlinsType,
      state: 'start',
      seed: seed
    });
  });
}

function stopGremlins() {
  chrome.tabs.query({active:true,currentWindow:true},function(tabArray){
    chrome.tabs.sendMessage(tabArray[0].id, {
      type: global.updateGremlinsType,
      state: 'stop'
    });
  });
}

function queryStatus(callback) {
  chrome.tabs.query({active:true,currentWindow:true},function(tabArray){
    var currentTab = tabArray[0];

    var state = getStateByTabId(currentTab.id);
    if (state) {
      callback(state.state);
    } else {
      callback(null);
    }
  });
}

function addOrUpdateState(tab, state) {
  var existingTab = getStateByTabId(tab.id);
  if (existingTab) {
    existingTab.state = state;
  } else {
    global.states.push({
      tabId: tab.id,
      state: state
    });
  }
}

function getStateByTabId(tabId) {
  var states = global.states;
  for (var i = 0; i < states.length; i++) {
    var currentState = states[i];
    if (currentState.tabId === tabId) {
      return currentState;
    }
  }

  return null;
}
