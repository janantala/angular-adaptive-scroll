(function () {
/**
 * @ngdoc overview
 * @name adaptive.scroll
 *
 * @description
 * The `adaptive.scroll` module provides components to realize adaptive scrolling
 * in your Angular applications. You can use its components to, for example,
 * let the user scroll in your app by changing the alpha, beta and gamma relations
 * on his mobile device.
 */
var adaptive = angular.module('adaptive.scroll', []);

/**
 * @ngdoc object
 * @name adaptive.scroll.$gyroscope
 * @requires $rootScope
 *
 * @description
 * The `$gyroscope` is your interface to communicate with the device' gyroscope.
 * It provides methods to react on alpha, beta or gamma value changes and it also
 * let's you scroll through your application programatically.
 */
adaptive.factory('$gyroscope', ['$rootScope', function ($rootScope) {

  var alphaStart, betaStart, gammaStart;
  var alpha, beta, gamma;
  var trashold = 20;
  var active = false;
  var onalpha;
  var onbeta;

  var ongamma;

  window.ondeviceorientation = function(event) {
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

    var alphaDiff = getDiff(alphaStart, alpha, -360);
    var betaDiff = getDiff(betaStart, beta, 360);
    var gammaDiff = getDiff(gammaStart, gamma, 180);

    if ((Math.abs(alphaDiff) <= trashold) && (Math.abs(betaDiff) <= trashold) && (Math.abs(gammaDiff) <= trashold)) {
      stopEvent();
    }
    else {
      sendEvent(alphaDiff, betaDiff, gammaDiff);
    }
  };

  var getDiff = function(a, b, interval){
    d1 = a - b;
    d2 = a - b - interval;
    return (Math.abs(d1) < Math.abs(d2)) ? d1 : d2;
  };

  var sendEvent = function(alphaDiff, betaDiff, gammaDiff) {

    if (Math.abs(alphaDiff) > trashold) {
      alphaDiff = alphaDiff < 0 ? alphaDiff + trashold : alphaDiff - trashold;
    }
    if (Math.abs(betaDiff) > trashold) {
      betaDiff = betaDiff < 0 ? betaDiff + trashold : betaDiff - trashold;
    }
    if (Math.abs(gammaDiff) > trashold) {
      gammaDiff = gammaDiff < 0 ? gammaDiff + trashold : gammaDiff - trashold;
    }

    $rootScope.$broadcast('adaptive.scroll:deviceorientation', {'event': 'ondeviceorientation', 'alphaDiff': alphaDiff, 'betaDiff': betaDiff, 'gammaDiff': gammaDiff});

    if (onalpha && alphaDiff !== 0){
      onalpha(alphaDiff);
    }
    if (onbeta && betaDiff !== 0){
      onbeta(betaDiff);
    }
    if (ongamma && gammaDiff !== 0){
      ongamma(gammaDiff);
    }
  };

  var startEvent = function() {
        $rootScope.$broadcast('adaptive.scroll:deviceorientation', {'event': 'ondeviceorientationstart'});
  };

  var stopEvent = function() {
        $rootScope.$broadcast('adaptive.scroll:deviceorientation', {'event': 'ondeviceorientationstop'});
  };

  /**
   * @ngdoc function
   * @name adaptive.scroll.$gyroscope#watchPosition
   * @methodOf adaptive.scope.$gyroscope
   *
   * @description
   * This method starts scrolling by considering the given trashold in degrees.
   *
   * @param {number} degress Trashold in degrees.
   */
  var watchPosition = function(degrees) {
    console.log('trashold', degrees);
    trashold = degrees || trashold;
    active = true;
  };

  /**
   * @ngdoc function
   * @name adaptive.scroll.$gyroscope#ignorePosition
   * @method adaptive.scroll.$gyroscope
   *
   * @description
   * Stops current scrolling.
   */
  var ignorePosition = function() {
    active = false;
    alphaStart = null;
    betaStart = null;
    gammaStart = null;
    stopEvent();
  };

  return {
    watchPosition: function(degrees) {
      watchPosition(degrees);
    },
    ignorePosition: function() {
      ignorePosition();
    },
    /**
     * @ngdoc function
     * @name adaptive.scroll.$gyroscope#onalpha
     * @method adaptive.scroll.$gyroscope
     *
     * @description
     * Registers callback which gets executed when alpha direction changes.
     * You can access the alpha value diff in the callback.
     *
     * @param {object} fn Callback function
     */
    onalpha: function(fn) {
      onalpha = fn;
    },
    /**
     * @ngdoc function
     * @name adaptive.scroll.$gyroscope#onbeta
     * @method adaptive.scroll.$gyroscope
     *
     * @description
     * Registers callback which gets executed when beta direction changes.
     * You can access the beta value diff in the callback.
     *
     * @param {object} fn Callback function
     */
    onbeta: function(fn) {
      onbeta = fn;
    },
    /**
     * @ngdoc function
     * @name adaptive.scroll.$gyroscope#ongamma
     * @method adaptive.scroll.$gyroscope
     *
     * @description
     * Registers callback which gets executed when gamma direction changes.
     * You can access the gamma value diff in the callback.
     *
     * @param {object} fn Callback function
     */
    ongamma: function(fn) {
      ongamma = fn;
    }
  };

}]);

/**
 * @ngdoc object
 * @name adaptive.scroll.directive:adaptivescroll
 * @requires $rootScope
 * @restrict A
 *
 * @description
 * Apply this directive to any scrollable element to make it adaptively scrollable.
 */
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
