"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var config_1 = require("./config");
var routes_1 = require("./routes");
var app = (0, express_1.default)();
app.use(routes_1.router);
app.listen(config_1.default.port, function () {
    console.log("Server is running on port ".concat(config_1.default.port));
});
