define([ "colorEffects" ], function (colorEffects) {
	"use strict";
	
	describe("reporting/colorEffects.js", function () {
		describe("round", function () {
			it("should return an object with a name and a color property", function () {
				var result = colorEffects.round("#fefefe");
				
				var anykeys = false;
				var unexpectedKeys = false;
				var hasNameKey = false;
				var hasColorKey = false;
				
				for(var key in result) {
					anykeys = true;
					if (key === "name")
						hasNameKey = true;
					else if (key === "color")
						hasColorKey = true;
					else
						unexpectedKeys = true;
				}
				
				expect(anykeys).toBe(true);
				expect(hasNameKey).toBe(true);
				expect(hasColorKey).toBe(true);
				expect(unexpectedKeys).toBe(false);
			});
			
			it("should return both the name name and color properties as strings", function () {
				var result = colorEffects.round("#fefefe");
				
				expect(typeof result.color).toEqual("string");
				expect(typeof result.name).toEqual("string");
			});
			
			it("should return a value where color starts with a hash (becuase its value is in hex)", function () {
				var result = colorEffects.round("#fefefe");
				
				expect(typeof result.color).toEqual("string");
				expect(typeof result.name).toEqual("string");
			});
						
			it("should work if there is no leading hash in the input, and leave it out", function () {
				var result = colorEffects.round("fefefe");
				
				expect(result.color).toEqual("ffffff");
			});
			
			it("should work if there is a leading hash in the input", function () {
				var result = colorEffects.round("#fefefe");
				
				expect(result.color).toEqual("#ffffff");
			});
			
			it("should work if the input is a simple hex (#fff)", function () {
				var result = colorEffects.round("#fff");
				
				expect(result.color).toEqual("#ffffff");
			});
			
			it("should throw an error for an invalid hex input", function () {
				var thrower = function () {
					colorEffects.round("#123abx");
				};
				
				expect(thrower).toThrowError();
			});
		});
		
		describe("highlight", function () {			
			it("should return a lighter version of the color to the given percentage", function () {
				expect(colorEffects.highlight("#eeeeee", 0.3)).toEqual("#ffffff");
			});
			
			it("should return a darker version of the color to the given negitive percentage", function () {
				expect(colorEffects.highlight("#111111", -0.3)).toEqual("#0c0c0c");
			});
			
			it("should return 00 for 00, because true black doesn't get lighter", function () {
				expect(colorEffects.highlight("#00fefe", 0.2)).toEqual("#00ffff");
				expect(colorEffects.highlight("#000000", 0.2)).toEqual("#000000");
			});
			
			it("should work if there is no leading hash in the input", function () {
				expect(colorEffects.highlight("fefefe", 0.2)).toEqual("#ffffff");
			});
			
			it("should work if there is a leading hash in the input", function () {
				expect(colorEffects.highlight("#fefefe", 0.2)).toEqual("#ffffff");
			});
			
			it("should work if the input is a simple hex (#fff)", function () {
				expect(colorEffects.highlight("#eee", 0.2)).toEqual("#ffffff");
			});
			
			it("should throw an error for an invalid hex input", function () {
				var thrower = function () {
					colorEffects.highlight("#123abx", 0.2);
				};
				
				expect(thrower).toThrowError();
			});
		});
	});
});