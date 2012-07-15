describe('PhoneCat App', function() {

	describe('Phone list view', function(){


		beforeEach(function() {
			browser().navigateTo('../../index.html')
		});

		it('shoud filter the phone list as user types into the search box', function() {
			expect(repeater('.phones li').count()).toBe(3);
		});

	});
});
