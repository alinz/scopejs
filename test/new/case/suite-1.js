var SimpleTest = require("./../../lib/simple_test.js").SimpleTest,
    scope = require("./../../../src/scope2.js");

SimpleTest("Scope node.js test suite", function (suite) {

    scope.get = function (name, func) {
        setTimeout(function () {
            if (name == "DONE") {
                func("DONE");
            } else {
                scope("Test6", function () {
                    return "Test6";
                });
            }
        }, 1000);
    };

    suite.test("register a function with name and execute it", function (test) {
        scope("Test0", function () {
            test.assert("", true);
            return "Test0";
        });
    });

    suite.test("register a function with name and execute it, with different input", function (test) {
        scope("Test1", [function () {
            test.assert("", true);
            return "Test1";
        }]);
    });

    suite.test("register a function without name and execute it, with different input", function (test) {
        scope([function () {
            test.assert("", true);
        }]);
    });

    suite.test("register Test2 and request Test1 as a dependency", function (test) {
        scope("Test2", function (Test1) {
            test.assert(Test1 == "Test1");
            return "Test2";
        });
    });

    suite.test("register Test3 and request Test1 as a dependency in angular way", function (test) {
        scope("Test3", ["Test1", function (Test1) {
            test.assert(Test1 == "Test1");
            return "Test3";
        }]);
    });

    suite.test("register Test4 and request DONE as a dependency in angular way and scope.get is called", function (test) {
        scope("Test4", ["DONE", function (Test1) {
            test.assert(Test1 == "DONE");
            return "Test4";
        }]);
    });

    suite.test("register", function (test) {
        scope("Test5", ["Test6", function (Test6) {
            test.assert(Test6 == "Test6");
            return "Test5";
        }]);
    });

});