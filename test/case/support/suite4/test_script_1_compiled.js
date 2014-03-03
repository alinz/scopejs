scope(function (Arg1, Arg2) {

    scope("Arg1", function (Arg1) {

    })(["Arg1"]);

    scope("Arg1", function (Arg2) {

    })(["Arg2"]);

    //WOW this is amazing
    scope("Arg1", function (Arg2) {

        scope("Arg1", function (Arg1) {

            /**
             * This is really cool (Amazing)
             */
            scope("Arg1", function (Arg2) {

                scope("Arg1", function (Arg2) {
                    return "()))))))";
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