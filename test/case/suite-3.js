var fs = require("fs"),
    SimpleTest = require("./../lib/simple_test.js").SimpleTest,
    compiler = require("./../../src/scope.compiler.js");

SimpleTest("Scope compiler comment and string ignore case", function (suite) {
    suite.test("starComment", function (test) {
        var str = "/***               */";

        var index = compiler.starComment(str, 0);
        test.assert(index == 20);
    });

    suite.test("slashComment", function (test) {
        var str = "//////////";

        var index = compiler.slashComment(str, 0);
        test.assert(index == 10);
    });

    suite.test("passString", function (test) {
        var str = "' heloo this is world speaking', yes";

        var index = compiler.passString(str, 1, "'");
        test.assert(index == 30);
    });

});