(function() {
  function callback() {
    var horde = gremlins.createHorde();

    window.postMessage({ type: 'GremlinsState', state: 'loaded' }, '*');
    window.addEventListener('message',
      function(event) {
        if (event.data.type !== 'UpdateGremlinsState') {
          return;
        }

        switch (event.data.state) {
          case 'start':
            if (event.data.seed) {
              horde.unleash(event.data.seed);
            }
            
            window.postMessage({ type: 'GremlinsState', state: 'started' }, '*');
            break;
          case 'stop':
            horde.stop();
            window.postMessage({ type: 'GremlinsState', state: 'stopped' }, '*');
            break;
          default:
        }
      });
  }

  var script = document.createElement('script');
  script.src = 'https://rawgit.com/olsh/monkey-testing/master/src/gremlins/gremlins.min.js';
  if (script.addEventListener) {
    script.addEventListener('load', callback, false);
  } else if (script.readyState) {
    script.onreadystatechange = callback;
  }
  document.body.appendChild(script);
})();
