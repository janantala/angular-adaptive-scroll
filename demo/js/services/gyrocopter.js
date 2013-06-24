angular.module('gyroscroll').factory('$gyrocopter', ['$rootScope', function ($rootScope) {

  var orientateDevice = function(alpha, beta, gamma, absolute){
    absolute = absolute || false;
    var event = document.createEvent("DeviceOrientationEvent");
    event.initDeviceOrientationEvent("deviceorientation", false, false, alpha, beta, gamma, absolute);
    window.dispatchEvent(event);
  };

  return {
    orientateDevice: function(alpha, beta, gamma, absolute) {
      orientateDevice(alpha, beta, gamma, absolute);
    }
  };

}]);