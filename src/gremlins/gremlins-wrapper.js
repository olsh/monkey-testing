(function () {
  window.onbeforeunload = function () {
    window.postMessage({ type: 'GremlinsState', state: 'unloaded' }, '*');
  };

  function callback() {
    var horde = gremlins.createHorde();

    window.postMessage({ type: 'GremlinsState', state: 'loaded' }, '*');

    horde.before(function () {
      window.postMessage({ type: 'GremlinsState', state: 'started' }, '*');
    });

    horde.after(function () {
      window.postMessage({ type: 'GremlinsState', state: 'stopped' }, '*');
    });

    window.addEventListener('message',
      function (event) {
        if (event.data.type !== 'UpdateGremlinsState') {
          return;
        }

        switch (event.data.state) {
          case 'start':
            if (event.data.seed) {
              horde.seed(event.data.seed);
            }

            if (event.data.delay) {
              horde.strategy(gremlins.strategies.distribution()
                .delay(event.data.delay)
              );
            }

            if (event.data.nb) {
              horde.unleash({ nb: event.data.nb });
            } else {
              horde.unleash();
            }
            break;
          case 'stop':
            horde.stop();
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
