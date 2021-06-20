"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/** This is a user class and is used to give structure to the input */
var User = /** @class */ (function () {
    /**
     * takes an input object and optionally modifies the types/values
     *  of the input if they are of the incorrect type or value.
     * @param {Object} obj - the raw object that should be changed into a user model
     */
    function User(obj) {
        Object.assign(this, obj);
        if (typeof obj.DateOfBirth === 'string')
            this.DateOfBirth = new Date(obj.DateOfBirth);
        if (typeof obj.Gender === 'string' && obj.Gender.length === 1) {
            if (obj.Gender.match(/[Mm]/))
                this.Gender = 'Male';
            else
                this.Gender = 'Female';
        }
    }
    return User;
}());
exports.User = User;
