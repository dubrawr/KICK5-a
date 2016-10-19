angular.module('myApp').controller('dashboardController',
	['$scope', 'AuthService', '$http', function($scope, AuthService, $http){
	$scope.createHangout = function(){
		AuthService.createHangout(
			$scope.hangoutForm.name,
			$scope.hangoutForm.startDate,
			$scope.hangoutForm.endDate,
			$scope.hangoutForm.invited
		);
		$scope.showHangouts();
	};
	$scope.showHangouts = function(){
		$http({
			url: '/user/hangouts',
			method: 'GET'
		}).then(function(response){
			$scope.results = response.data;
			console.log(response.data);
		
		});
	};
	//show hangouts needs to also perform a GET that searches the invited list
}]);