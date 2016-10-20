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
				console.log($scope.dateRange);

				$scope.days = [];
					for (i=0; i<= $scope.dateRange; i++){
					var addDay = moment(response.data[0].startDate).add(i, 'days');
					$scope.days.push({
						moment: addDay,
						availability: false
					});
				}
				console.log($scope.days);
				//forEach if scope.days.availability = true, push into a separate array

		}).then(function(){
			$http({
				url: '/user/schedule',
				method:'GET'
			}).then(function(response){
				console.log(response.data);
			});
		});
	};
	$scope.save = function(){
		console.log('I am working');
		var data = {
			hangoutId: $routeParams.id,
			availability: $scope.days.filter(
				function(day){
					return day.availability;
				}).map(function(day){

				return day.moment.format();
			})
		};
		$http({
			url: '/user/schedule/',
			method: 'POST',
			data: data
		});
	};
//on click of availability button, toggles date true or false, if true it means available,
//and i push that specific date in to the array
//on click of save button, save this entire object with this list of dates.

//use ng model
}]);

// need to add the user in the backend, save the schedule correctly
// and let the client user know that the save worked
//create a get endpoint to display a user's availability