import fs from 'fs';
import {User} from "./models/User";


/**
 * @module output - logic used to output a user[][] to a file as expected
 */

/**
 * The expected ordering of the keys for the User model when writing the model to a file
 */
export const expectedOutputOrder: string[] = [
  "LastName",
  "FirstName",
  "Gender",
  "DateOfBirth",
  "FavoriteColor"
];

/** the output path that is written to by the application*/
export const outputFilePath = './actual_output.txt'

/**
 * The only function that is to be used outside of testing. When creating npm modules, this is enforced
 * by re-exporting only specific functions which are relevant to the user of the package.
 *
 * This take a User[][] and writes it to an output file in the expected format.
 * @param usersArr - the Output groups to write to the file
 * @param filePath - the file path to be written to, defaults to the common path used
 */
export async function userArrayOfArraysToFileOutput(usersArr: User[][], filePath: string = outputFilePath): Promise<void> {
  const usersString = userArrayOfArraysToExpectedString(usersArr);
  await writeStringToFile(usersString, filePath);
}

/**
 * Write a single string to a file, over-writes any existing file with the same path.
 * @param stringToWrite - string to write to file
 * @param filePath - file path to write to.
 * @return Promise<void>
 */
export function writeStringToFile(stringToWrite: string, filePath: string): Promise<void> {
  return new Promise<void>((c,e)=>{
    fs.writeFile(filePath, stringToWrite, function(err) {
      err ? e(err) : c();
    });
  });
}

/**
 * returns a User[][] in the expected string format that would be then written to a file.
 * @param usersArr - the user[][]
 */
export function userArrayOfArraysToExpectedString(usersArr: User[][]): string {
  return usersArr.reduce((accStr: string, users: User[], index: number)=>{
    return accStr + `Output ${index + 1}:\n`+
      userArrayToString(users) + '\n'
      + (index !== usersArr.length - 1 ? '\n' : '')
  }, '');
}

/**
 * Takes a single user model and converts it into a string
 * @param users - the user array to turn into a string
 */
export function userArrayToString(users: User[]): string {
  return users
    .map(userToString)
    .join('\n');
}

/**
 * Turns a single user model into a space delimited string
 * @param user - the user model to convert
 */
export function userToString(user: User): string {
  return expectedOutputOrder.map((expectedKey: string)=>{
    let value = user[expectedKey as keyof User];
    return value instanceof Date?
      (value.getMonth() + 1) + "/" + value.getDate() + "/" + value.getFullYear():
      value.toString();
  }).join(' ');
}
