(function () {
    var count = 0,
        scopes = {},
        events = {},
        function_signature_expr = /^function\s*[\w\d]*\(([\w\d,_$\s]*)\)/;

    function task(func) {
        setTimeout(func, 13);
    }

    function trim(str) {
        return str.replace(/^\s+|\s+$/gm, '');
    }

    function forEach(arr, func) {
        for (var i = 0; i < arr.length; i++) func(arr[i], i);
    }

    function map(func, arr, done) {
        var results = [],
            length = arr.length,
            i = 0;

        if (!arr || !length) return (done)? done(results) : results;

        forEach(arr, function (element, index) {
            if (!done) {
                results.push(func(element));
                return;
            }
            func(element, function (result) {
                i++;
                results[index] = result || scopes[element].o;
                if (length == i) done(results);
            });
        });
        if (!done) return results;
    }

    function extractDependencies(func) {
        var str = '' + func,
            groups = function_signature_expr.exec(str),
            args = groups[1];
        return (trim(args) == '')? [] : map(trim, args.split(","));
    }

    function addEvent(event, func) {
        if (!events[event]) events[event] = [];
        events[event].push(func);
    }

    function processEvent(name) {
        forEach(events[name], function (done) {
            done();
        });
        delete events[name];
    }

    function run(name) {
        var item = scopes[name];
        map(
            function (dependencyName, insert) {
                addEvent(dependencyName, function () {
                    insert(events[dependencyName].o);
                });

                if (scopes[dependencyName]) run(dependencyName);
                else {
                    if (!scope.get) throw "Err1";
                    scope.get(dependencyName, function (result) {
                        if (result) {
                            if (!scopes[dependencyName]) scopes[dependencyName] = {};
                            scopes[dependencyName].o = result;
                            processEvent(dependencyName);
                        }
                    });
                }
            },
            item.d,
            function (dependencies) {
                item.o = item.f.apply(null, dependencies);
                if (events[name]) processEvent(name);
            }
        );
    }

    function scope() {
        var args = arguments,
            name,
            fn;

        if (args.length == 1) {
            name = '*' + (count++);
            fn = args[0];
        } else {
            name = args[0];
            fn = args[1];
        }

        if (scopes[name]) throw "Err2:" + name;

        scopes[name] = {
            d: extractDependencies(fn),
            f: fn
        };

        task(function () {
            run(name);
        });

        return function (dependencies) {
            scopes[name].d = dependencies;
        };
    }

    if (module) module.exports = scope;
    else window.scope = scope;
}());