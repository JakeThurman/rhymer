define([ "!domReady" ], function () {
	"use strict";

	/* helpers */
	function css(el, obj) {
		for (var key in obj) {
			if(obj.hasOwnProperty(key)) {
				el.style[key] = obj[key];
			}
		}
		return el;
	}
	
	function createEl(tagName, text) {
		var el = document.createElement(tagName);
		el.appendChild(document.createTextNode(text));
		return el;
	}
	
	/* Public */
	function print(bodyText, printedPageName) {	
		//Create the iframe
		var frame = css(document.createElement("iframe"), {
			position: "absolute",
			left: "-1000px",
			top: "-1000px",
		});
		
		//Attach the frame to the dom
		document.body.appendChild(frame);
	
		//Add the text elements to the frame		
		var el = createEl("pre", bodyText);
		el.style.fontSize = "22px";
		frame.contentDocument.body.appendChild(el);
		
		//Set the page title
		if (printedPageName)
			frame.contentDocument.title = printedPageName;
		
		//Print
		frame.contentWindow.print();
			
		//Clean up
		document.body.removeChild(frame);
	}	
	
	return {
		print: print,
	};
});