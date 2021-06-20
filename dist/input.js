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
exports.parseInputFileToObjects = exports.determineFileRecordType = exports.filePathToString = exports.getPathsFromArgs = exports.getUsersFromInput = exports.mappedProperties = void 0;
var fs_1 = __importDefault(require("fs"));
var User_1 = require("./models/User");
var chai_1 = require("chai");
/**
 * @module input - logic used to get users from file sources and convert them into User models
 */
/**
 * the given property orderings for all possible file types
 */
exports.mappedProperties = {
    pipe: ['LastName', 'FirstName', 'MiddleInitial', 'Gender', 'FavoriteColor', 'DateOfBirth'],
    comma: ['LastName', 'FirstName', 'Gender', 'FavoriteColor', 'DateOfBirth'],
    space: ['LastName', 'FirstName', 'MiddleInitial', 'Gender', 'DateOfBirth', 'FavoriteColor']
};
/**
 * This is a application specific function and is the only one meant to be used outside of testing.
 * It works by
 * 1) getting the paths from the parameters
 * 2) taking each path and
 *  a) getting the string from the contents of the file
 *  b) getting order of the keys should be parsed in from the file type
 *  c) using results from both a and b to parse the file string into user models
 *  d) doing light validation on each user model
 * @return Promise<User[]>
 */
function getUsersFromInput() {
    return __awaiter(this, void 0, void 0, function () {
        var paths, usersOfUsers;
        var _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    paths = getPathsFromArgs();
                    return [4 /*yield*/, Promise.all(paths.map(function (path) { return __awaiter(_this, void 0, void 0, function () {
                            var fileString, mappedProps, users;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, filePathToString(path)];
                                    case 1:
                                        fileString = _a.sent();
                                        mappedProps = determineFileRecordType(fileString);
                                        users = parseInputFileToObjects(mappedProps, fileString);
                                        users.forEach(function (user) {
                                            validateUser(user);
                                        });
                                        return [2 /*return*/, users];
                                }
                            });
                        }); }))];
                case 1:
                    usersOfUsers = _b.sent();
                    return [2 /*return*/, (_a = []).concat.apply(_a, usersOfUsers)];
            }
        });
    });
}
exports.getUsersFromInput = getUsersFromInput;
/** get the file paths from the arguments given at the command line */
function getPathsFromArgs() {
    var _a;
    return (_a = []).concat.apply(_a, (process.argv || [])
        .map(function (arg) {
        if (arg.includes('paths='))
            return arg.split(/(?:paths=|,)+/)
                .filter(function (i) { return !!i; });
    })
        .filter(function (i) { return !!i; }));
}
exports.getPathsFromArgs = getPathsFromArgs;
/** gets the contents of a file from the given path and turns it into a string.
 * Note: this assumes small files sizes as the application would become much more complex
 * when considering file piping for large files
 */
function filePathToString(path) {
    return new Promise(function (c, e) {
        fs_1.default.readFile(path, { encoding: 'utf8' }, function (err, data) {
            err ? e(err) : c(data);
        });
    });
}
exports.filePathToString = filePathToString;
/** looks at the contents of the file to determine what keys would be used to map the the values
 * when the file is being parse. It looks for comma and pipe characters and default to space delimiters.
 * Note: this works on the assumption that each file wont have delimiter characters of another file
 * like "greg, | thomas"
 * @param fileString - string from file contents used to determine mapped properties
 */
function determineFileRecordType(fileString) {
    //no delimiters in any of the properties
    // so it safe to use the delimiter as the selector of the property order array
    if (fileString.indexOf(',') !== -1) {
        return exports.mappedProperties.comma;
    }
    else if (fileString.indexOf('|') !== -1) {
        return exports.mappedProperties.pipe;
    }
    else {
        return exports.mappedProperties.space;
    }
}
exports.determineFileRecordType = determineFileRecordType;
/** takes a given delimited string and an array of mapping properties to parse out the user data
 * @param propertiesToMapTo - array of properties that is mapped to parsed values
 * @param inputStr - the string that is parsed for its values
 */
function parseInputFileToObjects(propertiesToMapTo, inputStr) {
    return inputStr.split(/(?:\r\n|\n)/)
        .map(function (strLine) {
        var splitLinePropValues = strLine.split(/ *[,| ] */);
        return splitLinePropValues
            .reduce(function (obj, propValue, index) {
            var key = propertiesToMapTo[index];
            obj[key] = propValue;
            return obj;
        }, {});
    })
        .map(function (rawObj) {
        return new User_1.User(rawObj);
    });
}
exports.parseInputFileToObjects = parseInputFileToObjects;
//TODO test incorrect inputs on main to see exception is thrown an logged
/**
 * Light validation on the user data parsed, will throw and print exceptions
 * Note: I would usually do validation on the model using
 * npm "class-validator" but was asked not to use anything except testing libraries
 * @param user - a user model
 */
//note: I would usually do validation on the model using
// npm "class-validator" but was asked not to use anything except
// testing libraries
function validateUser(user) {
    //must always exist
    chai_1.expect(user.FavoriteColor).to.be.a('string').with.length.greaterThan(0);
    //must always exist
    chai_1.expect(user.FirstName).to.be.a('string').with.length.greaterThan(0);
    //must always exist
    chai_1.expect(user.LastName).to.be.a('string').with.length.greaterThan(0);
    //must always exist
    chai_1.expect(user.Gender).to.be.a('string').with.length.greaterThan(0);
    //optional
    if (user.MiddleInitial)
        chai_1.expect(user.MiddleInitial).to.be.a('string').with.length.greaterThan(0);
    //must always exist
    chai_1.expect(user.DateOfBirth).to.be.a('date');
}
