define(["helperMethods"], function (helpers) {
	"use strict";
	
	var info = {
		callbackName: "rhymeBrainResponseCallback",
		defaultMaxResults: 50,
		calls: 0,
		symbolRegex: /[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,
		twoPlusSpacesRegex: /\s{2,}/g,
	};
	
	// http://rhymebrain.com/api.html
	var wordIs = {
		offensive: function(word) {
			return word.flags.indexOf("a") > -1;
		},
	};
	
	/*
	 * Gets Rhymes from the Rhyme API NOTE: Could use https://api.datamuse.com/words?rel_rhy={word}
	 *
	 * PARAMS:
	 *   word: A string of a single word
	 *   callback: The callback to be called when the API returns the words
	 *
	 * JSON FORMAT:
	 *   [{
     *      "word": "hello",
     *      "pron": "HH AH0 L OW1",
     *      "ipa": "h\u028cl\u02c8\u0259\u028a\u032f",
     *      "freq": 19,
     *      "flags": "bc"
	 *    }]
	 * 
	 */
	function get(word, maxResults, callback) {		
		if (typeof word !== "string")
			throw new TypeError("@word must be a string!");
		
		var callbackName = info.callbackName + info.calls++;
		window[callbackName] = callback;
		
		var script = document.createElement("script");
		var protocol = location.protocol === "file:" ? "http:" : location.protocol
		
		script.src = location.protocol + "//rhymebrain.com/talk?function=getRhymes" +
			"&word=" + encodeURIComponent(word) +
			"&maxResults=" + maxResults + 
			"&jsonp=" + callbackName;

		document.body.appendChild(script);
	}
	
	/*
	 * Rhymer Class Definition
	 */
	return function (maxResults, cache) {
		var self = this;
		
		var filter = function(words, allowOffensive) {
			if (allowOffensive)
				return words;
			
			return helpers.where(words, function (w) {
				return !wordIs.offensive(w); 
			});
		};
		
		var select = function(words) {
			return helpers.select(words, function (w) {
				return {
					word: w.word,
					score: w.score,
				};
			});
		};
		
		this.cache = cache || {};
		
		this.setMaxResults = function (newMR) {
			maxResults = newMR;
		};
			
		/*
		 * Gets rhyming words
		 *
		 * PARAMS:
		 *   allowOffensive: [boolean] Allow Profanity in rhymes?
		 */
		this.rhyme = function (word, callback) {
			word = word.replace(info.symbolRegex,"").replace(info.twoPlusSpacesRegex," ").trim();
			var cacheName = word.toLowerCase();
			
			if (self.cache[cacheName]) {
				callback(self.cache[cacheName]);
				return;
			}
			
			get(word, maxResults || info.defaultMaxResults, function (words) {
				self.cache[cacheName] = select(filter(words, true));
				callback(self.cache[cacheName]);
			});
		};
	};
});
