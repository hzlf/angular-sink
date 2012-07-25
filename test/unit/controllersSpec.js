/*global PhoneListCtrl, PhoneDetailCtrl */

describe('PhoneCat controllers', function() {

	describe('PhoneListCtrl', function() {

		var scope, ctrl, $httpBackend, phones;

		// inject is defined in angular-mocks.js
		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
			phones = [{name: 'Nexus S'}, { name: 'Motorola DROID' }];
			$httpBackend = _$httpBackend_;
			// train the mock to match some expectations
			$httpBackend.expectGET('data/phones/phones.json')
				.respond(phones);
			
			// create a new scope from the angular root scope
			scope = $rootScope.$new();
			// binds the scope to our System Under Test (the phone list controller)
			ctrl = $controller(PhoneListCtrl, {$scope: scope});
		}));

		it('should create "phones" model with 2 phones fetched from xhr', function() {
			// initially the scope of our SUT should not know any phones at all
			expect(scope.phones).toBeUndefined();
			$httpBackend.flush(); // flush the xhr request queue in the browser
			// is our SUT really fetching the data and populating its scope ?
			expect(scope.phones).toEqual([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
		});

		it('should create a Welcome message', function() {
			expect(scope.hello).toEqual("Hello World!");
		});

		it('should set the default value of orderProp model', function() {
			expect(scope.orderProp).toBe('age');
		});

		//it('should splice the phone list up to 5 maximum phones', inject(function($controller) {
			//// adjust phones list to have more than 5 phones
			//phones = [
				//{name: 'Nexus S'},
				//{name: 'Motorola DROID'},
				//{name: 'Motorola DROID 2'},
				//{name: 'Nexus S 2'},
				//{name: 'Nexus S 3'},
				//{name: 'Nexus S 4'},
				//{name: 'Nexus S 5'}
			//];
			//$httpBackend.expectGET('data/phones/phones.json')
				//.respond(phones);

			//expect(scope.phones).toBeUndefined();
			//// Construct again the controller (and browser request queue) and flush
			//ctrl = $controller(PhoneListCtrl, {$scope: scope});
			//$httpBackend.flush();

			//expect(scope.phones.length).toEqual(5);
		//}));

	});

	describe('PhoneDetailCtrl', function() {
		var scope, $httpBackend, ctrl, phone;

		beforeEach(inject(function(_$httpBackend_, $rootScope, $routeParams, $controller) {
			phone = ({name: 'phone xyz', images: ['img1', 'img2']});
			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET('data/phones/xyz.json').respond(phone);

			$routeParams.phoneId = 'xyz';
			scope = $rootScope.$new();
			ctrl = $controller(PhoneDetailCtrl, {$scope: scope});
		}));

		it('should fetch phone detail', function() {
			expect(scope.phone).toBeUndefined();
			$httpBackend.flush();
			expect(scope.phone).toEqual(phone);
		});

		it('should put a mainImage property on the controller scope', function() {
			expect(scope.mainImageUrl).toBeUndefined();
			$httpBackend.flush();
			expect(scope.mainImageUrl).toEqual('img1');
		});

		it('should have a "set main image" function on the controller scope', function() {
			$httpBackend.flush();
			scope.setImage('img2');
			expect(scope.mainImageUrl).toEqual('img2');
			scope.setImage('img1');
			expect(scope.mainImageUrl).toEqual('img1');
		});
	});
	


});
