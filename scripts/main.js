require([ "requireConfig" ], function () {
require([ "jquery", "Rhymer", "helperMethods", "Storage", "settingsMenu", "copier", "textResources", "classes", "printer", "!domReady" ], 
function ( $, Rhymer, helpers, Storage, settingsMenu, copier, resources, classes, printer ) {
	"use strict";
		
	var info = {
		storage: {
			appName: "rhyme-gen",
			cache: "cache",
			song: "song",
			library: "library",
			settings: "settings",
		},
		defaultSettings: {
			maxResults: 25,
			fileName: "MyRhyme.txt",
			showLeft: false,
			readonly: false 
		},
		keyCode: {
			enter: 13,
			s:     83,
			p:     80,
		},
	};
	
	/* Remove Global */
	$.noConflict();
	
	/* DOM Variables */
   	var settingsButton     = $("#page-main-menu"),
		output             = $("#content-container > textarea"),
		suggestText        = $("#content-container input"),
		leftSuggestButton  = $("#left-suggest"),
		rightSuggestButton = $("#right-suggest"),
		leftRhymes         = $("#left-rhyme"),
		rightRhymes        = $("#right-rhyme"),
		download           = $("#download"),
		downloadLink       = download.children("a"),
		upload             = $("#upload"),
		printPage          = $("#print-page"),
		libraryPane        = $("#library-pane"),
		saveButton         = $("#save");
	
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
			parent.empty();
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
		leftSuggestButton.toggleClass(classes.opaque, !show)
			.attr("disabled", !show)
			.attr("tab-index", show ? 0 : -1);

		libraryPane.toggleClass(classes.hide, show);
		saveButton.toggleClass(classes.hide, show);
	},
	toggleEditMode = function (isReadonly) {
		output.attr("readonly", isReadonly)
			.attr("disabled", isReadonly);
	},
	_print = function () {
		printer.print(output.val(), settings.fileName);
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
		else if (e.ctrlKey && e.keyCode === info.keyCode.p) {
			_print();
			e.preventDefault();
		}
	});
	
	settingsButton.click(function() {
		settingsMenu.create(settings, saveSettings, settingsButton, toggleLeft, toggleEditMode);
	});
	
	function shouldOverwrite(text) {
		var content = output.val();	
	
		if (content.trim() === "")
			return true;

		if (content === text)
			return true;
		
		return confirm(resources.deleteExistingSongConfirm);
	}
	
	function setSong(text, fileName) {
		output.val(text);
		settings.fileName = fileName;
		saveSettings(settings);
	}

	upload.change(function () {
		if (!copier.hasFile(upload.get(0)))
			return;
	
		copier.readFile(upload.get(0), function (content, name) {
			if (shouldOverwrite(content))
				setSong(content, name);
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
	
	printPage.click(_print);

	/* Setup save */
	/* TODO: Give some of this its own file */	
	var saveCurrSong = function (name) {
		var song = storage.get(info.storage.song); 
		var lib = storage.get(info.storage.library) || [];

		var newLib = helpers.where(lib, function (libItem) {
				return libItem.name != settings.fileName;
			}).concat({
				name: settings.fileName,
				content: song
			});

		storage.set(info.storage.library, newLib);
		
		updateLib();
	},
	updateLib = function () {
		var lib = storage.get(info.storage.library); 

		if (lib && lib.length)
			libraryPane.empty();

		helpers.forEach(lib, function (libItem) {
			$("<div>", { "class": "rhyme" })
				.text(libItem.name)
				.click(function () { 
					if (!shouldOverwrite(libItem.content))
						return;

					setSong(libItem.content, libItem.name);
				})
				.appendTo(libraryPane);
		});
	};

	updateLib();
	saveButton.click(saveCurrSong);

});
});
