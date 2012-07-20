function PhoneListCtrl($scope, $http) {

	$http.get('data/phones.json').success(function(data) {
		//$scope.phones = data.splice(0, 5);
		$scope.phones = data;
	});

	$scope.hello = "Hello World!";
	$scope.orderProp = 'age';
}

// Inject this ordered list of services into this controller.
// Also this avoid any minification issues w/ services names.
PhoneListCtrl.$inject = ['$scope', '$http'];
