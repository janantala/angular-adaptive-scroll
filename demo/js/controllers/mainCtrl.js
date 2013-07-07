/*global gyroscroll */
(function () {
'use strict';

/**
 * The main controller for the app. 
 */
gyroscroll.controller('mainCtrl', function mainCtrl($scope, $gyroscope, $rootScope) {
	$scope.lines = [];
	for (var i=0 ; i< 50; i++) {
		$scope.lines.push(i + ' ' + 'line');
	}

	$scope.gyro = {};

	$scope.start = function(){
		console.log('start');
		$gyroscope.watchPosition(15);
		$scope.gyro.started = true;
	};

	$scope.stop = function(){
		console.log('stop');
		$gyroscope.ignorePosition();
		$scope.gyro.started = false;
	};

	$gyroscope.onalpha(function(alphaDiff){
		console.log(alphaDiff);
	});
	$gyroscope.onbeta(function(betaDiff){
		console.log(betaDiff);
	});
	$gyroscope.ongamma(function(gammaDiff){
		console.log(gammaDiff);
	});
});

})();