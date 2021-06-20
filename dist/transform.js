"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupArrayBy = exports.sortArrayBy = exports.sortItemsInGroup = exports.groupByAndSort = exports.groupsToArray = exports.copyUserArray = exports.orderUsersAsExpected = exports.SortDirection = void 0;
/**
 * @module transformation - logic used to transform users into expected output
 */
/** enum used to to provide sorting options */
var SortDirection;
(function (SortDirection) {
    SortDirection[SortDirection["acending"] = 0] = "acending";
    SortDirection[SortDirection["decending"] = 1] = "decending";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
/****
 *
 * BELOW ARE THE FUNCTIONS THAT ARE SPECIFIC TO THE FLOW FOR THE EXPECTED OUTPUT
 */
/**
 * the only function that would be exported if this were a package.
 * This function takes an array of user models and outputs them into the expected order.
 * It works by:
 * 1) makes a copy of the users for each of the 3 orderings
 * 2) preforms a sort, group-by, and inner group sort as given in the instructions
 * @param users - users that are used to create the group and sorts
 * @return User[][] - a user array of arrays where each group is in its own individual array.
 */
function orderUsersAsExpected(users) {
    var sort1 = copyUserArray(users);
    var sort2 = copyUserArray(users);
    var sort3 = copyUserArray(users);
    var sort1Group = groupByAndSort(sort1, 'Gender', {
        outerSortOptions: { key: 'Gender', sortDirection: SortDirection.acending },
        innerSortOptions: { key: 'LastName', sortDirection: SortDirection.acending }
    });
    var sort2Group = groupByAndSort(sort2, 'DateOfBirth', {
        outerSortOptions: { key: 'DateOfBirth', sortDirection: SortDirection.acending },
        innerSortOptions: { key: 'LastName', sortDirection: SortDirection.acending }
    });
    var sort3Group = groupByAndSort(sort3, 'LastName', {
        outerSortOptions: { key: 'LastName', sortDirection: SortDirection.decending },
    });
    return [
        groupsToArray(sort1Group),
        groupsToArray(sort2Group),
        groupsToArray(sort3Group)
    ];
}
exports.orderUsersAsExpected = orderUsersAsExpected;
/** copies the user array to allow sorting and manipulations to not effect any other groups */
function copyUserArray(users) {
    return users.map(function (user) { return Object.assign({}, user); });
}
exports.copyUserArray = copyUserArray;
/****
 *
 * BELOW ARE GENERIC SORT AND GROUPING FUNCTIONS THAT CAN BE USED FOR ANY FLOW
 */
/**
 * Takes and object that represents users grouped by a key and turns it into an array.
 * For example {Female: user[], Male: user[]} => user[]
 * @param arrayToGroup - group to reduce to array
 */
function groupsToArray(arrayToGroup) {
    return [].concat.apply([], Object.values(arrayToGroup));
}
exports.groupsToArray = groupsToArray;
/**
 * This function sorts a given array, then groups it by a key, then sorts the inner group.
 * Each sort is optional and if not given it will leave the array in the given order.
 * outerSortOptions - is the sorting options preformed before the array is grouped.
 * innerSortOptions - is the sort that is preformed after the array is grouped
 *
 * @param arrayToGroup - the user model array to be grouped.
 * @param groupByKey - is the key used to group the array by a specific key
 * @param sortOptions - {outerSortOptions?: SortBy, innerSortOptions?: SortBy} - The sorting options
 */
function groupByAndSort(arrayToGroup, groupByKey, sortOptions) {
    if (sortOptions.outerSortOptions)
        sortArrayBy(arrayToGroup, sortOptions.outerSortOptions);
    var groupedArray = groupArrayBy(arrayToGroup, groupByKey);
    if (sortOptions.innerSortOptions)
        sortItemsInGroup(groupedArray, sortOptions.innerSortOptions);
    return groupedArray;
}
exports.groupByAndSort = groupByAndSort;
/**
 * The sorting function that is used to sort items in a group
 * @param groups - the grouped items
 * @param sortOptions - the sort options used to sort the items in the group: key and ordering.
 */
function sortItemsInGroup(groups, sortOptions) {
    Object.keys(groups).forEach(function (groupKey) {
        var group = groups[groupKey];
        sortArrayBy(group, sortOptions);
    });
}
exports.sortItemsInGroup = sortItemsInGroup;
/**
 * The function that is used for all sorting objects.
 * It takes a key and a direction on which to sort with.
 * It can be used on numbers, strings, and dates.
 * @param arrayIn - the array of objects in which to sort.
 * @param sortBy - the options used to preform the sort
 */
function sortArrayBy(arrayIn, sortBy) {
    return arrayIn.sort(function (a, b) {
        var aKey = a[sortBy.key], bKey = b[sortBy.key];
        if (typeof aKey !== typeof bKey)
            throw new Error("in order to sort an array both types must be equal: " + aKey + ", " + bKey);
        if (typeof aKey === 'string')
            return sortBy.sortDirection === SortDirection.acending ?
                aKey.localeCompare(bKey) :
                bKey.localeCompare(aKey);
        else
            return sortBy.sortDirection === SortDirection.acending ?
                aKey - bKey :
                bKey - aKey;
    });
}
exports.sortArrayBy = sortArrayBy;
/**
 * Function used to group an array of objects into a an object with a value of user[].
 * Where the object's key represents that group
 * ex: [{a:"apple"}, {}a:'orange'}, {a:"apple"}] =>
 *  {"apple": [{a:"apple"}, {a:"apple"}], 'orange": [{a:"orange"}]}
 * @param items - items to be groups
 * @param key - key by which to group them
 */
function groupArrayBy(items, key) {
    return items.reduce(function (result, item) {
        var _a;
        return (__assign(__assign({}, result), (_a = {}, _a[item[key]] = __spreadArray(__spreadArray([], (result[item[key]] || [])), [
            item,
        ]), _a)));
    }, {});
}
exports.groupArrayBy = groupArrayBy;
