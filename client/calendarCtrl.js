angular.module('myApp').controller('calendarController', ['$routeParams', '$scope', '$http', 'moment', '$location', 'AuthService',
function($routeParams, $scope, $http, moment, $location, AuthService){
	// console.log($routeParams);
	$scope.owner = false;
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
				if (response.data[0].owner.username == AuthService.username()){
					$scope.owner = true;
				}
				$scope.hangoutTitle = response.data[0].hangout;

				var startDate = moment(response.data[0].startDate);
				var endDate = moment(response.data[0].endDate);
				$scope.dateRange = endDate.diff(startDate, 'days');
				// console.log($scope.dateRange);

				$scope.days = [];
					for (i=0; i<= $scope.dateRange; i++){
					var addDay = moment(response.data[0].startDate).add(i, 'days');
					$scope.days.push({
						moment: addDay,
						availability: false,
						availableUsers: []
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
				// console.log(response.data);
				
				var availability = response.data.availability.map(function(date){
					return date.slice(0, 10);
				});
				
				$scope.days.forEach(function(day, index){
					// console.log(day.moment.format());
					if (availability.indexOf(day.moment.format().slice(0, 10)) !== -1){
						$scope.days[index].availability = true;
					}
				});

			});
			$http({
				url: '/schedule/' + $routeParams.id,
				method: 'GET'
			}).then(function(response){
				response.data.forEach(function(schedule){
					var availability = schedule.availability.map(function(date){
					return date.slice(0, 10);
					});
					$scope.days.forEach(function(day, index){
					if (availability.indexOf(day.moment.format().slice(0, 10)) !== -1){
						$scope.days[index].availableUsers.push(schedule.username);
					}
				});
				});
				console.log($scope.days);
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

	$scope.delete = function(){
		var x = confirm("Are you sure you want to delete?");
		if (x){
			$http({
				url: '/user/hangouts/' + $routeParams.id,
				method: 'DELETE',
			}).then(function(){
				$location.path('/');
			});
		} else {
			return false;
		}
	};
	
}]);

