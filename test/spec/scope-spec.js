var scope = require("./../scope-new.js");

describe("Internal scope functionality", function () {
    it("should loop through a list and add all the items", function () {
        var result = 0;
        scope.forEach([1,2,3,4], function (item) {
            result += item;
        });

        expect(result).toBe(10);
    });


    it("should async iterate over an array and add a one to all the numbers.", function () {
        var done = false;

        runs(function () {
            scope.asyncMap([1,2,3,4], function (item, result) {
                result(item + 1);
            }, function (results) {
                expect(results).toEqual([2,3,4,5]);
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        });
    });

    it("should returns arguments of functions", function () {
        var func = function (a, b, c) {};

        var args = scope.getFuncArgs(func);

        expect(args).toEqual(['a', 'b', 'c']);
    });

    it("should returns an empty array for function arguments", function () {
        var func = function () {};

        var args = scope.getFuncArgs(func);

        expect(args).toEqual([]);
    });

    it("should decompose function without any dependencies", function () {
        var obj = {};
        var func = function () {};
        scope.extract(obj, func);

        expect(obj).toEqual({ c: func, d: []});
    });

    it("should decompose function with one dependency", function () {
        var obj = {};
        var func = function (a) {};
        scope.extract(obj, func);

        expect(obj).toEqual({ c: func, d: ['a']});
    });

    it("should decompose function with multiple dependencies", function () {
        var obj = {};
        var func = function (a, b, c) {};
        scope.extract(obj, func);

        expect(obj).toEqual({ c: func, d: ['a', 'b', 'c']});
    });

    it("should decompose function inside array and inject nothing", function () {
        var obj = {};
        var arr = [function () {}];
        var func = arr[0];

        scope.extract(obj, arr);

        expect(obj).toEqual({ c: func, d: []});
    });

    it("should decompose function inside array and inject 1 dependency", function () {
        var obj = {};

        var arr = ['a', function () {}];

        var func = arr[1];

        scope.extract(obj, arr);

        expect(obj).toEqual({ c: func, d: ['a']});
    });

    it("should decompose function inside array and inject 2 dependencies", function () {
        var obj = {};

        var arr = ['a', 'b', 'c', function () {}];

        var func = arr[3];

        scope.extract(obj, arr);

        expect(obj).toEqual({ c: func, d: ['a', 'b', 'c']});
    });
});