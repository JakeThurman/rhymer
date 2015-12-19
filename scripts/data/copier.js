define(function () {
	"use strict";
	
	/* SOURCE: http://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript#answer-30810322 */
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
		if (!hasFile(fileEl))
			throw new Error("@fileEl has no file selected");
			
		var reader = new FileReader();

		reader.onloadend = function(evt) {
			if (evt.target.readyState === FileReader.DONE)
				callback(evt.target.result);
		};

		reader.readAsBinaryString(fileEl.files[0]);
	}

	document.querySelector('.readBytesButtons').addEventListener('click', function(evt) {
		if (evt.target.tagName.toLowerCase() == 'button') {
			readFile(document.getElementById('files'));
		}
	}, false);
	
	return {
		clipboard: clipboard,
		hasFile: hasFile,
		readFile: readFile,
	};
});