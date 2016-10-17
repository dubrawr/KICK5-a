angular.module('myApp').controller('dashboardController',
	['$scope', 'AuthService', '$http', function($scope, AuthService, $http){
	$scope.createHangout = function(){
		AuthService.createHangout(
			$scope.hangoutForm.name,
			$scope.hangoutForm.date,
			$scope.hangoutForm.invited
		);
	};
	$scope.showHangouts = function(){
		$http({
			url: '/user/hangouts',
			method: 'GET'
		}).then(function(response){
			$scope.results = response.data;
		});
	};
}]);