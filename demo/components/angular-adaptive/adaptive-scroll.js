(function () {

var adaptive = angular.module('adaptive.scroll', []);

adaptive.factory('$gyroscope', ['$rootScope', function ($rootScope) {

  var alphaStart, betaStart, gammaStart;
  var alpha, beta, gamma;
  var trashold = 20;
  var active;

  window.ondeviceorientation = function(event) {
    console.log(event);
    if (!active) {
      return false;
    }

    alpha = Math.round(event.alpha);
    beta = Math.round(event.beta);
    gamma = Math.round(event.gamma);

    if (!alphaStart && !betaStart && !gammaStart) {
      alphaStart = alpha;
      betaStart = beta;
      gammaStart = gamma;
    }

    console.log('starting', alphaStart, betaStart, gammaStart);
    console.log('current', alpha, beta, gamma);
    console.log('diff', Math.abs(alphaStart - alpha), Math.abs(betaStart - beta), Math.abs(gammaStart - gamma));
    console.log('passed trashold: ' + trashold, Math.abs(alphaStart - alpha) > trashold, Math.abs(betaStart - beta) > trashold, Math.abs(gammaStart - gamma) > trashold);

    if ((Math.abs(alphaStart - alpha) > trashold) || (Math.abs(betaStart - beta) > trashold) || (Math.abs(gammaStart - gamma) > trashold)) {
      sendEvent();
    }
  };

  var sendEvent = function(a,b,c) {
    var alphaDiff = a || (alphaStart - alpha);
    var betaDiff = b || (betaStart - beta);
    var gammaDiff = c || (gammaStart - gamma);
    $rootScope.$broadcast('adaptive.scroll:deviceorientation', {'event': 'ondeviceorientation', 'alphaDiff': alphaDiff, 'betaDiff': betaDiff, 'gammaDiff': gammaDiff});
  };

  var startEvent = function() {
        $rootScope.$broadcast('adaptive.scroll:deviceorientation', {'event': 'ondeviceorientationstart'});
  };

  var stopEvent = function() {
        $rootScope.$broadcast('adaptive.scroll:deviceorientation', {'event': 'ondeviceorientationstop'});
  };

  var watchPosition = function(degrees) {
    console.log('trashold', degrees);
    trashold = degrees || trashold;
    active = true;
  };

  var ignorePosition = function() {
    active = false;
    stopEvent();
  };

  return {
    watchPosition: function(degrees) {
      watchPosition(degrees);
    },
    ignorePosition: function() {
      ignorePosition();
    }
  };

}]);

adaptive.directive('adaptivescroll', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var getOptions = function () {
        return angular.extend({}, scope.$eval(attrs.adaptivescroll));
      };
      var opts = getOptions();
      console.log(opts);


      (function() {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame =
              window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
      }());

      var alphaDiff = 0;
      var betaDiff = 0;
      var gammaDiff = 0;
      var requestId;

      var scroll = function() {
        if (alphaDiff || betaDiff) {
          element[0].scrollTop = element[0].scrollTop + betaDiff;
          element[0].scrollLeft = element[0].scrollLeft + gammaDiff;
        }
        requestId = window.requestAnimationFrame(scroll);
      };

      $rootScope.$on('adaptive.scroll:deviceorientation', function(e, data){

        console.log('received', data);

        if (data.event === 'ondeviceorientation') {
          alphaDiff = data.alphaDiff;
          betaDiff = data.betaDiff;
          gammaDiff = data.gammaDiff;
        }

        if (data.event === 'ondeviceorientation' && !requestId) {
          requestId = window.requestAnimationFrame(scroll);
        }

        if (data.event === 'ondeviceorientationstop' && requestId) {
          window.cancelAnimationFrame(requestId);
          requestId = null;
        }

      });

    }
  };
}]);

})();