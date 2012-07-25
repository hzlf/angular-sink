describe('PhoneCat App', function() {

	describe('Phone list view', function(){

		beforeEach(function() {
			browser().navigateTo('../../app/index.html');
		});

		it('should filter the phone list as user types into the search box', function() {
			expect(repeater('.phones li').count()).toBe(20);

			input('query').enter('samsung');
			expect(repeater('.phones li').count()).toBe(5);

			input('query').enter('motorola');
			expect(repeater('.phones li').count()).toBe(8);
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
				toEqual(['Motorola XOOM\u2122 with Wi-Fi', 'MOTOROLA XOOM\u2122']);

			select('orderProp').option('Alphabetical');

			expect(repeater('.phones li', 'Phones List').column('phone.name')).
				toEqual(['MOTOROLA XOOM\u2122', 'Motorola XOOM\u2122 with Wi-Fi']);

		});

		it('should render phone specific links', function() {
			input('query').enter('nexus');
			element('.phones li a').click();
			expect(browser().location().url()).toBe('/phones/nexus-s');
		});

		it('should redirect index.html to index.html/#/phones', function() {
			browser().navigateTo('../../app/index.html');
			expect(browser().location().url()).toBe('/phones');
		});

	});



	describe('Phone detail view', function() {

		beforeEach(function() {
			browser().navigateTo('../../app/index.html#/phones/nexus-s');
		});

		//it('should display placeholder page with phoneId', function() {
			//expect(binding('phoneId')).toBe('nexus-s');
		//});

		it('should display nexus-s page', function() {
			expect(binding('phone.name')).toBe('Nexus S');
		});

		it('should have 4 thumbnails on the nexus-s page', function() {
			expect(element('.phone-thumbs li img').count()).toBe(4);
		});

		it('should display the first phone image as the main phone image', function() {
			expect(element('img.phone').attr('src')).toBe('img/phones/nexus-s.0.jpg');
		});

		it('should swap the main image if a thumbnail image is clicke on', function() {
			element('.phone-thumbs li:nth-child(3) img').click();
			expect(element('img.phone').attr('src')).toBe('img/phones/nexus-s.2.jpg');

			element('.phone-thumbs li:nth-child(1) img').click();
			expect(element('img.phone').attr('src')).toBe('img/phones/nexus-s.0.jpg');
		});

	});
	

});
