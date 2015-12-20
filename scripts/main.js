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
		"textResources":   "data/textResources",
		"copier":          "data/copier",
		
		/* Data Classes */
		"Rhymer":          "data/rhymer",
		
		/* UI */
		"settingsMenu":    "ui/settingsMenu",
	},
	config: {
		moment: {
			noGlobal: true
        }
	}
});

require([ "jquery", "Rhymer", "helperMethods", "Storage", "settingsMenu", "copier", "!domReady" ], 
function ( $, Rhymer, helpers, Storage, settingsMenu, copier ) {
	"use strict";
		
	var info = {
		storage: {
			appName: "rhyme-gen",
			cache: "cache",
			song: "song",
			settings: "settings",
		},
		defaultSettings: {
			maxResults: 25,
		},
		keyCode: {
			enter: 13,
			s:     83,
		},
	};
	
	/* Remove Global */
	$.noConflict();
	
	/* DOM Variables */
   	var contentContainer = $("#content-container"),
   	    settingsButton   = $("#page-main-menu"),
		output           = contentContainer.children("textarea"),
		newLine          = contentContainer.children("input"),
		suggestButton    = contentContainer.children("button"),
		rhymes           = $("#rhyme-zone"),
		download         = contentContainer.children("#download"),
		upload           = contentContainer.children("#upload").children("input");
	
	/* Instance Variables */
	var storage      = new Storage(info.storage.appName, Storage.ADMIN),
	    saveSettings = function (newSettings) { 
	                       storage.set(info.storage.settings, newSettings); 
						   settings = newSettings;
						   rhymer.setMaxResults(settings.maxResults);
	                       return newSettings; 
	                   },
	    settings     = storage.get(info.storage.settings) || saveSettings(info.defaultSettings),
	    rhymer       = new Rhymer(settings.maxResults, storage.get(info.storage.cache));
		
	/* Functions */
	var addRhyme = function(word) {
		rhymes.append($("<div>", { "class": "rhyme" }).text(word));
	};
	
	var handleRhymes = function(words) {
		rhymes.empty();
		
		helpers.forEach(words, addRhyme);
		
		storage.set(info.storage.cache, rhymer.cache);
	};
	
	var suggest = function(perferSelection) {
		var val = newLine.val();
		if (val === "" || perferSelection === true) {
			// Browser API: window.getSelection()
			val = getSelection().toString();
			
			if (val === "") {
				rhymes.empty();
				return; // If nothing is to available to rhyme with, clear and return
			}
		}
		
		rhymer.rhyme(val, handleRhymes);
	};
	
	/* Setup */
	output.val(storage.get(info.storage.song))
		.keydown(function() {
			storage.set(info.storage.song, output.val());
		});
	
	newLine.keypress(function (e) {
		if (e.keyCode === info.keyCode.enter)
			suggest();
	});
	
	$(document).keydown(function (e) {
		if (e.altKey && e.keyCode === info.keyCode.s)
			suggest(true);
	});
	
	suggestButton.click(suggest);
	
	settingsButton.click(function() {
		settingsMenu.create(settings, saveSettings, settingsButton);
	});
	
	upload.change(function () { 
		copier.readFile(upload.get(0), function (text) {
			console.log(text);
		});
	});
	
	download.click(function () {
		copier.downloadFile(output.val(), "rhyme.txt");
	});
});
