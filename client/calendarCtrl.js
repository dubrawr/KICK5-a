angular.module('myApp').controller('calendarController', ['$routeParams', '$scope', '$http', 'moment', 
function($routeParams, $scope, $http, moment){
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
				$scope.data = response.data[0];
				var startDate = moment(response.data[0].startDate);
				var endDate = moment(response.data[0].endDate);
				$scope.dateRange = endDate.diff(startDate, 'days');
				$scope.days = [];
				console.log($scope.dateRange);
				for (i=0; i<= $scope.dateRange; i++){
					var addDay = moment(response.data[0].startDate).add(i, 'days');
					$scope.days.push(addDay);
					
				}
				console.log($scope.days);


		});
	};


	// i need to make a get request based on the routeparams to pull
//	the info from the correct hangout.
}]);