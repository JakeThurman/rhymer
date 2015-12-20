define(["jquery"], function ($) {
	"use strict";
	
	// Source: http://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript#answer-30810322
	function clipboard(text) {		
		var textArea = document.createElement("textarea");

		//
		// *** This styling is an extra step which is likely not required. ***
		//
		// Why is it here? To ensure:
		// 1. the element is able to have focus and selection.
		// 2. if element was to flash render it has minimal visual impact.
		// 3. less flakyness with selection and copying which **might** occur if
		//    the textarea element is not visible.
		//
		// The likelihood is the element won't even render, not even a flash,
		// so some of these are just precautions. However in IE the element
		// is visible whilst the popup box asking the user for permission for
		// the web page to copy to the clipboard.
		//

		// Place in top-left corner of screen regardless of scroll position.
		textArea.style.position = 'fixed';
		textArea.style.top = 0;
		textArea.style.left = 0;

		// Ensure it has a small width and height. Setting to 1px / 1em
		// doesn't work as this gives a negative w/h on some browsers.
		textArea.style.width = '2em';
		textArea.style.height = '2em';

		// We don't need padding, reducing the size if it does flash render.
		textArea.style.padding = 0;

		// Clean up any borders.
		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';

		// Avoid flash of white box if rendered for any reason.
		textArea.style.background = 'transparent';


		textArea.value = text;

		document.body.appendChild(textArea);

		textArea.select();

		try {
			var success = document.execCommand('copy');
			document.body.removeChild(textArea);
			return success;
		} catch (e) {
			document.body.removeChild(textArea);
			return false;
		}
	}
	
	function supportsFileAPI() {
		try { 
			return 'File' in window && window.File != null
				&& 'FileReader' in window && window.FileReader != null
				&& 'FileList' in window && window.FileList != null
				&& 'Blob' in window && window.Blob != null; 
		} catch (e) { 
			return false; 
		}
	}
	
	function hasFile(fileEl) {
		try {
			return fileEl.files.length;
		} catch (e) {
			return false;
		}
	}
	
	function readFile(fileEl, callback) {		
		if (!supportsFileAPI())
			throw new Error("File API not supported");
		if (!hasFile(fileEl))
			return false;
			
		var reader = new FileReader();

		reader.onloadend = function(evt) {
			if (evt.target.readyState === FileReader.DONE)
				callback(evt.target.result);
		};

		reader.readAsBinaryString(fileEl.files[0]);
	}
	
	// Source: http://jsfiddle.net/uselesscode/qm5ag/
	function makeFile(text) {
		if (!supportsFileAPI())
			throw new Error("File API not supported");
		
		return window.URL.createObjectURL(new Blob([text], {type: 'text/plain'}));
	}
	
	function downloadFile(text, fileName) {
		var file = makeFile(text);
		
		$("<a>", { 
			href: file,
			download: fileName
		}).appendTo(document.body)
			.click()
			.remove();
		
		// Revoke the object URL to avoid memory leaks.
		window.URL.revokeObjectURL(file);
	}
	
	return {
		clipboard: clipboard,
		hasFile: hasFile,
		readFile: readFile,
		downloadFile: downloadFile,
	};
});