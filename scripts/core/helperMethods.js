define(function () {
	"use strict";
	
	var helpers = {};
	
	/* Just throws the msg, makes for easier inlining of logic. */
	helpers.throwThis = function (msg) {
		throw new Error(msg);
	};
	
	/* returns true if the param is undefined */
	helpers.isUndefined = function(maybeSomething) {
		return typeof maybeSomething === "undefined" || maybeSomething === null;
	};
	
	/* returns true if the param is an object or array. */
	helpers.isObjectOrArray = function (maybe) {
		return !helpers.isUndefined(maybe) && typeof maybe === "object";
	};
	
	/* return true if the param is an "object". Arrays not included! */
	helpers.isObject = function(maybeObject) {
		return !helpers.isUndefined(maybeObject) && typeof maybeObject == "object" && Object.prototype.toString.call(maybeObject) === "[object Object]";
	};
	
	/* returns true if the param is an array. */
	helpers.isArray = function(maybeArray) {
		return !helpers.isUndefined(maybeArray) && typeof maybeArray == "object" && Object.prototype.toString.call(maybeArray) === "[object Array]";
	};
	
	/* If the param is an array, it returns it, other wise it returns the object as an array of one */
	helpers.asArray = function (maybeArray) {
		if (helpers.isUndefined(maybeArray))
			return [];
		if (!helpers.isArray(maybeArray))
			return [maybeArray];
		
		return maybeArray;
	};

	/* Loops through the array (collection) and calls the passed in function (action) on each item */
	helpers.forEach = function (collection, action) {
		collection = helpers.asArray(collection);
		
		for (var i = 0; collection.length > i; i++)
			action(collection[i]);
	};
	
	/*
	 * Loops through the passed in collection
	 *  if the isBottomFilterAction(collection[i]) fucntion returns true:
	 *  		the bottomAction(collection[i])
	 * otherwise:
	 *		the function is recurrsed until the isBottomFilterAction responds that this is the bottom
	 *   the getChildCollectionAction(collection[i]) is also first called, and should return the array collection of that object
	 *				if the object is the collection, the function can just return the input.
	 */
	helpers.forUntilBottom = function (collection, isBottomFilterAction, getChildCollectionAction, bottomAction) {
		helpers.forEach(collection, function (obj) {
			if (isBottomFilterAction(obj))
				bottomAction(obj);
			else
				helpers.forUntilBottom(getChildCollectionAction(obj), isBottomFilterAction, getChildCollectionAction, bottomAction);
		});
	};
	
	/*
	 * forEach wrapper that loops through an array and calls a passed in function
	 * on each item and adds it to a new array which is then returned
	 */
	helpers.select = function (collection, selectAction) {
		var newCollection = [];
		helpers.forEach(collection, function (obj) {
			newCollection.push(selectAction(obj));
		});
		return newCollection;						
	};
	
	/*
	 * forEach wrapper that loops through an array and calls a passed in function
	 * on each item and if it returns true, it to a new array which is then returned
	 */
	helpers.where = function (collection, whereFilterAction) {
		var newCollection = [];
		helpers.forEach(collection, function (obj) {
			if (whereFilterAction(obj))
				newCollection.push(obj);
		})
		return newCollection;
	};
	
	/* 
	 * returns the [0] of the collection. BUT, if that is not the case one of the
	 * passed in functions is called (which one, depending on the case) 
	 */
	helpers.single = function(collection, moreThanOneResultsAction, zeroResultsAction) {
	   if (collection.length <= 0)
			return zeroResultsAction ? zeroResultsAction() : helpers.throwThis("No results.");
		else if (collection.length > 1)
			return moreThanOneResultsAction ? moreThanOneResultsAction() : helpers.throwThis("Too many results.");
		else
			return collection[0];
	};
	
	/* Gets the first item in a collection or returns the passed in function if there are none */
	helpers.first = function (collection, zeroResultsAction) {
		if (collection.length === 0)
			return zeroResultsAction ? zeroResultsAction() : helpers.throwThis("No results.");
		else
			return collection[0];
	};
	
	/* Provides a deep clone for objects */
	helpers.clone = function (object) {
		/* handle arrays */
		if (helpers.isArray(object)) {
			return helpers.select(object, function (arrayobj) {
				helpers.clone(arrayobj);
			});
		}
		 
		/* 
		 * ! Cloneing other object types like date is not currently supported
		 * or cloneing functions, numbers or strings. 
		 */
		if (!helpers.isObject(object))
			return object;
						  
		/* clone each property */
		var newObject = {};
		for (var key in object) {
			if (helpers.isObjectOrArray(object[key]))
				newObject[key] = helpers.clone(object[key]);
			else
				newObject[key] = object[key];
		}
		return newObject;
	};
	
	/* 
	 * Gets a distinct set of items, distinct on the item returned from selector, or the full item if it is undefined 
	 * NOTE: If you are using the distinct on selector: it will ALWAYS take the first item that it matches as distinct.
	 */
	helpers.distinct = function(collection, distinctOnSelector) {
		if (!helpers.isArray(collection))
			throw new TypeError("Collection must be an array for distinct. value was: " + collection);
	
		var distinctItems = [];
		var distincts = [];
		var hasSelector = !helpers.isUndefined(distinctOnSelector);
		
		helpers.forEach(collection, function (item) {
			var distinctOn = hasSelector ? distinctOnSelector(item) : item;
			if (distincts.indexOf(distinctOn) === -1) {
				distinctItems.push(item);
				distincts.push(distinctOn)
			}
		});
		
		return distinctItems;
	};
	
	/*
	 * Calls @call until @until retuns a true OR if no @until function is given, until @call returns false.
	 *
	 * @call:               A function to call until @until returns true, or if no @until function is given, until this returns false.
	 * @until:   [OPTIONAL] A function that should return @stopLooping. When true @call won't be called anymore.
	 *                          PARAMS: @value: The value just returned by @call.
	 *
	 * @returns:            An array of all of the values returned from @call. 
	 */
	helpers.callUntil = function(call, until) {
		if (!(typeof call === "function"))
			throw new TypeError("@call is not a function! helpers.callUntil requires a function");
		if (!((typeof until === "function") || helpers.isUndefined(until)))
			throw new TypeError("Optional param @until was provided but was not a function. Please see the use comment in helperMethods.js");
		
		var result = [call()];
		while (until ? !until(result[result.length - 1]) : result[result.length - 1]) {
			result.push(call());
		}
		return result;
	};
	
	/*
	 * Reverses an array
	 *
	 * @collection: The array to reverse
	 * @returns:    A reversed version of @collection.
	 */
	helpers.reverse = function (collection) {
		if (!helpers.isArray(collection))
			throw new TypeError("Collection param must be an array for helpers.reverse");
		
		var result = [];
		for (var i = collection.length - 1; i >= 0; i--) {
			result.push(collection[i]);
		}
		return result;
	};
	
	return helpers;
});