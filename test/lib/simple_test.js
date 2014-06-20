var suites = [],
    suiteCount = 0,
    currentSuite = 0,
    defaultTimeout;

function nextSuite() {
    if (suites[currentSuite]) {
        currentSuite++;
        return suites[currentSuite - 1];
    } else {
        return false;
    }
}

function runTests(suite) {
    if (!suite) return;

    console.log(suite.description);

    var testCounter = 0,
        failedCounter = 0,
        timeoutCounter = 0;

    function next() {
        testCounter++;
        if (suite.tests.length == testCounter) {
            console.log("");
            console.log("    Suite Result");
            console.log("       Succeed: " + (testCounter - failedCounter - timeoutCounter) +
                             ", Failed: " + failedCounter +
                             ", Timeout: " + timeoutCounter +
                             ", Total: " + testCounter);
            console.log("");
            setTimeout(function () {
                runTests(nextSuite());
            }, 13);
        }
    }

    suite.tests.forEach(function (test) {
        var proceed = true,
            internalTimeout;

        internalTimeout = setTimeout(function () {
            proceed = false;
            console.log("    TIMEOUT : " + test.testName);
            timeoutCounter++;
            next();
        }, defaultTimeout);

        test.test({
            assert: function (errMessage, logic) {
                if (!proceed) return;

                if (typeof errMessage !== "string") {
                    logic = errMessage;
                    errMessage = "";
                }

                if (logic) {
                    console.log("    OK : " + test.testName);
                } else {
                    console.log("    ERROR : " + test.testName + ((errMessage != "")? " -> " + errMessage : ""));
                    failedCounter++;
                }

                clearTimeout(internalTimeout);
                next();
            }
        });
    });
}

function SimpleTest(description, func) {
    var tests = [];

    func({
        test: function (testName, func) {
            tests.push({
                testName: testName,
                test: func
            });
        }
    });

    suites.push({
        description: description,
        tests: tests
    });
}

function run(options) {
    var requiredPath;

    if (!options || !options.path || !options.filename) {
        throw "options are not passed correctly.";
    }

    defaultTimeout = options.timeout || 5000;

    while (true) {
        try {
            requiredPath = "." + options.path + options.filename.replace('?', (suiteCount + 1) + '');
            require(requiredPath);
            suiteCount++;
        } catch (e) {
            break;
        }
    }

    runTests(nextSuite());
}

module.exports = {
    SimpleTest: SimpleTest,
    run: run
};