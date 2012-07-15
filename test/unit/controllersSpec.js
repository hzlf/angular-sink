describe('PhoneCat controllers', function() {

	describe('PhoneListCtrl', function() {

		var scope,
			ctrl;

		beforeEach(function() {
			scope = {};
			ctrl = new PhoneListCtrl(scope);
		});


		it('should create "phones" model with 3 phones', function() {
			expect(scope.phones.length).toBe(3);
		});

		it('should create a Welcome message', function() {
			expect(scope.hello).toEqual("Hello World!");
		});


	});


});
