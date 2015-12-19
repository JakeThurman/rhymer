define([ "ChangeLogger", "changeTypes", "objectTypes" ], function ( ChangeLogger, changeTypes, objectTypes ) {
	"use strict";
	
	describe("data/changeLogger.js", function () {
		var logger;
		var log;
		
		beforeEach(function () {
			logger = new ChangeLogger();
			
			/* For the sake of easy test, make the callbacks happen imediately */
			logger.CALLBACK_ASYNC = false;
			
			log = function () {
				logger.log(-1, -1, -1);
			};
		});
		
	    describe("log", function () {
		    it("should log changes", function () {
				logger.log(changeTypes.add, -1, objectTypes.pedalboard);
				expect(logger.changes.length).toEqual(1);
			});
			
			it("should throw an exception if no description is provided", function () {
				var thrower = function () {
					logger.log();
				};
				expect(thrower).toThrow();
			});
			
			it("should throw an exception if @objType is not valid", function () {
				var thrower = function () {
					logger.log("test", -1, -1, "test");
				};
				expect(thrower).toThrow();
			});
			
			it("should throw an exception if @changeType is not valid", function () {
				var thrower = function () {
					logger.log("test", "test", -1, -1);
				};
				expect(thrower).toThrow();
			});
			
			it("should throw an exception if object Type is not undefined", function () {
				var thrower = function () {
					logger.log(0, void(0), -1);
				};
				expect(thrower).toThrow();
			});
			
			it("should throw an exception if @changeType is not undefined", function () {
				var thrower = function () {
					logger.log(void(0), -1, -1);
				};
				expect(thrower).toThrow();
			});
			
			it("should throw an exception if @changeType and beyond are missing", function () {
				var thrower = function () {
					logger.log();
				};
				expect(thrower).toThrow();
			});
		});
		
		describe("batch", function () {
			it("should log changes all into one batch", function () {
				logger.batch(0, 0, function () {
					log("a change was made");
					log("another change was made");					
				});
				expect(logger.changes.length).toEqual(1);
				expect(logger.changes[0].changes.length).toEqual(2);
			});
			
			it("should be able to handle batches and changes at the same level", function () {
				logger.batch(0, 0, function () {
					log("a change was made");
					log("another change was made");					
				});
				log("top level change");
				
				expect(logger.changes.length).toEqual(2);
				expect(logger.changes[0].changes.length).toEqual(2);
			});
			
			it("should log changes into sub batches", function () {
				logger.batch(0, 0, function () {
					logger.batch(0, 0, function () {
						log("a change was made");
						log("another change was made");					
					});
					log("logged changes in a batch");
				});
				
				expect(logger.changes.length).toEqual(1);
				expect(logger.changes[0].changes.length).toEqual(2);
				expect(logger.changes[0].changes[0].changes.length).toEqual(2);
			});
			
			it("should not throw an exception if no object name/id are provided", function () {
				var hit = false;
				var notThrower = function () {
					logger.batch(0, 0, function () {
						log("something");
						hit = true;
					});
				};
				expect(notThrower).not.toThrow();
				expect(hit).toBe(true);
			});
			
			it("should throw an exception if only object name is provided", function () {
				var hit = false;
				var thrower = function () {
					logger.batch(0, 0, "Test", function () {
						log("something");
						hit = true;
					});
				};
				expect(thrower).toThrow();
				expect(hit).toBe(false);
			});
			
			it("should throw an exception if only object id is provided", function () {
				var hit = false;
				var thrower = function () {
					logger.batch(0, 0, 0, function () {
						log("something");
						hit = true;
					});
				};
				expect(thrower).toThrow();
				expect(hit).toBe(false);
			});
			
			it("should not throw an exception if everything is provided", function () {
				var hit = false;
				var notThrower = function () {
					logger.batch(0, 0, "name", "id", function () {
						log("something");
						hit = true;
					});
				};
				expect(notThrower).not.toThrow();
				expect(hit).toBe(true);
			});
		});
		
		describe("dontLog", function () {
		    it("should ignore all changes logged inside of a dontLog function", function () {
				logger.dontLog(function () {
					logger.batch(0, 0, function () {
						log("a change was made");
						log("another change was made");					
					});
					
					log("an outside the batch change was made");
				});
				expect(logger.changes.length).toEqual(0);
			});
			
			it("should throw an exception if func is not a function", function () {
				var thrower = function () {
					logger.dontLog('');
				};
				expect(thrower).toThrow();
			});
			
			it("should throw an exception if func is not passed in", function () {
				var thrower = function () {
					logger.dontLog();
				};
				expect(thrower).toThrow();
			});
			
			it("should allow for sub-functions to call dontLog as well without causing the enabled flag to get reset early", function () {
				logger.dontLog(function () {
					log("top");
					logger.dontLog(function () {
						log("inner");
					});
				});
				
				expect(logger.changes.length).toEqual(0);
			});
		});
		
		describe("create", function () {
		    it("should throw an exception if @initialChanges is not an array", function () {
				var thrower = function () {
					changeLogger.create("");
				};
				expect(thrower).toThrow();
			});
		});
		
		describe("addCallback", function () {
			it ("should not call callbacks as a part of adding callbacks", function () {
				var calls = 0;
				logger.addCallback(function () {
					calls++;
				});
				logger.addCallback(function () {
					calls++;
				});
				
				expect(calls).toBe(0);
			});
			
			it("should add a callback to be called on log", function () {				
				var calls = 0;
				logger.addCallback(function () {
					calls++;
				});
				
				log();
				
				expect(calls).toBe(1);
			});
			
			it("should add a callback to be called on batch complete and log when @waitUntilBatchComplete is false", function () {				
				var calls = 0;
				logger.addCallback(false, function () {
					calls++;
				});
				
				logger.batch(-1, 0, function () {
					log();
				});
				
				expect(calls).toEqual(2);
			});
			
			it("should add a callback to be called on (no change) batch complete", function () {				
				var calls = 0;
				logger.addCallback(function () {
					calls++;
				});
				
				logger.batch(-1, 0, function () {});
				
				expect(calls).toEqual(1);
			});
			
			it("should call the callbacks even inside a dontLog wrapper", function () {				
				var calls = 0;
				logger.addCallback(function () {
					calls++;
				});
				
				logger.dontLog(function () {
					logger.batch(-1, 0, function () {
						log();
					});
				});
				
				expect(calls).toEqual(1);
			});
			
			it("should not call the callbacks on log that pass in true for @waitUntilBatchCompletion", function () {				
				var calls = 0;
				logger.addCallback(true, function () {
					calls++;
				});
				
				logger.batch(-1, 0, function () {
					log();
				});
				
				expect(calls).toEqual(1);
			});
			
			it("should not call the callbacks on log that pass in true for @waitUntilBatchCompletion inside of a don't log block", function () {				
				var calls = 0;
				logger.addCallback(true, function () {
					calls++;
				});
				
				logger.dontLog(function () {
					logger.batch(-1, 0, function () {
						log();
					});
				});
				
				expect(calls).toEqual(1);
			});
						
			it("should not call the callbacks on log that don't pass in anything for @waitUntilBatchCompletion (i.e. it should default to true)", function () {				
				var calls = 0;
				logger.addCallback(function () {
					calls++;
				});
				
				logger.batch(-1, 0, function () {
					log();
				});
				
				expect(calls).toEqual(1);
			});
			
			it("should throw an error if the callback is not given", function () {				
				var thrower = function () {
					logger.addCallback();
				};
				
				expect(thrower).toThrow();
				expect(thrower).toThrowError();
			});
			
			it("should throw an error if the callback is not given, but @waitUntilBatchComplete is", function () {				
				var thrower = function () {
					logger.addCallback(true);
				};
				
				expect(thrower).toThrow();
				expect(thrower).toThrowError();
			});
			
			
			it("should throw an error if the callback is undefined", function () {				
				var thrower = function () {
					logger.addCallback(void(0));
				};
				
				expect(thrower).toThrow();
				expect(thrower).toThrowError();
			});
			
			it("should throw an error if the callback is undefined, and @waitUntilBatchComplete is given", function () {				
				var thrower = function () {
					logger.addCallback(true, void(0));
				};
				
				expect(thrower).toThrow();
				expect(thrower).toThrowError();
			});
			
			it("should be able to handle multiple callbacks", function () {
				var hit1 = false;
				logger.addCallback(function () {
					hit1 = true;
				});
				
				var hit2 = false;
				logger.addCallback(function () {
					hit2 = true;
				});
				
				expect(hit1).toBe(false);
				expect(hit2).toBe(false);
				
				log();
										
				expect(hit1).toBe(true);
				expect(hit2).toBe(true);
			});
			
			it("should give any extra params as extra args", function () {
				var input = "this is a test of text " + new Date();
				var output;
				var input2 = "this is another test of text ------ " + new Date();
				var output2;
				logger.addCallback(function (change, value, value2) {
					output = value;
					output2 = value2;
				}, input, input2);
				
				expect(output).toBeUndefined();
				expect(output2).toBeUndefined();
				log();
				expect(output).toEqual(input);
				expect(output2).toEqual(input2);
			});
		});
	});
});