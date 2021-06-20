import {
  determineFileRecordType,
  filePathToString,
  getPathsFromArgs, getUsersFromInput,
  mappedProperties,
  parseInputFileToObjects
} from "../../src/input";
import {expect} from 'chai';
import {expectedTestUsers, fixtureInputs} from "./consts";
import {setInputsAsFixtures} from "./common";

describe('input.ts', ()=>{

  const [pComma, pPipe, pSpace] = fixtureInputs;

  it('getPathsFromArgs, it should get the paths from the command line arguments', ()=>{
    setInputsAsFixtures();
    const actualPaths = getPathsFromArgs();
    expect(actualPaths).to.eql([pComma, pPipe, pSpace]);
  })

  //if it can read a single file it can read them all
  it('filePathToString, it should parse the file to an expected string', async ()=>{
    const expectedFileIn = "Abercrombie, Neil, Male, Tan, 2/13/1943\n" +
                           "Bishop, Timothy, Male, Yellow, 4/23/1967\n" +
                           "Kelly, Sue, Female, Pink, 7/12/1959";
    const fileString = await filePathToString(pComma);
    expect(fileString).to.eq(expectedFileIn);
  })

  describe('determineFileRecordType', ()=>{

    it('pipe delimited, it should determine correctly if a file is pipe delimited', async ()=>{
      let str = await filePathToString(pPipe);
      let actualRecord = determineFileRecordType(str);
      expect(mappedProperties.pipe).to.eql(actualRecord);
    })

    it('comma delimited, it should determine correctly if a file is comma delimited', async ()=>{
      let str = await filePathToString(pComma);
      let actualRecord = determineFileRecordType(str);
      expect(mappedProperties.comma).to.eql(actualRecord);
    })

    it('space delimited, it should determine correctly if a file is space delimited', async ()=>{
      let str = await filePathToString(pSpace);
      let actualRecord = determineFileRecordType(str);
      expect(mappedProperties.space).to.eql(actualRecord);
    })
  });

  describe('parseInputFileToObjects', ()=>{

    it('pipe, it should correctly parse piped files to objects', async () =>{
      //previously tested
      const str = await filePathToString(pPipe);
      //previously tested
      const record: string[] = determineFileRecordType(str);
      //specific to test
      const expectedObjects = testSplitter(str, / ?\| ?/, record);
      const actualObjects = parseInputFileToObjects(record, str);
      expect(actualObjects).to.eql(expectedObjects)
    });

    it('space, it should correctly parse spaced files to objects', async () =>{
      //previously tested
      const str = await filePathToString(pSpace);
      //previously tested
      const record: string[] = determineFileRecordType(str);
      //specific to test
      const expectedObjects = testSplitter(str, / +/, record);
      const actualObjects = parseInputFileToObjects(record, str);
      expect(actualObjects).to.eql(expectedObjects)
    })

    it('comma, it should correctly parse comma files to objects', async () =>{
      //previously tested
      const str = await filePathToString(pComma);
      //previously tested
      const record: string[] = determineFileRecordType(str);
      //specific to test
      const expectedObjects = testSplitter(str, / ?, ?/, record);
      const actualObjects = parseInputFileToObjects(record, str);
      expect(actualObjects).to.eql(expectedObjects)
    })

    function testSplitter(fileStr: string, regex: RegExp, record: string[]){
      return fileStr.split('\n').map(str=>
        str.split(regex).reduce((obj: any, value, index: number)=>{
          const key = record[index];
          if(key === 'DateOfBirth')
            obj[record[index]] = new Date(value);
          else if(key === 'Gender' && value === 'M')
              obj[record[index]] = 'Male';
          else if(key === 'Gender' && value === 'F')
              obj[record[index]] = 'Female';
          else
            obj[record[index]] = value;
          return obj;
        }, {}));

    }
  })

  it('getUsersFromInput, it should return the user objects from the file', async ()=>{

    setInputsAsFixtures();
    let actualUsers = await getUsersFromInput();
    expect(actualUsers).to.eql(expectedTestUsers);
  })

})