import {getUsersFromInput} from "./input";
import {orderUsersAsExpected} from "./transform";
import {User} from "./models/User";
import {userArrayOfArraysToFileOutput} from "./output";


/**
 * The main application itself. It runs by
 * 1) getting / parsing / transforming the input from file parameters into User models
 * 2) ordering and grouping, this reorders the user models into the expected order for each output group
 * 3) writes the output to the file
 * @return Promise<void>
 */
export async function main() {
  //get the input models
  const users: User[] = await getUsersFromInput();
  //transform/sort the models
  const groups: User[][] =  orderUsersAsExpected(users);
  //output the models in expected format
  await userArrayOfArraysToFileOutput(groups)
}
