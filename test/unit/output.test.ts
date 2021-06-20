import {expect} from 'chai';
import {
  userArrayOfArraysToExpectedString,
  userArrayOfArraysToFileOutput,
  userArrayToString,
  userToString,
  writeStringToFile
} from "../../src/output";
import {expectedTestUsers} from "./consts";
import fse from "fs-extra";
import {filePathToString} from "../../src/input";
import {User} from "../../src/models/User";

describe('output', ()=>{

  const testDir = "./testFiles";

  const userArrArr: User[][] = [
    expectedTestUsers.slice(0,3),
    expectedTestUsers.slice(0,3)
  ];

  before(async ()=>{
    //create the dir that any files made during testing would go into
    await fse.ensureDir(testDir);
  });

  after(async ()=>{
    //clean up test file directory
    await fse.remove(testDir)
  })

  it('userToString, it should transform a user model into a string of values', () =>{
    const userStr = userToString(expectedTestUsers[0]);
    expect(userStr).to.eq("Abercrombie Neil Male 2/13/1943 Tan")
  });

  it('userArrayToString, it should turn an array of users into an expected string', () => {
    const users = expectedTestUsers.slice(0,3);
    let usersStr = userArrayToString(users);
    expect(usersStr).to.eq(
      "Abercrombie Neil Male 2/13/1943 Tan\n" +
      "Bishop Timothy Male 4/23/1967 Yellow\n" +
      "Kelly Sue Female 7/12/1959 Pink")
  });

  it('userArrayOfArraysToExpectedString, it should take an array of arrays of users and turn it into a string', ()=>{
    const userArrArrStr = userArrayOfArraysToExpectedString(userArrArr);
    expect(userArrArrStr).to.eq(multiUserStr);
  });

  it('writeStringToFile, it should write the string to the file as expected', async ()=>{
    const testOutputPath = testDir+"/writeStringToFile";

    await writeStringToFile(multiUserStr, testOutputPath);
    expect(await fse.pathExists(testOutputPath)).to.be.true;

    //previously tested to work as expected
    const contents = await filePathToString(testOutputPath);
    expect(contents).to.eq(multiUserStr);
  });

  it('userArrayOfArraysToFileOutput, it should write a user[][] to a file as expected', async () => {
    const testOutputPath = testDir+"/userArrayOfArraysToFileOutput";

    await userArrayOfArraysToFileOutput(userArrArr, testOutputPath);
    expect(await fse.pathExists(testOutputPath)).to.be.true;
    //previously tested to work as expected;
    let expectedUserString = userArrayOfArraysToExpectedString(userArrArr);
    //previously tested to work as expected;
    const contents = await filePathToString(testOutputPath);
    expect(contents).to.eq(expectedUserString);
  });

  //put it here as to not clutter the important part of the test file
  const multiUserStr = "Output 1:\n"+
    "Abercrombie Neil Male 2/13/1943 Tan\n" +
    "Bishop Timothy Male 4/23/1967 Yellow\n" +
    "Kelly Sue Female 7/12/1959 Pink\n"+
    "\n"+
    "Output 2:\n"+
    "Abercrombie Neil Male 2/13/1943 Tan\n" +
    "Bishop Timothy Male 4/23/1967 Yellow\n" +
    "Kelly Sue Female 7/12/1959 Pink\n";

})