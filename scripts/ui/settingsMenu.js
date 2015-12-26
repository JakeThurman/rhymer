define([ "_OptionMenu", "textResources", "jquery", "stringReplacer", "helperMethods", "classes" ], function ( _OptionMenu, resources, $, replacer, helpers, classes ) {
	"use strict";
	
	var info = {
		settingsNames: {
			maxResults: "maxResults",
			fileName: "fileName",
			showLeft: "showLeft",
		},
		maxResults: {
			max: 50,
			min: 1,
		},
		fileExtension: ".rhyme",
	}
	
	var menu;
	
	var create = function ( settings, saveSettings, settingsButton, toggleLeft ) {
	
		if (menu)
			return;
				
		/* Define DOM elements for settings */
		var maxResults = {
			name: info.settingsNames.maxResults,
			label: resources.settings_maxResults,
			input: $("<input>", { type: "number", min: info.maxResults.min, max: info.maxResults.max, val: settings[info.settingsNames.maxResults] }),
			error: $("<div>").text(replacer.replace(resources.settings_maxResults_error, [info.maxResults.min, info.maxResults.max])),
			val: function () {
				return parseInt(maxResults.input.val());
			},
			validate: function () {
				var value = maxResults.val();
				var isValid = value && value <= info.maxResults.max && value >= info.maxResults.min;
				maxResults.error.toggleClass(classes.hide, isValid);
				return isValid;
			},
		};
		
		var fileName = {
			name: info.settingsNames.fileName,
			label: resources.settings_fileName,
			input: $("<input>").val(settings[info.settingsNames.fileName].slice(0, -(info.fileExtension.length))).add($("<span>").text(info.fileExtension)),
			val: function () {
				return fileName.input.val() + info.fileExtension;
			},
		};
		
		var showLeft = {
			name: info.settingsNames.showLeft,
			label: resources.settings_showLeft,
			input: $("<input>", { type: "checkbox", checked: settings[info.settingsNames.showLeft] }).change(function () {
				toggleLeft(showLeft.val());
			}),
			val: function () {
				return showLeft.input.is(":checked");
			},
		};
		
		/* Handles Settings Updates */
		var validate = function () {
			var anyChanges = false;
			var isValid = true;
						
			helpers.forEach(all, function (option) {
				if (!option.validate || option.validate()) {
					var newVal = option.val();
					var hasChanged = settings[option.name] !== newVal;
					anyChanges = anyChanges || hasChanged;
					if (hasChanged)
						settings[option.name] = newVal;
				} else {
					isValid = false;
				}
			});
			
			if (anyChanges)
				saveSettings(settings);
			
			return isValid;
		};
		
		var updateSettings = function () { validate(); };
		
		/* Grab all of the elements */
		var all = [ maxResults, fileName, showLeft ];
		var options = $(helpers.select(all, function (option) { 
			if (option.error) {
				option.error
					.addClass(classes.error)
					.addClass(classes.hide);
			}
		
			option.input
				.change(updateSettings)
				.keypress(updateSettings)
				.css("width", "initial");
		
			return $("<div>").addClass(classes.noHover)
				.append($("<span>").text(option.label))
				.append(option.input)
				.append(option.error)
				.get(0);
		}));
		
		/* Create the Menu */		
		menu = _OptionMenu.create(options, void(0), validate, function () {
			menu = void(0); 
		}).addClass("main-page-menu");
	};
	
	return {
		create: create,
	};
});