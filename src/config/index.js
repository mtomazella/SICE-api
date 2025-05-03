"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config();
if (!process.env.POSTGRES_PASSWORD) {
    throw new Error('POSTGRES_PASSWORD environment variable is required');
}
var config = {
    port: (_a = Number(process.env.PORT)) !== null && _a !== void 0 ? _a : 3000,
    nodeEnv: (_b = process.env.NODE_ENV) !== null && _b !== void 0 ? _b : 'development',
    postgres: {
        user: (_c = process.env.POSTGRES_USER) !== null && _c !== void 0 ? _c : 'novadmin',
        password: process.env.POSTGRES_PASSWORD,
        host: (_d = process.env.POSTGRES_HOST) !== null && _d !== void 0 ? _d : 'localhost',
        port: (_e = Number(process.env.POSTGRES_PORT)) !== null && _e !== void 0 ? _e : 5432,
        database: (_f = process.env.POSTGRES_DB) !== null && _f !== void 0 ? _f : 'novadmin',
    },
};
exports.default = config;
