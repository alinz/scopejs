/**
 * scope.js: The world's smallest dependency injection framework for JavaScript
 * version: 0.1.1
 * By Ali Najafizadeh
 * MIT Licensed.
 */

(function () {
    var //this variable is used to create a unique anonymous function name.
        count = 0,

    //this map stores all the information about each scope module such as func, dependencies and obj
        scopes = {},

    //this map stores callbacks associated for each event.
        events = {},

    //this is regular expression for trimming strings
        trim_expr = /^\s+|\s+$/gm,

    //this is a regular expression for extracting information from function
        function_signature_expr = /^function\s*[\w\d]*\(([\w\d,_$\s]*)\)/;

    /**
     * This function post a task on javascript queue. This function makes function call async.
     * @param func {Function}
     */
    function task(func) {
        setTimeout(func, 13);
    }

    /**
     * This function trims spaces for any string.
     * @param str
     * @returns {String}
     */
    function trim(str) {
        return str.replace(trim_expr, '');
    }

    /**
     * This is very simple implementation of forEach. It basically applies passed function
     * to every elements of given array.
     * @param arr {Array}
     * @param func {Function}
     */
    function forEach(arr, func) {
        for (var i = 0; i < arr.length; i++) {
            func(arr[i], i);
        }
    }

    /**
     * This is an extend version of map function. map is a function that takes a function and applies it on every elements
     * of given array. The difference between map and forEach is that map produces another array and stores the result of function.
     *
     * This map is customized to be async as well. Basically if done function is given, it acts as a async map. So in
     * Async mode, once the map operation is done, it will call the done function and pass the results array to that function.
     *
     * @param func {Function}
     * @param arr {Array}
     * @param done {Function | undefined}
     * @returns {Array | undefined}
     */
    function map(func, arr, done) {
        var results = [],
            length = arr.length,
            i = 0;

        if (!arr || !length) {
            return (done)? done(results) : results;
        }

        forEach(arr, function (element, index) {
            if (!done) {
                results.push(func(element));
                return;
            }
            func(element, function (result) {
                i++;
                results[index] = result || scopes[element].obj;
                if (length == i) {
                    done(results);
                }
            });
        });
        if (!done) {
            return results;
        }
    }

    /**
     * This function is the main extractor of this library. It simply extracts variables from
     * given function by applying customized regular expression.
     *
     * @param func {Function}
     * @returns {Array}
     */
    function extractDependencies(func) {
        var str = '' + func,
            groups = function_signature_expr.exec(str),
            args = groups[1];
        return (trim(args) == '')? [] : map(trim, args.split(","));
    }

    /**
     * add a function callback to an event. Multiple callback can be assign to a single event
     *
     * @param event {String}
     * @param func {Function}
     */
    function addEvent(event, func) {
        var item = events[event];
        if (!item) {
            item = events[event] = [];
        }
        item.push(func);
    }

    /**
     * It simply goes through each callback function which was assign to that specific event.
     * This method is synchronous operation. Once it goes through all callbacks, it will remove all of them.
     *
     * @param name {string}
     */
    function processEvent(name) {
        forEach(events[name], function (done) {
            done();
        });
        delete events[name];
    }

    /**
     * This is the heart of scope library. It takes a name and try its best to find an inject dependencies.
     *
     * Most of the operation inside, is asynchronous.
     *
     * @param name {String}
     */
    function run(name) {
        var item = scopes[name];
        map(
            function (dependencyName, insert) {
                addEvent(dependencyName, function () {
                    insert(events[dependencyName].obj);
                });

                if (scopes[dependencyName]) {
                    run(dependencyName);
                } else {
                    if (!scope.get) {
                        throw "Err1";
                    }
                    scope.get(dependencyName, function (result) {
                        if (result) {
                            if (!scopes[dependencyName]) {
                                scopes[dependencyName] = {};
                            }
                            scopes[dependencyName].obj = result;
                            processEvent(dependencyName);
                        }
                    });
                }
            },
            item.dependencies || [],
            function (dependencies) {
                item.obj = item.obj || item.fn.apply(null, dependencies);
                item.status = "loaded";
                if (!events[name]) return;
                processEvent(name);
            }
        );
    }

    /**
     * This is an entire point to use scope.
     * It has 2 signatures.
     *  1: define your scope with name
     *      scope({String}, {Function});
     *
     *  2: define your scope with anonymous name
     *      scope({Function});
     *
     *  This function also returns a unique function which will be used to inject value if you use minification.
     *  Since, scope is depends on variable name, and during the process of uglification, the meaning of variable is
     *  destroyed, this function will be used to inject the right value into the function.
     *
     *  for example,
     *  scope(function (Test1, Test2) {
     *
     *  });
     *
     *  so this scope function depends on Test1 and Test2. However, if you pass this function through uglification the
     *  result will be as follow:
     *  scope(function (a, b) {
     *
     *  });
     *
     *  which destroyed the most valuable piece of information. For this manner, scope comes with a manual injector which
     *  helps inject the right value. for example the above example can be written as follows
     *
     *  scope(function (a, b){
     *
     *  })(['Test1', 'Test2']);
     *
     *  now, if this code passes through uglification, the meaning of variable will be stayed the same.
     *
     *  Please node that scope will come with a converter which goes through the entire source code and added proper
     *  code before minification or uglification. So the developer doesn't need to know and worry about this issue.
     *
     * @returns {Function}
     */
    function scope() {
        var args = arguments,
            length = args.length,
            name,
            fn,
            dependencies;

        if (length == 1) {
            name = '__func__' + (count++);
            fn = args[0];
        } else {
            name = args[0];
            fn = args[1];
        }

        if (scopes[name]) {
            if (scopes[name].status == "loading") {
                return;
            } else {
                throw JSON.stringify(arguments);
            }
        }

        dependencies = extractDependencies(fn);

        scopes[name] = {
            status: "loading",
            dependencies: dependencies,
            fn: fn
        };

        task(function () {
            run(name);
        });

        return function (dependencies) {
            scopes[name].dependencies = dependencies;
        };
    }

    try {
        module.exports = scope;
    } catch(e) {
        window.scope = scope;
    }
}());