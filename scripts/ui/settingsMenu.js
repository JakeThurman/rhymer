define([ "_OptionMenu", "textResources", "jquery", "stringReplacer", "helperMethods", "classes" ], function ( _OptionMenu, resources, $, replacer, helpers, classes ) {
	"use strict";
	
	var info = {
		settingsNames: {
			maxResults: "maxResults",
			fileName: "fileName",
			showLeft: "showLeft",
			readonly: "readonly",
		},
		maxResults: {
			max: 50,
			min: 1,
		},
		fileExtension: ".rhyme",
	}
	
	var menu;
	
	var getMyFileExtension = function(fileName) {
		if (!fileName)
			return info.fileExtension;
		
		var segments = fileName.split(".");
		var ext = segments[segments.length - 1];
		
		if (ext && ext.length)
			return "." + ext;
			
		return info.fileExtension;
	};
	
	var create = function ( settings, saveSettings, settingsButton, toggleLeft, toggleEditable ) {
	
		if (menu)
			return;
		
		var myFileExtension = getMyFileExtension(settings[info.settingsNames.fileName]);
		
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
			input: $("<input>").val(settings[info.settingsNames.fileName].slice(0, -(myFileExtension.length))).add($("<span>").text(myFileExtension)),
			val: function () {
				return fileName.input.val() + myFileExtension;
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
		
		var readonly = {
			name: info.settingsNames.readonly,
			label: resources.settings_editMode,
			input: $("<input>", { type: "checkbox", checked: settings[info.settingsNames.readonly] }).change(function () {
				toggleEditable(readonly.val());
			}),
			val: function () {
				return readonly.input.is(":checked");
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
		var all = [ maxResults, fileName, showLeft, readonly ];
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