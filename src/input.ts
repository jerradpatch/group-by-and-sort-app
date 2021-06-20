
import fs from 'fs';
import {User} from "./models/User";
import {expect} from 'chai';

/**
 * @module input - logic used to get users from file sources and convert them into User models
 */

/**
 * the given property orderings for all possible file types
 */
export const mappedProperties = {
  pipe: ['LastName', 'FirstName', 'MiddleInitial', 'Gender', 'FavoriteColor', 'DateOfBirth'],
  comma: ['LastName', 'FirstName', 'Gender', 'FavoriteColor', 'DateOfBirth'],
  space: ['LastName', 'FirstName', 'MiddleInitial', 'Gender', 'DateOfBirth', 'FavoriteColor']
}

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
export async function getUsersFromInput(): Promise<User[]>{
  const paths = getPathsFromArgs();
  const usersOfUsers = await Promise.all(paths.map(async path=>{
    const fileString = await filePathToString(path);
    const mappedProps = determineFileRecordType(fileString);
    const users = parseInputFileToObjects(mappedProps, fileString);
    users.forEach(user=>{
      validateUser(user);
    });
    return users;
  }))

  return ([] as User[]).concat(...usersOfUsers);
}

/** get the file paths from the arguments given at the command line */
export function getPathsFromArgs(): string[] {
  return ([] as string[]).concat(...(process.argv || [])
    .map((arg)=>{
      if(arg.includes('paths='))
        return arg.split(/(?:paths=|,)+/)
          .filter(i=> !!i)
    })
    .filter(i=> !!i) as any as string[]);
}

/** gets the contents of a file from the given path and turns it into a string.
 * Note: this assumes small files sizes as the application would become much more complex
 * when considering file piping for large files
 */
export function filePathToString(path: string): Promise<string> {
  return new Promise((c, e)=>{
    fs.readFile(path, { encoding: 'utf8' }, function (err, data ) {
      err ? e(err) : c(data)
    });
  });
}

/** looks at the contents of the file to determine what keys would be used to map the the values
 * when the file is being parse. It looks for comma and pipe characters and default to space delimiters.
 * Note: this works on the assumption that each file wont have delimiter characters of another file
 * like "greg, | thomas"
 * @param fileString - string from file contents used to determine mapped properties
 */
export function determineFileRecordType(fileString: string): string[] {
  //no delimiters in any of the properties
  // so it safe to use the delimiter as the selector of the property order array
  if(fileString.indexOf(',') !== -1) {
    return mappedProperties.comma;
  } else if(fileString.indexOf('|') !== -1) {
    return mappedProperties.pipe;
  } else {
    return mappedProperties.space;
  }
}

/** takes a given delimited string and an array of mapping properties to parse out the user data
 * @param propertiesToMapTo - array of properties that is mapped to parsed values
 * @param inputStr - the string that is parsed for its values
 */
export function parseInputFileToObjects(propertiesToMapTo: string[], inputStr: string): User[] {
  return inputStr.split(/(?:\r\n|\n)/)
    .map((strLine: string)=>{
      let splitLinePropValues = strLine.split(/ *[,| ] */)
      return splitLinePropValues
        .reduce((obj: {[key: string]: string}, propValue: string, index: number)=>{
          const key = propertiesToMapTo[index];
          obj[key] = propValue;
          return obj;
        }, {});
    })
    .map((rawObj)=>{
      return new User(rawObj);
    })
}

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
function validateUser(user: User): void {
  //must always exist
  expect(user.FavoriteColor).to.be.a('string').with.length.greaterThan(0);
  //must always exist
  expect(user.FirstName).to.be.a('string').with.length.greaterThan(0);
  //must always exist
  expect(user.LastName).to.be.a('string').with.length.greaterThan(0);
  //must always exist
  expect(user.Gender).to.be.a('string').with.length.greaterThan(0);
  //optional
  if(user.MiddleInitial)
    expect(user.MiddleInitial).to.be.a('string').with.length.greaterThan(0);
  //must always exist
  expect(user.DateOfBirth).to.be.a('date');
}