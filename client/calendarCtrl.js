angular.module('myApp').controller('calendarController', ['$routeParams', '$scope', '$http', 'moment', 
function($routeParams, $scope, $http, moment){
	// console.log($routeParams);
	$scope.grabInfo = function(){
		var request = {
			id: $routeParams.id
		};
		$http({
			url: '/user/hangouts/' + $routeParams.id,
			method: 'GET',
			params: request
			}).then(function(response){
				console.log(response.data);
				$scope.data = response.data[0];

				var startDate = moment(response.data[0].startDate);
				var endDate = moment(response.data[0].endDate);
				$scope.dateRange = endDate.diff(startDate, 'days');
				// console.log($scope.dateRange);

				$scope.days = [];
					for (i=0; i<= $scope.dateRange; i++){
					var addDay = moment(response.data[0].startDate).add(i, 'days');
					$scope.days.push({
						moment: addDay,
						availability: false
					});
				}
				// console.log($scope.days);
				
		}).then(function(){
			var request = {id: $routeParams.id};
			$http({
				url: '/user/schedule/' + $routeParams.id,
				method:'GET',
				params: request
			}).then(function(response){
				console.log(response.data);
				var availability = response.data[0].availability.map(function(date){
					return date.slice(0, 10);
				});
				
				$scope.days.forEach(function(day, index){
					// console.log(day.moment.format());
					if (availability.indexOf(day.moment.format().slice(0, 10)) !== -1){
						$scope.days[index].availability = true;
					}
				});
				
				
				// $scope.scheduleData = response.data[0]._id;
				// console.log(response.data[0]._id);

			});
		});
	};
	$scope.save = function(){
		var data = {
			hangoutId: $routeParams.id,
			availability: $scope.days.filter(
				function(day){
					return day.availability;
				}).map(function(day){

				return day.moment.format();
			})
		};
		var request = {id: $routeParams.id};
		$http({
			url: '/user/schedule/' + $routeParams.id,
			method: 'POST',
			data: data,
			params: request
		}).then(function(){

			$scope.grabInfo();
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

//i broke it. if i remove 