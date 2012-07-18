describe('PhoneCat App', function() {

	describe('Phone list view', function(){

		beforeEach(function() {
			browser().navigateTo('../../app/index.html');
		});

		it('should filter the phone list as user types into the search box', function() {
			expect(repeater('.phones li').count()).toBe(3);

			input('query').enter('nexus');
			expect(repeater('.phones li').count()).toBe(1);

			input('query').enter('motorola');
			expect(repeater('.phones li').count()).toBe(2);
		});

		it('should display the current filter value within an element with id "status"', function () {
			expect(element('#status').text()).toMatch(/Current filter: \s*$/);

			input('query').enter('nexus');
			
			expect(element('#status').text()).toMatch(/Current filter: nexus\s*$/);

			using("#status").expect(binding('query')).toBe('nexus');
		});

		it('should be possible to control phone order via a dropdown select box', function() {
			//let's narrow dow the dataset to make the test assertions shorter
			input('query').enter('tablet');
			expect(repeater('.phones li', 'Phone List').column('phone.name')).
				toEqual(['Motorola XOOM with Wi-Fi', 'MOTOROLA XOOM']);

			select('orderProp').option('Alphabetical');

			expect(repeater('.phones li', 'Phones List').column('phone.name')).
				toEqual(['MOTOROLA XOOM', 'Motorola XOOM with Wi-Fi']);

		});

	});
});
