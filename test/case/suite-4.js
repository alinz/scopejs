var fs = require("fs"),
    SimpleTest = require("./../lib/simple_test.js").SimpleTest,
    compiler = require("./../../src/scope.compiler.js");

SimpleTest("Scope compiler compile a single file", function (suite) {

    suite.test("Load file test case 1", function (test) {
        var test_script = fs.readFileSync(__dirname + "/support/suite4/test_script_0.js").toString(),
            test_script_compiled = fs.readFileSync(__dirname + "/support/suite4/test_script_0_compiled.js").toString();

        var compiled = compiler(test_script);

        test.assert("compiled file is not the same as example.", compiled == test_script_compiled);
    });

    suite.test("Load file test case 2", function (test) {
        var test_script = fs.readFileSync(__dirname + "/support/suite4/test_script_1.js").toString(),
            test_script_compiled = fs.readFileSync(__dirname + "/support/suite4/test_script_1_compiled.js").toString();

        var compiled = compiler(test_script);

        test.assert("compiled file is not the same as example.", compiled == test_script_compiled);
    });
});