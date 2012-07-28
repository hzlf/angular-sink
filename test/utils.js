var TestUtils = {};

TestUtils.matchers = {
	toEqualData: function(expected) {
		return angular.equals(this.actual, expected);
	}
};
