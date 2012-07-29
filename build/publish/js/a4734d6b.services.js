function Phone($resource) {
	return $resource('data/phones/:phoneId.json', {phoneId: 'phones'});
}
Phone.$inject = ['$resource'];

angular.module('phonecatServices', ['ngResource']).factory('Phone', Phone);
