define([ "helperMethods" ], function ( helpers, undef ) {
	"use strict";
	
    describe("core/helperMethods.js", function () {
        describe("throwThis", function () {				 
			it("should throw the passed in string", function () {
				var msg = "This is a test error message";
		
				var thrower = function () {
					helpers.throwThis(msg);
				};
				
				expect(thrower).toThrow();
				expect(thrower).toThrowError(msg);
			});
		});
    		
		describe("isUndefined", function() {
			it("should return true for undefined", function () {
				 expect(helpers.isUndefined(undef)).toBe(true);
			});
			
			it("should return true for null", function () {
				 expect(helpers.isUndefined(null)).toBe(true);
			});
			
			it("should return false for an empty string", function () {
				 expect(helpers.isUndefined("")).toBe(false);
			});
			
			it("should return false for an empty array", function () {
				expect(helpers.isUndefined([])).toBe(false);
			});
			
			it("should return false for an empty object", function () {
				expect(helpers.isUndefined({})).toBe(false);
			});
			
			it("should return false for a function", function () {
				expect(helpers.isUndefined(function () {})).toBe(false);
			});
		});
		
		describe("isObjectOrArray", function () {
			it("should return false for undefined", function () {
				 expect(helpers.isObjectOrArray(undef)).toBe(false);
			});
			
			it("should return false for null", function () {
				 expect(helpers.isObjectOrArray(null)).toBe(false);
			});
			
			it("should return false for an empty string", function () {
				 expect(helpers.isObjectOrArray("")).toBe(false);
			});
			
			it("should return true for an empty array", function () {
				expect(helpers.isObjectOrArray([])).toBe(true);
			});
			
			it("should return true for an empty object", function () {
				expect(helpers.isObjectOrArray({})).toBe(true);
			});
			
			it("should return false for a function", function () {
				expect(helpers.isObjectOrArray(function () {})).toBe(false);
			});
			
			it("should return false for no param", function () {
				expect(helpers.isObjectOrArray()).toBe(false);
			});
		});				
		
		describe("isObject", function () {
			it("should return false for undefined", function () {
				 expect(helpers.isObject(undef)).toBe(false);
			});
			
			it("should return false for null", function () {
				 expect(helpers.isObject(null)).toBe(false);
			});
			
			it("should return false for an empty string", function () {
				 expect(helpers.isObject("")).toBe(false);
			});
			
			it("should return false for an empty array", function () {
				expect(helpers.isObject([])).toBe(false);
			});
			
			it("should return true for an empty object", function () {
				expect(helpers.isObject({})).toBe(true);
			});
			
			it("should return false for a function", function () {
				expect(helpers.isObject(function () {})).toBe(false);
			});
			
			it("should return false for no param", function () {
				expect(helpers.isObject()).toBe(false);
			});
		});
		
		describe("isArray", function () {
			it("should return false for undefined", function () {
				 expect(helpers.isArray(undef)).toBe(false);
			});
			
			it("should return false for null", function () {
				 expect(helpers.isArray(null)).toBe(false);
			});
			
			it("should return false for an empty string", function () {
				 expect(helpers.isArray("")).toBe(false);
			});
			
			it("should return true for an empty array", function () {
				expect(helpers.isArray([])).toBe(true);
			});
			
			it("should return false for an empty object", function () {
				expect(helpers.isArray({})).toBe(false);
			});
			it("should return false for a function", function () {
				expect(helpers.isArray(function () {})).toBe(false);
			});
			
			it("should return false for no param", function () {
				expect(helpers.isArray()).toBe(false);
			});
		});
		
		describe("asArray", function () {
			it("should not change a valid array containing an empty string", function () {
				expect(helpers.asArray([""])).toEqual([""]);
			});
			
			it("should not change a valid array containing an empty object", function () {
				expect(helpers.asArray([{}])).toEqual([{}]);
			});
			
			it("should return an empty array for no param", function () {
				expect(helpers.asArray()).toEqual([]);
			});
			
			it("should return an empty array for no undefined", function () {
				expect(helpers.asArray(undef)).toEqual([]);
			});
			
			it("should return an array containing an empty object when an empty object is passed in", function () {
				expect(helpers.asArray({})).toEqual([{}]);
			});
			
			it("should reutrn an array containing a function that is passed in", function () {
				var func = function () {};
				expect(helpers.asArray(func)).toEqual([func]);
			});
		});
				
		describe("forEach", function () {
			it("should call an action for every item in an array", function () {
				var arr = ["1", "2", "3"];
					
				var output = [];
				
				helpers.forEach(arr, function (num) {
					output.push(num);
				});
			
				expect(arr).toEqual(output);
			});
			
			it("should wrap other types of params in array and the callback once on that", function () {
				var count = 0;
				var obj = {};
				
				var output;
				helpers.forEach(obj, function (something) {
					output = something;
						count++;
				});
				
				expect(output).toEqual(obj);
				expect(count).toEqual(1);
			});
			
			it("should never call the action from an empty array", function () {
				var actionCalled = false;
					
				helpers.forEach([], function () {
					actionCalled = true;
				});
				
				expect(actionCalled).toBe(false);
			});
		});
				
		/* (collection, isBottomFilterAction, getChildCollectionAction, bottomAction) */
		describe("forUntilBottom", function () {
			it("should not keep searching when it finds the bottom of a stack", function () {
				var testData = [{
					next: [{ bottom: true }]
				}, 
				{
					bottom: true,
					next: [
						{ bottom: true },
						{ bottom: true }
					]
				}, 
				{
					next: [
						{ bottom: true }, 
						{ bottom: true },
						{ bottom: true }
					]
				}];
					
				var bottomCount = 0;
				helpers.forUntilBottom(testData, 
					function (obj) {
						return obj.bottom;
					},
					function (obj) {
						return obj.next;
					},
					function () { /* Bottom Action */
						bottomCount++;
					});
					
				expect(bottomCount).toEqual(5); /* See those six on the bottom! */
			});
			
			it("should not call any action for an empty collection", function () {
				var actionCalled = false;
					
					var action = function () {
						actionCalled = true;
					};
					
					helpers.forUntilBottom([], action, action, action);
					
					expect(actionCalled).toBe(false);
			});
		});
				
		describe("select", function () {
			it("should select the items it's told to", function () {
				var testArr = [
					{ data: { data: {} } },
					{ data: { data: {} } },
					{ data: { data: {} } },
				];
				
				var expected = [
				   {}, {}, {},
				];
			
				var output = helpers.select(testArr, function (obj) {
					return obj.data.data;
				});
					
				expect(output).toEqual(expected);
			});
		});
				
		describe("where", function () {
			it("should filter to only object where a predicate returns true", function () {
				var data = [1, 2, 3];
					
				var filtered = helpers.where(data, function (num) {
					return num === 2;
				});
				
				expect(filtered).toEqual([2]);
			});
				
			it("should include duplicate results", function () {
				var data = [1, 2, 2, 3, 2];
					
				var filtered = helpers.where(data, function (num) {
					return num === 2;
				});
				
				expect(filtered).toEqual([2, 2, 2]);
			});
				
				it("should return the same array if the predicate always returns true", function () {
					var data = [1, 2, 3];
						
					var filtered = helpers.where(data, function () {
						return true; /* Keep all */
					});
						
					expect(filtered).toEqual(data);
				});
										
				it("should return the an empty array if the predicate finds no maches", function () {
					var data = [1, 2, 3];
						
					var filtered = helpers.where(data, function () {
						return false; /* throw away all */
					});
					
					expect(filtered).toEqual([]);
				});
		});
		
		/* (collection, moreThanOneResultsAction, zeroResultsAction) */
		describe("single", function () {
			it("should return the item at index 0 of an array", function () {
				var data = {};
				expect(helpers.single([data])).toBe(data);
			});
				
				
			it("should return the value of the proper function if the length != 1", function () {
				var multiResult = "multi";
				var zeroResult = "zero";
				
				var onZero = function () { return zeroResult; };
				var onMulti = function () { return multiResult; };
				
				expect(helpers.single([1, 2], onMulti, onZero)).toBe(multiResult);
				expect(helpers.single([], onMulti, onZero)).toBe(zeroResult);
			});
			
			it("should throw if an action is not provided", function () {
				var zeroThrower = function () {
					helpers.single([]);
				};
				
				var multiThrower = function () {
					helpers.single([1, 2]);
				};
			
				expect(zeroThrower).toThrow();
				expect(multiThrower).toThrow();
			});
		});
				
		/* (collection, zeroResultsAction) */
		describe("first", function () {
			it("should return the item at index 0 of an array", function () {
				var data = {};
				expect(helpers.first([data])).toBe(data);
			});
				
			it("should return the value from the zeroAction function param if the array is empty", function () {							
				var zeroResult = "zero";
				
				var onZero = function () { return zeroResult; };
				
				expect(helpers.first([], onZero)).toBe(zeroResult);
			});
				
			it("should throw if an zeroAction is not provided", function () {
				var thrower = function () {
					helpers.first([]);
				};
				
				expect(thrower).toThrow();
			});
		});
				
		describe("clone", function () {
			it("should be able to clone an array", function () {
				expect(helpers.clone([])).toEqual([]);
			});
			
			it("should be able to clone an object", function () {
				expect(helpers.clone({})).toEqual({});						
			});
									
			it("should just return a string", function () {
				var str = "hello";
				expect(helpers.clone(str)).toEqual(str);
			});
			
			it("should just return a number", function () {
				var num = 1;
				expect(helpers.clone(num)).toEqual(num);
			});
			
			it("should just return a function", function () {
				var func = function () {};
				expect(helpers.clone(func)).toEqual(func);
			});
		});
		
		describe("distinct", function () {
			it("should be able to distinct with a select action", function () {
				var data = [{
					x: true, 
					y: true,
				},
				{
					x: true, 
					y: false,
				},
				{
					x: false, 
					y: false,
				},
				{
					x: false, 
					y: true,
				}];
				
				var expected = [{
					x: true, 
					y: true,
				},
				{
					x: false, 
					y: false,
				}];
				
				var result = helpers.distinct(data, function (item) {
					return item.x;
				});
				
				expect(result).toEqual(expected);
			});
			
			it("should be able to distinct without a select action", function () {
				var data     = [1, 2, 3, 2, 3, 2, 1, 3, 2, 3, 3, 3, 3, 1, 3, 4, 1, 2, 2];
				var expected = [1, 2, 3, 4];
				
				var result = helpers.distinct(data);
				
				expect(result).toEqual(expected);
			});
			
			it("should return an empty array for a given empty array", function () {
				var result = helpers.distinct([]);
				expect(result).toEqual([]);
			});
			
			it("should throw a type error if collection is an object (not of type array)", function () {
				var thrower = function () {
					helpers.distinct({ test: 2, another: 2, something: 2 });
				};
				expect(thrower).toThrowError(TypeError);
			});
			
			it("should throw a type error if collection is an function", function () {
				var thrower = function () {
					helpers.distinct(function () { return "test"; });
				};
				expect(thrower).toThrowError(TypeError);
			});
			
			it("should throw a type error if collection is an number", function () {
				var thrower = function () {
					helpers.distinct(12);
				};
				expect(thrower).toThrowError(TypeError);
			});
			
			it("should throw a type error if collection is an string", function () {
				var thrower = function () {
					helpers.distinct("Throw something please.");
				};
				expect(thrower).toThrowError(TypeError);
			});
		});
		
		describe("callUntil", function () {
			it("should call the given function until @until returns true", function () {
				var callCount = 0;
				var maxCalls = 12;
				
				function call() {
					callCount++;
				}
				
				function until() {
					return callCount === maxCalls;
				}
				
				helpers.callUntil(call, until);
				
				expect(callCount).toEqual(maxCalls);
			});
			
			it("should returns the values returned from @call", function () {
				var callCount = 0;
				var maxCalls = 12;
				
				function call() {
					return callCount++;
				}
				
				function until() {
					return callCount === maxCalls;
				}
				
				var result = helpers.callUntil(call, until);
				expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
			});
			
			it("should call the given function until @call returns false if no @until value is given", function () {
				var callCount = 0;
				var maxCalls = 12;
				
				function call() {
					return ++callCount !== maxCalls;
				}
				
				helpers.callUntil(call);
				expect(callCount).toEqual(maxCalls);
			});
			
			it("should throw a type error if call is not provided", function () {
				var thrower = function () {
					helpers.callUntil();
				};
				expect(thrower).toThrowError(TypeError);
			});
			
			it("should throw a type error if call is not a function", function () {
				var thrower = function () {
					helpers.callUntil("doStuff");
				};
				expect(thrower).toThrowError(TypeError);
			});
			
			it("should throw a type error if until is given, but not a function", function () {
				var thrower = function () {
					helpers.callUntil(function () {}, "checkStuff");
				};
				expect(thrower).toThrowError(TypeError);
			});
		});
		
		describe("reverse", function () {
			it("should reverse a given array", function () {
				var input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
				var expected = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
								
				var result = helpers.reverse(input);
				expect(result).toEqual(expected);
			});
			
			it("should reverse a given array of any type", function () {
				var temp = function() {};
				var input = ["test", 10, temp, [], "something"];
				var expected = ["something", [], temp, 10, "test"];
								
				var result = helpers.reverse(input);
				expect(result).toEqual(expected);
			});
			
			it("should not reverse sub arrays", function () {
				var input = [[2, "test"], ["test", 2]];
				var expected = [["test", 2], [2, "test"]];
								
				var result = helpers.reverse(input);
				expect(result).toEqual(expected);
			});
			
			it("should return an empty array for a given empty array", function () {								
				var result = helpers.reverse([]);
				expect(result).toEqual([]);
			});
			
			it("should throw a type error if @collection is provided", function () {
				var thrower = function () {
					helpers.reverse();
				};
				expect(thrower).toThrowError(TypeError);
			});
			
			it("should throw a type error if @collection is not an array", function () {
				var thrower = function () {
					helpers.reverse("doStuff");
				};
				expect(thrower).toThrowError(TypeError);
			});
		});
	});
});