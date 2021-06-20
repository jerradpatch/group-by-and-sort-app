import {setInputsAsFixtures} from "./common";
import {expect} from "chai";
import fse from "fs-extra";
import {outputFilePath} from "../../src/output";
import {filePathToString} from "../../src/input";
import {expectedFilePath} from "./consts";
import {main} from "../../src";


describe('index', ()=>{

  after(async ()=>{
    //clean up test file directory
    await fse.remove(outputFilePath);
  })

  it('main, the main application should take files containing users, group and sort them, and then output the' +
    'users in to the expected order', async () => {
    setInputsAsFixtures();
    await main();
    expect(await fse.pathExists(outputFilePath)).to.be.true;

    //previously tested function to work as expected;
    const actualContents = await filePathToString(outputFilePath);
    //previously tested function to work as expected;
    const expectedContents = await filePathToString(expectedFilePath);

    expect(actualContents).to.eq(expectedContents);
  })
})