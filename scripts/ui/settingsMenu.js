define([ "_OptionMenu", "textResources", "jquery", "stringReplacer", "helperMethods" ], function ( _OptionMenu, resources, $, replacer, helpers ) {
	"use strict";
	
	var info = {
		classes: {
			hide: "display-none",
			noHover: "no-hover keep-padding",
			error: "error",
		},
		settingsNames: {
			maxResults: "maxResults",
		},
		maxResults: {
			max: 50,
			min: 1,
		},
	}
	
	var menu;
	var onClose = function () {
		menu = void(0); 
	};
	
	var create = function ( settings, saveSettings, settingsButton ) {
	
		if (menu) {
			if (menu.validate()) {
				onClose();
				menu.remove();
			}
			return;
		}
				
		/* Define DOM elements for settings */
		var maxResults = {
			name: info.settingsNames.maxResults,
			label: $("<span>").text(resources.settings_maxResults),
			input: $("<input>", { type: "number", min: info.maxResults.min, max: info.maxResults.max}).css("width", "initial").val(settings[info.settingsNames.maxResults]),
			error: $("<div>").addClass(info.classes.hide).text(replacer.replace(resources.settings_maxResults_error, [info.maxResults.min, info.maxResults.max])),
			val: function () {
				return parseInt(maxResults.input.val());
			},
			validate: function () {
				var value = maxResults.val();
				var isValid = value && value <= info.maxResults.max && value >= info.maxResults.min;
				maxResults.error.toggleClass(info.classes.hide, isValid);
				return isValid;
			},
		};
		
		
		/* Handles Settings Updates */
		var validate = function () {
			var anyChanges = false;
			var isValid = true;
						
			helpers.forEach(all, function (option) {
				if (option.validate()) {
					var newVal = option.val();
					var hasChanged = settings[option.name] !== newVal;
					anyChanges = anyChanges || hasChanged;
					if (hasChanged)
						settings[option.name] = newVal;
				} else
					isValid = false;
			});
			
			if (anyChanges)
				saveSettings(settings);
			
			return isValid;
		};
		var updateSettings = function () { validate(); };
			
		/* Grab all of the elements */
		var all = [ maxResults ];
		var options = $(helpers.select(all, function (option) { 
			option.error.addClass(info.classes.error);
			option.input
				.change(updateSettings)
				.keypress(updateSettings);
		
			return $("<div>").addClass(info.classes.noHover)
				.append(option.label)
				.append(option.input)
				.append(option.error)
				.get(0);
		}));
		
		/* Create the Menu */		
		menu = _OptionMenu.create(options, settingsButton, validate, onClose);
		menu.validate = validate;
	};
	
	return {
		create: create,
	};
});