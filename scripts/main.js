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
		"classes":         "ui/classes",
		"printer":         "ui/printer",
	},
	config: {
		moment: {
			noGlobal: true
        }
	}
});

require([ "jquery", "Rhymer", "helperMethods", "Storage", "settingsMenu", "copier", "textResources", "classes", "printer", "!domReady" ], 
function ( $, Rhymer, helpers, Storage, settingsMenu, copier, resources, classes, printer ) {
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
			fileName: "rhyme.rhyme",
			showLeft: true,
			readonly: true,
		},
		keyCode: {
			enter: 13,
			s:     83,
		},
	};
	
	/* Remove Global */
	$.noConflict();
	
	/* DOM Variables */
   	var settingsButton     = $("#page-main-menu"),
		output             = $("#content-container > textarea"),
		suggestText        = $("#content-container > input"),
		leftSuggestButton  = $("#left-suggest"),
		rightSuggestButton = $("#right-suggest"),
		leftRhymes         = $("#left-rhyme"),
		rightRhymes        = $("#right-rhyme"),
		download           = $("#download"),
		downloadLink       = download.children("a"),
		upload             = $("#upload"),
		printPage          = $("#print-page");
	
	/* Instance Variables */
	var storage      = new Storage(info.storage.appName, Storage.ADMIN),
	    saveSettings = function (newSettings) { 
	                      storage.set(info.storage.settings, newSettings); 
		                  settings = newSettings;
		                  if (rhymer)
		                     rhymer.setMaxResults(settings.maxResults);
	                      return newSettings; 
	                   },
	    settings     = storage.get(info.storage.settings) || saveSettings(info.defaultSettings),
	    rhymer       = new Rhymer(settings.maxResults, storage.get(info.storage.cache));
		
	/* Functions */
	var addRhyme = function(word, parent) {
		var rhymeEl = $("<div>", { "class": "rhyme" })
				.append($("<span>")
					.css("font-size", "0.7em")
					.text(word.score + " - "))
				.append($(word.score < 300 ? "<span>" : "<strong>").text(word.word));
		
		parent.append(rhymeEl);
	},
	handleRhymes = function(words, parent) {
		parent.empty();
		
		helpers.forEach(words, function (word) { 
			addRhyme(word, parent) 
		});
		
		storage.set(info.storage.cache, rhymer.cache);
	},
	suggest = function(parent) {
		var val = suggestText.val();
		
		if (val === "") {
			rhymes.empty();
			return; // If nothing is to available to rhyme with, clear and return
		}
		
		rhymer.rhyme(val, function (words) {
			handleRhymes(words, parent);
		});
	},
	leftSuggest = function () {
		suggest(leftRhymes);
	},
	rightSuggest = function () {
		suggest(rightRhymes);
	},
	toggleLeft = function (show) { 
		leftRhymes.toggleClass(classes.hide, !show);
		leftSuggestButton.toggleClass(classes.opaque, !show);
	},
	toggleEditMode = function (isReadonly) {
		output.attr("readonly", isReadonly);
	};
	
	toggleLeft(settings.showLeft);
	toggleEditMode(settings.readonly);
	
	/* Setup */
	output.val(storage.get(info.storage.song))
		.keydown(function() {
			storage.set(info.storage.song, output.val());
		});
	
	suggestText.keypress(function (e) {
		if (e.keyCode === info.keyCode.enter)
			rightSuggest();
	});
	
	leftSuggestButton.click(leftSuggest);
	rightSuggestButton.click(rightSuggest);
	
	$(document).keydown(function (e) {
		if (e.altKey && e.keyCode === info.keyCode.s) {
			// Browser API: window.getSelection()
			suggestText.val(getSelection().toString())
				.focus();
		}
	});
	
	settingsButton.click(function() {
		settingsMenu.create(settings, saveSettings, settingsButton, toggleLeft, toggleEditMode);
	});
	
	function shouldOverwrite() {
		if (output.val().trim() === "")
			return true;
		
		return confirm(resources.deleteExistingSongConfirm);
	}
	
	upload.change(function () {
		if (!copier.hasFile(upload.get(0)) || !shouldOverwrite())
			return;
	
		copier.readFile(upload.get(0), function (text, fileName) {
			output.val(text);
			settings.fileName = fileName;
			saveSettings(settings);
		});
	});
	
	download.hover(function () {
		downloadLink
			.attr("href", copier.makeFile(output.val()))
			.attr("download", settings.fileName);
	});
	
	leftRhymes.add(rightRhymes).click(function () {
		suggestText.focus();
	});
	
	printPage.click(function () {
		printer.print(output.val(), settings.fileName);
	});
});
