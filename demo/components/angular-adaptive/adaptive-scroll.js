(function () {

var adaptive = angular.module('adaptive.scroll', []);

adaptive.factory('$gyroscope', ['$rootScope', function ($rootScope) {

  var alphaStart, betaStart, gammaStart;
  var alpha, beta, gamma;
  var trashold = 20;
  var active;

  window.ondeviceorientation = function(event) {
    alpha = Math.round(event.alpha);
    beta = Math.round(event.beta);
    gamma = Math.round(event.gamma);

    if (active && !alphaStart && !betaStart && !gammaStart) {
      alphaStart = alpha;
      betaStart = beta;
      gammaStart = gamma;
    }

    console.log(alpha, beta, gamma);
    console.log(Math.abs(alphaStart - alpha), Math.abs(betaStart - beta), Math.abs(gammaStart - gamma));
    console.log(Math.abs(alphaStart - alpha) > trashold, Math.abs(betaStart - beta) > trashold, Math.abs(gammaStart - gamma) > trashold);

    if (active) {
      if ((Math.abs(alphaStart - alpha) > trashold) || (Math.abs(betaStart - beta) > trashold) || (Math.abs(gammaStart - gamma) > trashold)) {
        sendEvent();
      }
      else {
        sendEvent(0,0,0);
      }
    }
  };

  var sendEvent = function(a,b,c) {
    var alphaDiff = a || (alphaStart - alpha);
    var betaDiff = b || (betaStart - beta);
    var gammaDiff = c || (gammaStart - gamma);
    $rootScope.$broadcast('adaptive.scroll:deviceorientation', {'alphaDiff': alphaDiff, 'betaDiff': betaDiff, 'gammaDiff': gammaDiff});
  };

  var watchPosition = function(degrees) {
    console.log('w', degrees);
    trashold = degrees || trashold;
    active = true;
  };

  var ignorePosition = function() {
    active = false;
    sendEvent(0,0,0);
  };

  return {
    watchPosition: function(degrees) {
      console.log('rw', degrees);
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

      window.requestAnimationFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ){
                  window.setTimeout(callback, 1000 / 60);
                };
      })();

      var alphaDiff = 0;
      var betaDiff = 0;
      var gammaDiff = 0;

      var scroll = function() {
        if (alphaDiff || betaDiff) {
          element[0].scrollTop = element[0].scrollTop + alphaDiff; 
          element[0].scrollLeft = element[0].scrollLeft + betaDiff;
        }
        window.requestAnimationFrame(scroll);
      };

      window.requestAnimationFrame(scroll);

      $rootScope.$on('adaptive.scroll:deviceorientation', function(e, data){

        alphaDiff = data.alphaDiff;
        betaDiff = data.betaDiff;
        gammaDiff = data.gammaDiff;

        console.log('received', {'alphaDiff': alphaDiff, 'betaDiff': betaDiff, 'gammaDiff': gammaDiff});

      });

    }
  };
}]);


})();