var SimpleTest = require("./../lib/simple_test.js").SimpleTest,
    compiler = require("./../../build/scope.compiler.min.js");

SimpleTest("Scope compiler node.js test suite", function (suite) {

    suite.test("testing makeArrayString with no elements", function (test) {
        var arr = [],
            result = compiler.makeArrayString(arr);

        test.assert("result is not empty array", (result == '[]'));
    });

    suite.test("testing makeArrayString with one element", function (test) {
        var arr = ["Hello"],
            result = compiler.makeArrayString(arr);

        test.assert("Element is not there", result == '["Hello"]');
    });

    suite.test("testing makeArrayString with two element", function (test) {
        var arr = ["Hello", "World"],
            result = compiler.makeArrayString(arr);

        test.assert(result == '["Hello", "World"]');
    });

    suite.test("testing findAllOccurrences with no element find", function (test) {
        var str = 'scope1(function() { })',
            result = compiler.findAllOccurrences(str);

        test.assert(result.length == 0);
    });

    suite.test("testing findAllOccurrences one element with one argument", function (test) {
        var str = 'scope(function(Arg1) { })',
            result = compiler.findAllOccurrences(str);

        test.assert(result.length == 1 && result[0].args !== false && result[0].args === '["Arg1"]')
    });

    suite.test("testing findAllOccurrences one element with two arguments", function (test) {
        var str = 'scope(function(Arg1, Args2) { })',
            result = compiler.findAllOccurrences(str);

        test.assert(result.length == 1 && result[0].args !== false && result[0].args === '["Arg1", "Args2"]')
    });

    suite.test("testing findAllOccurrences two element with no arguments", function (test) {
        var str = 'scope(function() { }); scope(function() { });',
            result = compiler.findAllOccurrences(str);

        test.assert(result.length == 0)
    });

    suite.test("testing findAllOccurrences two elements with one has one argument and second one doesn't", function (test) {
        var str = 'scope(function(Arg1) { }); scope(function() { });',
            result = compiler.findAllOccurrences(str);

        test.assert(result.length == 1 &&
                     result[0].args === '["Arg1"]' &&
                     result[0].index == 20);
    });

    suite.test("testing findAllOccurrences two elements with both has arguments.", function (test) {
        var str = 'scope(function(Arg1) { }); scope(function(Arg2) { });',
            result = compiler.findAllOccurrences(str);

        test.assert(result.length == 2 &&
                    result[0].args === '["Arg1"]' &&
                    result[0].index == 20 &&
                    result[1].args === '["Arg2"]' &&
                    result[1].index == 47);
    });

    suite.test("testing findLocationToInsert one element", function (test) {
        var str = 'scope(function(Arg1) { });',
            result = compiler.findAllOccurrences(str),
            item = result[0],
            value = compiler.findLocationToInsert(str, item.index);

        test.assert(value == 25);
    });

    suite.test("testing findLocationToInsert two elements", function (test) {
        var str = 'scope(function(Arg1) { }); scope(function(Arg2) { });',
            scopes = compiler.findAllOccurrences(str),
            result = false;

        scopes.forEach(function (item, index) {
            var location = compiler.findLocationToInsert(str, item.index);
            if (index == 0 && location == 25) {
                result = true;
            } else if (result && index == 1 && location == 52) {
                result = true;
            } else {
                result = false;
            }
        });

        test.assert(result);
    });

    suite.test("testing insertStringAt", function (test) {
        var target = "Hello John",
            input = "World and ",
            result = compiler.insertStringAt(input, target, 6);

        test.assert(result == "Hello World and John")
    });

    suite.test("testing actual compile function with one argument", function (test) {
        var str = 'scope(function(Arg1) { });',
            result = compiler(str);

        test.assert(result == 'scope(function(Arg1) { })(["Arg1"]);');
    });

    suite.test("testing actual compile function with two arguments", function (test) {
        var str = 'scope(function(Arg1, Arg2) { });',
            result = compiler(str);

        test.assert(result == 'scope(function(Arg1, Arg2) { })(["Arg1", "Arg2"]);');
    });

    suite.test("testing actual compile function 2 elements with two arguments", function (test) {
        var str = 'scope(function(Arg1, Arg2) { }); scope(function(Arg1, Arg2) { });',
            value = compiler(str);
        test.assert(value == 'scope(function(Arg1, Arg2) { })(["Arg1", "Arg2"]); scope(function(Arg1, Arg2) { })(["Arg1", "Arg2"]);');
    });

    suite.test("testing actual compile function 2 elements with two arguments and one element without arguments", function (test) {
        var str = 'scope(function(Arg1, Arg2) { }); scope(function() { }); scope(function(Arg1, Arg2) { });',
            value = compiler(str);
        test.assert(value == 'scope(function(Arg1, Arg2) { })(["Arg1", "Arg2"]); scope(function() { }); scope(function(Arg1, Arg2) { })(["Arg1", "Arg2"]);');
    });
});