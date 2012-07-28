/*global Phone */

describe('PhoneCat Services', function() {

	beforeEach(function(){

		module('phonecatServices');

		this.addMatchers({
			toEqualData: function(expected) {
				return angular.equals(this.actual, expected);
			}
		});
	});


	describe('Phone RESTful service', function() {
		var $httpBackend,
			phones = [{name: 'Nexus S'}, {name: 'Motorola DROID'}],
			$Phone;
			
		beforeEach(inject(function(_$httpBackend_, Phone) {
			$httpBackend = _$httpBackend_;
			$Phone = Phone;
		}));


		it('should have a phoneId parameter', function() {
			var phone = {name: 'phone xyz'};
			$httpBackend.expectGET('data/phones/xyz.json').respond(phone);

			var _phone = $Phone.get({phoneId: 'xyz'});
			$httpBackend.flush();
			expect(_phone).toEqualData(phone);
		});
		
		it('should fetch by default all phones data', function() {
			$httpBackend.expectGET('data/phones/phones.json').respond(phones);

			var _phones = $Phone.query();
			$httpBackend.flush();
			expect(_phones).toEqualData(phones);
		});

	});
	

});

