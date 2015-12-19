define(["async"], function (async) {
	describe("core/async.js", function () {
		describe("delay", function () {
			var completed = false;
			
			var completionMs = -1;
			var exepectedTime = 100;
			
			var argIn1 = "test";
			var argOut1;
			var argIn2 = [{ bigger: "test", obj: "becuase", i: "can" }, [ 1, 2, 3, ]];
			var argOut2;
			
			beforeEach(function (done) {
				var start = new Date().getTime();
				async.delay(exepectedTime, function (arg1, arg2) {
					var end = new Date().getTime();
					
					completed = true;
					completionMs = end - start;
					argOut1 = arg1;
					argOut2 = arg2;
					
					done();
				}, argIn1, argIn2);
			});
			
			it("should run the function by 15ms of when it was supposed to", function () {
				expect(completed).toBe(true);
				expect(completionMs).toBeGreaterThan(exepectedTime - 1);
				expect(completionMs).toBeLessThan(exepectedTime + 15);
			});
			
			it("should give all extra arguments to the delayed function", function () {
				expect(argOut1).toEqual(argIn1);
				expect(argOut2).toEqual(argIn2);
			});
		});
		
		describe("run", function () {
			var completed = false;
			
			var completionMs = -1;
			
			var argIn1 = "test";
			var argOut1;
			var argIn2 = [{ bigger: "test", obj: "becuase", i: "can" }, [ 1, 2, 3, ]];
			var argOut2;
			
			beforeEach(function (done) {
				var start = new Date().getTime();
				async.run(function (arg1, arg2) {
					var end = new Date().getTime();
					
					completed = true;
					completionMs = end - start;
					argOut1 = arg1;
					argOut2 = arg2;
					
					done();
				}, argIn1, argIn2);
			});
			
			it("should run the function by 15ms of when it was supposed to", function () {
				expect(completed).toBe(true);
				expect(completionMs).toBeGreaterThan(-1);
				expect(completionMs).toBeLessThan(15);
			});
			
			it("should give all extra arguments to the delayed function", function () {
				expect(argOut1).toEqual(argIn1);
				expect(argOut2).toEqual(argIn2);
			});
		});
	});
});