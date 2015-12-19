requirejs.config({
	baseUrl: "scripts",
	paths: {
		/* Libraries */
		"domReady":        "lib/domReady",
		"jquery":          "lib/jquery",
		"jquery-ui":       "lib/jquery-ui",
		"Chart":           "lib/Chart",
		"moment":          "lib/moment",

		/* Core */
		"helperMethods":   "core/helperMethods",
		"stringReplacer":  "core/stringReplacer",
		"async":           "core/async",
		"ChangeLogger":    "core/changeLogger",
		"colorEffects":    "core/colorEffects",
		"Storage":         "core/storage",
		"_Popup":          "core/Popup",
		"_OptionMenu":     "core/OptionMenu",

		/* Data */
		"changeTypes":     "data/changeInfo",
		"batchTypes":      "data/changeInfo",
		"objectTypes":     "data/changeInfo",
		
		/* Data Classes */
		"Rhymer":          "data/rhymer",
	},
	config: {
		moment: {
			noGlobal: true
        }
	}
});

require([ "jquery", "Rhymer", "helperMethods", "Storage" ], 
function ( $, Rhymer, helpers, Storage ) {
	"use strict";
	
	var info = {
		appName:   "rhyme-gen",
		cacheName: "cache",
		songName:  "song",
		maxResults: 25,
		keyCode: {
			enter: 13,
			s:     83,
		}
	};
	
	/* Remove Global */
	$.noConflict();
	
	/* DOM Variables */
   	var mainContentContainer = $("#content-container"),
   	    pageMenuButton       = $("#page-main-menu"),
		output               = mainContentContainer.children("textarea"),
		newLine              = mainContentContainer.children("input"),
		suggestButton        = mainContentContainer.children("button"),
		rhymes               = $("#rhyme-zone");
		
	/* Instance Variables */
	var storage  = new Storage(info.appName, Storage.ADMIN),
	    rhymer   = new Rhymer(info.maxResults, storage.get(info.cacheName));
		
	/* Setup */
	output.val(storage.get(info.songName))
		.keydown(function() {
			storage.set(info.songName, output.val());
		});
		
	var addRhyme = function(word) {
		rhymes.append($("<div>", { "class": "rhyme" }).text(word));
	};
	
	var handleRhymes = function(words) {
		rhymes.empty();
		
		helpers.forEach(words, addRhyme);
		
		storage.set(info.cacheName, rhymer.cache);
	};
	
	var suggest = function(perferSelection) {
		var val = newLine.val();
		if (val === "" || perferSelection === true)
		{
			// Browser API: window.getSelection()
			val = getSelection().toString();
			
			if (val === "")
			{
				rhymes.empty();
				return; // If nothing is to available to rhyme with, clear and return
			}
		}
		
		rhymer.rhyme(newLine.val(), handleRhymes);
	}
	
	newLine.keypress(function (e) {
		if (e.keyCode === info.keyCode.enter)
			suggest();
	});
	
	$(document).keydown(function (e) {
		if (e.altKey && e.keyCode === info.keyCode.s)
			suggest(true);
	});
	
	suggestButton.click(suggest);
});
