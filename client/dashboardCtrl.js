angular.module('myApp').controller('dashboardController', ['$scope', 'AuthService', function($scope, AuthService){
	$scope.createHangout = function(){
		AuthService.createHangout(
			$scope.hangoutForm.name,
			$scope.hangoutForm.date,
			$scope.hangoutForm.invited
		);
	};
	// $scope.showHangouts = function(){
	// 	$http({
	// 		url: '/hangouts',
	// 		method: 'GET'
	// 	}).then(function(response){
	// 		console.log(response);
			// for (var index = 0; index < data.length; index++)
   //          $('ul').append("<div class='col-lg-4'><li class='btn btn-primary' id=" + data[index]._id + " role='button'>" +data[index].hangout+ "</li></div>");
		// });
	// };
}]);