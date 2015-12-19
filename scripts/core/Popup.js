define([ "jquery" ], function ( $ ) {
	"use strict";
	var openPopups = {};

	var methods = {};

	methods.close = function(popupId) {
		openPopups[popupId].close();
		openPopups[popupId].el.remove();
		delete openPopups[popupId];
	};
	
	methods.isOpen = function (popupId) {
		return !!openPopups[popupId];
	};

	function assertOptionValidity(options) {
		var errorMessage = "";

		if (!options)
			 errorMessage += "options is required! ";
		if (!options.title)
			 errorMessage += "options.title is required! ";
		if (!options.id)
			 errorMessage += "options.id is required! ";
			 
		if (errorMessage !== "")
			 throw errorMessage;
	}

	//Class		
	function _Popup(el, options) {
		this.el = el;
		this.id = options.id;
	}
	/*	Content [JQuery Array]:	
	 *			$("#popup-data");
	 *
	 *	Options {object}: {
	 *		title: 			(String) 	[Required] 	    Popup Title
	 *		id: 			(Any) 		[Required]		Auto closes the popup of that id if it tries to open again (so the icon will close & so no duplicates)
	 *		renameable: 	(Boolean) 	{Default:false}	Is this user renamable?
  	 *		footer:			($object)					Appended as a global footer for the popup
	 *		header:			($object)					Appended to the header and floated to the right 
	 *		init: 			(function)					Safe place to put logic done after popup create 
	 *														Params: { _Popup: object of this board (See top) }
	 *		cancel:			(function)					Called on close button click.
	 *      close:          (function)                  Called on close of any type.
	 *		rename:			(function)					Called on rename.
	 *														Params: { Name: new name, _Popup: object of this board (See top) }
	 */
	 methods.create = function (content, options) {  	 
		//Make sure the options are valid.
		assertOptionValidity(options);

		if (methods.isOpen(options.id))
			return methods.close(options.id);

		//Create the popup
		var popup = $("<div>", { "class": "output-box" });

		//Add a close button if there's no header button
		if (!options.header) {
			options.header = $("<button>", { "class": "close-button" })
				.text("x")
				.click(function () {
					methods.close(options.id);
					if (options.cancel)
						options.cancel();
					if (options.close)
						options.close();
				});
		}

		//Create the header 
		var header = $("<div>", { "class": "header" })
			.appendTo(popup)
			.append(options.header);

		var title = $("<h2>")
			.text(options.title)
			.appendTo(header);
			 
		//Create the content container
		var allContent = $("<div>", { "class": "content" })
			.append(content)
			.appendTo(popup);
			
		if (options.footer)
			popup.append(options.footer.addClass("footer"));

		//Add rename functionality if needed
		if (options.renameable) {
			var rename = function () {
			title.replaceWith(renameBox);
			renameBox.focus();
			
			options.header.hide();
								
			renameBox.blur(switchBack)
				.keyup(function (e) {
					if (e.keyCode === 13)/*enter button*/
						 switchBack();
				});
		};
				
			var switchBack = function () {
				var oldName = title.text();
				var newName = renameBox.val();

				if (newName !== oldName) {
					title.text(newName);

					if (options.rename)
						options.rename(newName, options.id);
				}
				renameBox.replaceWith(title);
				options.header.show();
				title.click(rename); /*make the next click rename too!*/
			};
				
			var renameBox = $("<input>", { type: "text", "class": "full-width" })
				.val(title.text());
				
			title.addClass('renameable')
				.click(rename);
		}

		//Save the data
		var outputPopup = new _Popup(popup, options);

		//Init! -> Do this for safe logic that won't get called if the popup gets closed!
		if (options.init)
		options.init(outputPopup);

		//record that this popup is open
		openPopups[options.id] = { 
			el: outputPopup.el,
			close: function () { 
				if (options.close)
					options.close();
			}
		};

		//return the popup
		return outputPopup; //remeber this is undefined on close!
	};

	return methods;
});