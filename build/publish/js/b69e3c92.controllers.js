function PhoneListCtrl($scope, Phone) {

	// old fashion way  (before step_11 on angularJS tutorial)
	//$http.get('data/phones/phones.json').success(function(data) {
		////$scope.phones = data.splice(0, 5);
		//$scope.phones = data;
	//});
	$scope.phones = Phone.query();

	$scope.hello = "Hello World!";
	$scope.orderProp = 'age';
}
// Inject this ordered list of services into this controller.
// Also this avoid any minification issues w/ services names.
PhoneListCtrl.$inject = ['$scope', 'Phone'];



function PhoneDetailCtrl($scope, $routeParams, Phone) {
	$scope.phoneId = $routeParams.phoneId;
	// old fashion way  (before step_11 on angularJS tutorial)
	//$http.get('data/phones/' + $routeParams.phoneId + '.json').success(function(data) {
		//$scope.phone = data;
		//$scope.mainImageUrl = data.images[0];
	//});
	$scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
		$scope.mainImageUrl = phone.images[0];
	});
	
	$scope.setImage = function(imageUrl) {
		$scope.mainImageUrl = imageUrl;
	};

	$scope.hello = function(name) {
		alert('Hello ' + (name || 'world') + '!');
	};

}
PhoneDetailCtrl.$inject = ['$scope', '$routeParams', 'Phone'];

