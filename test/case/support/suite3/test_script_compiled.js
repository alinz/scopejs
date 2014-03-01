scope(function (Arg1, Arg2) {

    scope("Arg1", function (Arg1) {

    })(["Arg1"]);

    scope("Arg1", function (Arg2) {

    })(["Arg2"]);

    scope("Arg1", function (Arg2) {

        scope("Arg1", function (Arg1) {

            scope("Arg1", function (Arg2) {

                scope("Arg1", function (Arg2) {

                })(["Arg2"]);

            })(["Arg2"]);

        })(["Arg1"]);

    })(["Arg2"]);

})(["Arg1", "Arg2"]);

scope(function () {

});

scope("Arg1", function (Arg2) {

})(["Arg2"]);

scope("Arg1", function (Arg1) {

})(["Arg1"]);