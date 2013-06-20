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

  var start = function(degrees) {
    alphaStart = alpha;
    betaStart = beta;
    gammaStart = gamma;
    trashold = degrees || trashold;
    active = true;
  };

  var stop = function() {
    active = false;
  };

  return {
    start: function() {
      start();
    },
    stop: function() {
      stop();
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
          element.scrollTop = element.scrollTop + alphaDiff; 
          element.scrollLeft = element.scrollLeft + betaDiff;
        }
      };

      window.requestAnimationFrame(scroll);

      $rootScope.$on('adaptive.scroll:deviceorientation', function(e, data){
        var alphaDiff = data.alphaDiff;
        var betaDiff = data.betaDiff;
        var gammaDiff = data.gammaDiff;
      });

    }
  };
}]);


})();