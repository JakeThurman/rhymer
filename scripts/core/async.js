define(function() {
	"use strict";

	var async = {};
	var slice = Array.prototype.slice;
	
	function assertType(arg, argName, type) {
		if (typeof arg !== type)
			throw new TypeError("@" + argName + " is required, and should be a " + type + ". Was: " + arg);
	}
	
	/* 
	 * Runs the given frunction after a given number of milliseconds
	 *
	 * PARAMS:
	 *   @wait:  How many ms to wait?
	 *   @func:  The func to run (All arguments passed in after wait are passed into func)
	 *
	 * @returns: The setTimeout value. (call clearTimeout(@returned) to cancel running function)
	 */
	async.delay = function(wait, func) {
		assertType(wait, "wait", "number");
		assertType(func, "func", "function");
		
		var args = slice.call(arguments, 2);
		return setTimeout(function(){ return func.apply(null, args); }, wait);
	};

	/* 
	 * Runs the given frunction as soon as the js thread is available
	 *
	 * PARAMS:
	 *   @func:  The func to run (All arguments passed in after are passed into func)
	 *
	 * @returns: The setTimeout value. (call clearTimeout(@returned) to cancel running function)
	 */
	async.run = function(func) {
		assertType(func, "func", "function");
		return async.delay.apply(async, [1, func].concat(slice.call(arguments, 1)));
	};
	
	return async;
});