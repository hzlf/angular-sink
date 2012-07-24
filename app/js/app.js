var app = angular.module('phonecat', ['phonecatFilters']);

app.config([
	'$routeProvider', function($routeProvider) {

		$routeProvider.when('/phones',
				{templateUrl: 'partials/phone-list.html', controller: PhoneListCtrl});
		$routeProvider.when('/phones/:phoneId',
				{templateUrl: 'partials/phone-detail.html', controller: PhoneDetailCtrl});
		$routeProvider.otherwise({redirectTo: '/phones'});

	}
]);


