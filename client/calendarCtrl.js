angular.module('myApp').controller('calendarController', ['$routeParams', '$scope', '$http', 
function($routeParams, $scope, $http){
	console.log($routeParams);
	$scope.grabInfo = function(){
		console.log('hello');
		var request = {
			id: $routeParams.id
		};
		$http({
			url: '/user/hangouts/' + $routeParams.id,
			method: 'GET',
			params: request
			}).then(function(response){
			console.log(response.data);
		});
	};


	// i need to make a get request based on the routeparams to pull
//	the info from the correct hangout.
}]);