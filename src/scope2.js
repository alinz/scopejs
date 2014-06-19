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

    /**
     * Conditions:
     * 1: Module has been registered but not loaded
     * 2: Module has been registered and loaded
     * 3: Module has not been registered
     *
     * @param name
     * @param func
     */
    function queueOrGet(name, func) {
        if (!modules[name]) {
            if (!scope.get) throw "Err1";
            modules[name] = {};
            if (!queues[name]) queues[name] = [];
            queues[name].push(func);
            scope.get(name, function (o) {
                if (o) {
                    modules[name] = {o: o};
                }
                func();
            });
        } else {
            if (modules[name].o !== undefined) {
                func();
            } else {
                if (!queues[name]) queues[name] = [];
                queues[name].push(func);
            }
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

    function scope() {
        var args = arguments,
            info,
            target,
            obj= {};

        if (args.length == 1) {
            info = args[0];
        } else {
            obj.n = args[0];
            info = args[1];
        }

        if (typeof info === 'function') {
            obj.d = getFuncArgs(info);
            obj.c = info;
        } else {
            obj.c = info.pop();
            obj.d = info;
        }

        //console.log(obj);

        if (obj.n) {
            //We are checking whether module is requested or loaded.
            //if target object is available + dependencies, it means that we have duplicates
            //if we have only target but not dependencies, it means that module was requested by get call and module
            //has been downloaded and now the real module is registering it self.
            target = modules[obj.n];
            if (target && target.d) {
                throw "Err2: " + obj.n;
            }
            modules[obj.n] = obj;
        }

        asyncMap(obj.d, function (dependency, func) {
            queueOrGet(dependency, function () {
                func(modules[dependency].o);
            });
        }, function (loadedDependencies) {
            obj.o = obj.c.apply(null, loadedDependencies);
            if (obj.n) {
                runQueue(obj.n);
            }
        });
    }

    try {
        module.exports = scope;
    } catch(e) {
        window.scope = scope;
    }
}());