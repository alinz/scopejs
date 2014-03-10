var scope = require("./../../../../src/scope.optimized.js");

scope("App", function (AppController, DashboardController, SessionController) {
    return AppController + DashboardController + SessionController;
});