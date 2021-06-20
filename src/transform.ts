import {User} from "./models/User";

/**
 * @module transformation - logic used to transform users into expected output
 */


/** enum used to to provide sorting options */
export enum SortDirection {
  acending, decending
}

/** common sorting options interface used by functions to decide the
 * sort by ket and sort direction */
export interface SortBy {
  key: string,
  sortDirection: SortDirection
}

/**
 * an type that is used to define the data structure when user models are grouped by a key
 */
export type UserGroup = {
  [K: string]: User[];
};
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
export function orderUsersAsExpected(users: User[]): User[][] {
  const sort1 = copyUserArray(users);
  const sort2 = copyUserArray(users);
  const sort3 = copyUserArray(users);

  const sort1Group: UserGroup = groupByAndSort<User>(
    sort1,
    'Gender', {
      outerSortOptions: {key: 'Gender', sortDirection: SortDirection.acending},
      innerSortOptions: {key: 'LastName', sortDirection: SortDirection.acending}
    });

  const sort2Group = groupByAndSort<User>(
    sort2,
    'DateOfBirth', {
      outerSortOptions: {key: 'DateOfBirth', sortDirection: SortDirection.acending},
      innerSortOptions: {key: 'LastName', sortDirection: SortDirection.acending}
    });

  const sort3Group = groupByAndSort<User>(
    sort3,
    'LastName', {
      outerSortOptions: {key: 'LastName', sortDirection: SortDirection.decending},
    });

  return [
    groupsToArray<User>(sort1Group),
    groupsToArray<User>(sort2Group),
    groupsToArray<User>(sort3Group)
  ];
}

/** copies the user array to allow sorting and manipulations to not effect any other groups */
export function copyUserArray(users: User[]): User[]{
  return users.map(user=>Object.assign({}, user));
}


/****
 *
 * BELOW ARE GENERIC SORT AND GROUPING FUNCTIONS THAT CAN BE USED FOR ANY FLOW
 */

/**
 * Takes and object that represents users grouped by a key and turns it into an array.
 * For example {Female: user[], Male: user[]} => user[]
 * @param arrayToGroup - group to reduce to array
 */
export function groupsToArray<T>(arrayToGroup: {[key: string]: T[]}): T[] {
  return [].concat(...Object.values<any>(arrayToGroup as any));
}

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
export function groupByAndSort<T>(
  arrayToGroup: T[],
  groupByKey: string,
  sortOptions: {outerSortOptions?: SortBy, innerSortOptions?: SortBy}): {[K: string]: T[]} {

  if(sortOptions.outerSortOptions)
    sortArrayBy(arrayToGroup, sortOptions.outerSortOptions);

  const groupedArray = groupArrayBy(arrayToGroup, groupByKey);

  if(sortOptions.innerSortOptions)
    sortItemsInGroup(groupedArray, sortOptions.innerSortOptions);

  return groupedArray;
}

/**
 * The sorting function that is used to sort items in a group
 * @param groups - the grouped items
 * @param sortOptions - the sort options used to sort the items in the group: key and ordering.
 */
export function sortItemsInGroup<T>(groups: {[K: string]: T[]}, sortOptions: SortBy): void {
  Object.keys(groups).forEach((groupKey: string)=>{
    const group: any = groups[groupKey] as any;
    sortArrayBy<T>(group, sortOptions);
  })
}

/**
 * The function that is used for all sorting objects.
 * It takes a key and a direction on which to sort with.
 * It can be used on numbers, strings, and dates.
 * @param arrayIn - the array of objects in which to sort.
 * @param sortBy - the options used to preform the sort
 */
export function sortArrayBy<T>(arrayIn: T[], sortBy: SortBy): T[] {
  return arrayIn.sort((a: any, b: any) =>{
    const aKey = a[sortBy.key],
      bKey = b[sortBy.key];

    if(typeof aKey !== typeof bKey)
      throw new Error(`in order to sort an array both types must be equal: ${aKey}, ${bKey}`)

    if(typeof aKey === 'string')
      return sortBy.sortDirection === SortDirection.acending ?
        aKey.localeCompare(bKey) :
        bKey.localeCompare(aKey);
    else
      return sortBy.sortDirection === SortDirection.acending ?
        aKey - bKey :
        bKey - aKey;
  })
}

/**
 * Function used to group an array of objects into a an object with a value of user[].
 * Where the object's key represents that group
 * ex: [{a:"apple"}, {}a:'orange'}, {a:"apple"}] =>
 *  {"apple": [{a:"apple"}, {a:"apple"}], 'orange": [{a:"orange"}]}
 * @param items - items to be groups
 * @param key - key by which to group them
 */
export function groupArrayBy<T>(items: T[], key: string): {[K: string]: T[]} {
  return items.reduce(
    (result: any, item: any) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }),
    {},
  );
}