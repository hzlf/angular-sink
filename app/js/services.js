angular.module('phonecatServices', ['ngResource']).factory('Phone', function($resource) {
	return $resource('data/phones/:phoneId.json', {phoneId: 'phones'});
});
