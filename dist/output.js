"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userToString = exports.userArrayToString = exports.userArrayOfArraysToExpectedString = exports.writeStringToFile = exports.userArrayOfArraysToFileOutput = exports.outputFilePath = exports.expectedOutputOrder = void 0;
var fs_1 = __importDefault(require("fs"));
/**
 * @module output - logic used to output a user[][] to a file as expected
 */
/**
 * The expected ordering of the keys for the User model when writing the model to a file
 */
exports.expectedOutputOrder = [
    "LastName",
    "FirstName",
    "Gender",
    "DateOfBirth",
    "FavoriteColor"
];
/** the output path that is written to by the application*/
exports.outputFilePath = './actual_output.txt';
/**
 * The only function that is to be used outside of testing. When creating npm modules, this is enforced
 * by re-exporting only specific functions which are relevant to the user of the package.
 *
 * This take a User[][] and writes it to an output file in the expected format.
 * @param usersArr - the Output groups to write to the file
 * @param filePath - the file path to be written to, defaults to the common path used
 */
function userArrayOfArraysToFileOutput(usersArr, filePath) {
    if (filePath === void 0) { filePath = exports.outputFilePath; }
    return __awaiter(this, void 0, void 0, function () {
        var usersString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    usersString = userArrayOfArraysToExpectedString(usersArr);
                    return [4 /*yield*/, writeStringToFile(usersString, filePath)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.userArrayOfArraysToFileOutput = userArrayOfArraysToFileOutput;
/**
 * Write a single string to a file, over-writes any existing file with the same path.
 * @param stringToWrite - string to write to file
 * @param filePath - file path to write to.
 * @return Promise<void>
 */
function writeStringToFile(stringToWrite, filePath) {
    return new Promise(function (c, e) {
        fs_1.default.writeFile(filePath, stringToWrite, function (err) {
            err ? e(err) : c();
        });
    });
}
exports.writeStringToFile = writeStringToFile;
/**
 * returns a User[][] in the expected string format that would be then written to a file.
 * @param usersArr - the user[][]
 */
function userArrayOfArraysToExpectedString(usersArr) {
    return usersArr.reduce(function (accStr, users, index) {
        return accStr + ("Output " + (index + 1) + ":\n") +
            userArrayToString(users) + '\n'
            + (index !== usersArr.length - 1 ? '\n' : '');
    }, '');
}
exports.userArrayOfArraysToExpectedString = userArrayOfArraysToExpectedString;
/**
 * Takes a single user model and converts it into a string
 * @param users - the user array to turn into a string
 */
function userArrayToString(users) {
    return users
        .map(userToString)
        .join('\n');
}
exports.userArrayToString = userArrayToString;
/**
 * Turns a single user model into a space delimited string
 * @param user - the user model to convert
 */
function userToString(user) {
    return exports.expectedOutputOrder.map(function (expectedKey) {
        var value = user[expectedKey];
        return value instanceof Date ?
            (value.getMonth() + 1) + "/" + value.getDate() + "/" + value.getFullYear() :
            value.toString();
    }).join(' ');
}
exports.userToString = userToString;
