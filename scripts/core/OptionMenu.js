define(["jquery"], function ($) {
	"use strict";
    var methods = {};
	
	methods.disabledClass = "disabled no-hover keep-padding cursor-help";
	
	/*
	 * Creates an option menu 
	 *
	 * PARAMS:
	 *   @optionLinks: ($)            Items to be appended to the menu 
	 *   @link:        ($) {optional} The refurring link, skip to avoid positioning
	 *
	 * @returns: $(menu)
	 */
  	methods.create = function (optionLinks, link) {		
	
  		var el = $("<div>", { "class": "options-menu shadowed" })
			.append(optionLinks);

		if (link)
            el.insertBefore(link);
		else
			el.appendTo(document.body);

		setTimeout(function () {
			$(document).one("click", function () {
				el.remove();
			});
		}, 0);/*Keeps jquery from firing on this click event*/

		return el;
		
  	};
	
	
	/*
	 * Creates an _OptionMenu with a single no-hover node containing the passed in text
	 *
	 * PARAMS:
	 *   @message: (String)           The message to display as the menu
	 *   @link:    ($)     {optional} The refurring link, skip to avoid positioning
	 *
	 * @returns: $(menu)
	 */
	methods.message = function (message, link) {
			
		var optionNode = $("<div>", { "class": "no-hover keep-padding" })
			.text(message);
		
		return methods.create(optionNode, link);
		
	};

  	return methods;
});
