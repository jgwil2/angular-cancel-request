'use strict';

var app = angular.module('cancelRequestApp', [
	'appControllers',
	'appServices'
]);

var appControllers = angular.module('appControllers', []),
	appServices = angular.module('appServices', []);

appControllers.controller('mainController', function($scope, FriendsService, CancelRequestService){

	$scope.name = 'John';

	$scope.getFriends = function(name){
		$scope.error = null;
		$scope.loading = true;

		var friendsPromise = FriendsService.getFriends(name);

		friendsPromise.then(
			function(data){
				$scope.loading = false;
				$scope.data = data;
			},
			function(error){
				$scope.loading = false;
				$scope.error = error.message;
			}
		);
	};

	$scope.cancelRequests = function(){
		CancelRequestService.cancelRequests();
	};
});

appServices.factory('FriendsService', function($http, CancelRequestService){
	return {
		getFriends: function(name){
			var request = $http.post(
				'api/friends',
				name,
				{timeout: CancelRequestService.getCanceller()}
			);

			var promise = request.then(
				function(fulfilled){
					return fulfilled.data;
				},
				function(rejected){
					throw new Error(rejected.config.timeout.$$state.value);
				}
			);

			return promise;
		}
	};
});

appServices.factory('CancelRequestService', function($q){
	var cancellers = [];

	return {
		getCanceller: function(){
			var canceller = $q.defer();
			cancellers.push(canceller);
			return canceller.promise;
		},
		cancelRequests: function(){
			cancellers.forEach(function(canceller){
				canceller.resolve('Request cancelled');
			});
		}
	};
});