var fs = require("fs"),
    SimpleTest = require("./../lib/simple_test.js").SimpleTest,
    compiler = require("./../../build/scope.compiler.min.js");

SimpleTest("Scope compiler compile a single file", function (suite) {
    suite.test("Load file test case", function (test) {
        var test_script = fs.readFileSync(__dirname + "/support/suite3/test_script.js").toString(),
            test_script_compiled = fs.readFileSync(__dirname + "/support/suite3/test_script_compiled.js").toString();

        var compiled = compiler(test_script);

        test.assert("compiled file is not the same as example.", compiled == test_script_compiled);
    });
});