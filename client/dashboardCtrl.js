angular.module('myApp').controller('dashboardController', ['$scope', 'AuthService', '$http', function($scope, AuthService, $http){
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
			console.log(response);
			for (var index = 0; index < response.data.length; index++)
            $('ul').append("<div class='col-lg-4'><li class='btn btn-primary' id=" + response.data[index]._id + " role='button'>" + response.data[index].hangout+ "</li></div>");
		});
	};
}]);