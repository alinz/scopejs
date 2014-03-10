var SimpleTest = require("./../lib/simple_test.js").SimpleTest,
    scope = require("./../../src/scope.optimized.js");;

SimpleTest("Found a bug issue number", function (suite) {



    suite.test("loading same scope multiple times with different scope", function (test) {

        var counter = 1;
        scope.get = function (name, update) {
            setTimeout(function () {
                var filename = './support/suite5/' + name + '.js';
                require(filename);
                update();
            }, 20 * counter);
            counter++;
        };


        scope(function (App) {
            test.assert(App == "AppControllerAppControllerDashboardControllerAppControllerSessionController");
        })

    });
});

