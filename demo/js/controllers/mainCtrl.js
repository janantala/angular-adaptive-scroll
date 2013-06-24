/*global gyroscroll */
(function () {
'use strict';

/**
 * The main controller for the app. 
 */
gyroscroll.controller('mainCtrl', function mainCtrl($scope, $gyroscope, $rootScope) {
	$scope.lines = [];
	for (var i=0 ; i< 1000; i++) {
		$scope.lines.push(i + ' ' + 'line');
	}

	$scope.start = function(){
		console.log('start');
		$gyroscope.watchPosition(10);
	};

	$scope.stop = function(){
		console.log('stop');
		$gyroscope.ignorePosition();
	};
});

})();