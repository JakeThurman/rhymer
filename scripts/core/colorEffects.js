define([ "helperMethods", "textResources" ], function (helpers, resources) {
	"use strict";	
	function correctHexValue(hex) {
		/* validate hex string -> convert #fff to #ffffff */
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		
		if (hex.length !== 3 && hex.length !== 6)
			throw new Error("This does not seem to be a valid hex string: " + hex);
		if (hex.length !== 6)
			return hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		
		return hex;
	}
	
	var methods = {};
	
	/* adapted from http://stackoverflow.com/questions/4057475/rounding-colour-values-to-the-nearest-of-a-small-set-of-colours */
	methods.round = function(color) {
		/* Function to convert HEX to RGB */
		function hex2rgb( colour ) {
			var r,g,b;
			colour = correctHexValue(colour);

			r = colour.charAt(0) + colour.charAt(1);
			g = colour.charAt(2) + colour.charAt(3);
			b = colour.charAt(4) + colour.charAt(5);

			r = parseInt( r, 16 );
			g = parseInt( g, 16 );
			b = parseInt( b, 16);
			return [r, g, b];
		}
		
		var color_names = ["color_DarkRed","color_DarkRed","color_Red","color_Red","color_Pink","color_LightPurple","color_Purple","color_DarkBlue","color_Blue","color_Blue","color_Turquoise","color_LightGreen","color_Green","color_DarkGreen","color_YellowBrown","color_DarkYelow","color_Yellow","color_LightYellow","color_LightOrange","color_Orange","color_Orange","color_DarkOrange","color_LightBrown","color_Brown","color_Black","color_Gray","color_LightGray","color_White"];
		var base_colors = ["660000","990000","cc0000","cc3333","ea4c88","993399","663399","333399","0066cc","0099cc","66cccc","77cc33","669900","336600","666600","999900","cccc33","ffff00","ffcc33","ff9900","ff6600","cc6633","996633","663300","000000","999999","cccccc","ffffff"];

		var leadingHash = color && color.charAt(0) && color.charAt(0) === "#";
		
		/* Convert to RGB, then R, G, B */
		var color_rgb = hex2rgb(color);
		var color_r = color_rgb[0];
		var color_g = color_rgb[1];
		var color_b = color_rgb[2];

		/* Create an empty array for the difference between the colours */
		var differenceArray=[];

		/* Convert the HEX color in the array to RGB colors, split them up to R-G-B, then find out the difference between the "color" and the colors in the array */
		helpers.forEach(base_colors, function(value) { 
			var base_color_rgb = hex2rgb(value);
			var base_colors_r = base_color_rgb[0];
			var base_colors_g = base_color_rgb[1];
			var base_colors_b = base_color_rgb[2];

			/* Add the difference to the differenceArray */
			differenceArray.push(Math.sqrt((color_r-base_colors_r)*(color_r-base_colors_r)+(color_g-base_colors_g)*(color_g-base_colors_g)+(color_b-base_colors_b)*(color_b-base_colors_b)));
		});

		/* Get the lowest number from the differenceArray */
		var lowest = Math.min.apply( Math, differenceArray);

		/* Get the index for that lowest number */
		var index = differenceArray.indexOf(lowest);

		/* Return the HEX code */
		return {
			name: resources[color_names[index]],
			color: (leadingHash ? "#": "") + base_colors[index]
		};
	};
	
	/* function content taken from http://www.sitepoint.com/javascript-generate-lighter-darker-color/ */
	methods.highlight = function(hex, luminance) {
		hex = correctHexValue(hex);
		luminance = luminance || 0;

		/* convert to decimal and change luminosity */
		var rgb = "#", c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * luminance)), 255)).toString(16);
			rgb += ("00"+c).substr(c.length);
		}

		return rgb;
	};
	
	return methods;
});