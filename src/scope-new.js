(function () {
    var queues = {},
        modules = {};

    function task(func) {
        setTimeout(func, 13);
    }

    function forEach(arr, func) {
        var length = (arr)? arr.length : 0;
        for (var i = 0; i < length; i++) {
            func(arr[i], i);
        }
    }

    function asyncMap(arr, func, done) {
        var results = [],
            length = arr.length,
            i = 0;
        if (!length) {
            task(function () {
                done(results);
            });
        } else {
            forEach(arr, function (item, index) {
                task(function () {
                    func(item, function (result) {
                        i++;
                        results[index] = result;

                        if (i == length) done(results);
                    });
                });
            });
        }
    }

    function queueOrRun(name, func) {
        if (modules[name] && modules[name].o) {
            func();
        } else {
            if (!queues[name]) queues[name] = [];
            queues[name].push(func);
        }
    }

    function runQueue(name) {
        forEach(queues[name], function (func) {
            func();
        });
        delete queues[name];
    }

    function getFuncArgs(func) {
        var args = /^function\s*[\w\d]*\(([\w\d,_$\s]*)\)/.exec('' + func)[1];
        return args == ''? [] : args.replace(/\s+/gm, '').split(",");
    }

    function extract(obj, args) {
        if (typeof args === 'function') {
            obj.d = getFuncArgs(args);
            obj.c = args;
        } else {
            obj.c = args.pop();
            obj.d = args;
        }
    }

    function scope() {
        var args = arguments,
            info,
            obj= {};

        if (args.length == 1) {
            info = args[0];
        } else {
            obj.n = args[0];
            info = args[1];
        }

        extract(obj, info);

        if (obj.n) {
            if (modules[obj.n]) {
                throw "Module " + obj.n + " has been registered before.";
            }
            modules[obj.n] = obj;
        }

        asyncMap(obj.d, function (dependency, func) {
            queueOrRun(dependency, function () {
                func(modules[dependency].o);
            });
        }, function (loadedDependencies) {
            obj.o = obj.c.apply(null, loadedDependencies);
            if (obj.n) {
                runQueue(obj.n);
            }
        });
    }

    module.exports = {
        task: task,
        forEach: forEach,
        asyncMap: asyncMap,
        getFuncArgs: getFuncArgs,
        extract: extract,
        scope: scope
    };

}());

/*
* scope([function () {
* }])
*
* scope(function () {
* })
*
* scope("hello", function () {
* })
*
* */

