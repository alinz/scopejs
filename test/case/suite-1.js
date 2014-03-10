var SimpleTest = require("./../lib/simple_test.js").SimpleTest,
    scope = require("./../../src/scope.optimized.js");;

SimpleTest("Scope node.js test suite", function (suite) {

    suite.test("register a function with name and execute it", function (test) {
        scope("Test0", function () {
            test.assert("", true);
        });
    });

    suite.test("anonymous function call", function (test) {
        scope(function () {
            test.assert(true);
        });
    });

    suite.test("single dependency injection call", function (test) {
        scope("Test2_1", function () {
            return "Test2_1";
        });

        scope(function (Test2_1) {
            test.assert(Test2_1 == "Test2_1");
        });
    });

    suite.test("double dependency injection calls", function (test) {
        scope("Test3_1", function () {
            return "Test3_1";
        });

        scope("Test3_2", function () {
            return "Test3_2";
        });

        scope(function (Test3_1, Test3_2) {
            test.assert(Test3_1 == "Test3_1" && Test3_2 == "Test3_2");
        });
    });

    suite.test("double dependency injection calls switch variables", function (test) {
        scope("Test4_1", function () {
            return "Test4_1";
        });

        scope("Test4_2", function () {
            return "Test4_2";
        });

        scope(function (Test4_2, Test4_1) {
            test.assert(Test4_2 == "Test4_2" && Test4_1 == "Test4_1");
        });
    });

    suite.test("different order of defining scope", function (test) {
        scope(function (Test5_1, Test5_2) {
            test.assert(Test5_1 == "Test5_1" && Test5_2 == "Test5_2");
        });

        scope("Test5_2", function () {
            return "Test5_2";
        });

        scope("Test5_1", function () {
            return "Test5_1";
        });
    });

    suite.test("multiple loading sequences", function (test) {
        scope("Test6_2", function (Test6_1) {
            return "Test6_2" + Test6_1;
        });

        scope(function (Test6_1, Test6_2) {
            test.assert(Test6_1 == "Test6_1" && Test6_2 == "Test6_2Test6_1")
        });

        scope("Test6_1", function () {
            return "Test6_1";
        });
    });

    suite.test("loading single scope using require from different file", function (test) {
        scope.get = function (name, update) {
            var filename = './support/suite1/' + name + '.js';
            require(filename);
            update();
        };

        scope(function (Test7_1) {
            test.assert(Test7_1 == "Test7_1");
        });
    });

    suite.test("loading multiple scopes using require from different file", function (test) {
        scope(function (Test8_1, Test8_2) {
            test.assert(Test8_1 == "Test8_1" && Test8_2 == "Test8_2");
        });
    });

    suite.test("loading multiple loading sequences using require from different files", function (test) {
        scope(function (Test9_3) {
            test.assert(Test9_3 == "Test9_3Test9_1Test9_2Test9_1");
        });
    });
});