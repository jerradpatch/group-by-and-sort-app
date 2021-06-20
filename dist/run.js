"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
/**
 * @module a file used to run and error catch for the app
 */
/** This runs the application and sets up error handling */
function run() {
    index_1.main().catch(function (e) {
        console.error('main application error', e);
    });
}
run();
