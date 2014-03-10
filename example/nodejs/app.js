var scope = require("./../../src/scope.optimized.js");;

scope.get = function (name, update) {
    require("./module/" + name.toLowerCase() + '.js');
    update();
};

scope(function (Test1, Test2) {
    console.log(Test1 + ' ' + Test2);
});