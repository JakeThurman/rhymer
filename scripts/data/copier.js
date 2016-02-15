define(function () {
	"use strict";
	
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
		var fileName = fileEl.files[0].name;

		reader.onloadend = function(evt) {
			if (evt.target.readyState === FileReader.DONE)
				callback(evt.target.result, fileName);
		};

		reader.readAsBinaryString(fileEl.files[0]);
	}
	
	// Source: http://jsfiddle.net/uselesscode/qm5ag/
	var prevFile;
	function makeFile(text) {
		if (!supportsFileAPI())
			throw new Error("File API not supported");
		
		// Revoke the old file URL to avoid memory leaks.
		if (prevFile)
			window.URL.revokeObjectURL(prevFile);
		
		//Create the file
		prevFile = window.URL.createObjectURL(new Blob([text], {type: 'text/plain'}));
		return prevFile;
	}
	
	return {
		hasFile: hasFile,
		readFile: readFile,
		makeFile: makeFile,
	};
});