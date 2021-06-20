import {expect} from 'chai';
import {
  copyUserArray,
  groupArrayBy,
  groupByAndSort,
  groupsToArray, orderUsersAsExpected,
  sortArrayBy,
  SortDirection,
  sortItemsInGroup
} from "../../src/transform";
import {User} from "../../src/models/User";
import {filePathToString} from "../../src/input";
import {expectedFilePath, expectedTestUsers} from "./consts";


describe('transform.ts', ()=>{

  let testArray: any[];
  beforeEach(() => {
    testArray = getTestArray();
  });

  it('orderUsersAsExpected, it should output the users as expected', async ()=>{
    const expectedUsers = await parseExpectedOutputToUser()
    const actualUsers = orderUsersAsExpected(expectedTestUsers)
      //this is to remove the middle initial which isn't used in the expected output
      .map(users=>users.map((user: any)=>expectedOutputOrder.reduce((acc,ek)=>{
        acc[ek] = user[ek];
        return acc;
      }, {} as any)));

    expect(actualUsers).to.eql(expectedUsers);
  })

  it('copyUserArray, it should code the user array into a new array', () => {
    expect(testArray).to.eq(testArray);
    const newArray = copyUserArray(testArray as any as User[]);
    expect(testArray).to.not.eq(newArray);
  });

  describe('sortArrayBy', ()=> {
    describe('numbers, sorting numbers', ()=> {
      it('ascending, it should sort numbers in an ascending order', () => {
        const expectedArray = [{a: 1, b: 'a', c: "g"}, {a: 2, b: 'aa', c: "h"}, {a: 5, b: 'ab', c: "g"}];

        const actual = sortArrayBy<any>(testArray, {key: 'a', sortDirection: SortDirection.acending});
        expect(actual).to.eql(expectedArray)
      });

      it('descending, it should sort numbers in an descending order', () => {
        const expectedArray = [{a: 5, b: 'ab', c: "g"}, {a: 2, b: 'aa', c: "h"}, {a: 1, b: 'a', c: "g"}];

        const actual = sortArrayBy<any>(testArray, {key: 'a', sortDirection: SortDirection.decending});
        expect(actual).to.eql(expectedArray)
      });
    });

    describe('strings, sorting strings', ()=> {
      it('ascending, it should sort strings in an ascending order', () => {
        const expectedArray = [{a: 1, b: 'a', c: "g"}, {a: 2, b: 'aa', c: "h"}, {a: 5, b: 'ab', c: "g"}];

        const actual = sortArrayBy<any>(testArray, {key: 'b', sortDirection: SortDirection.acending});
        expect(actual).to.eql(expectedArray)
      });

      it('descending, it should sort strings in an descending order', () => {
        const expectedArray = [{a: 5, b: 'ab', c: "g"}, {a: 2, b: 'aa', c: "h"}, {a: 1, b: 'a', c: "g"}];

        const actual = sortArrayBy<any>(testArray, {key: 'b', sortDirection: SortDirection.decending});
        expect(actual).to.eql(expectedArray)
      });
    });
  });

  it('groupArrayBy, it should group the array by the given key', ()=>{
    const expected = {
      'g': [{a: 1, b: 'a', c: 'g'}, {a: 5, b: 'ab', c: 'g'}],
      'h': [{a: 2, b: 'aa', c: 'h'}]
    };
    const actual = groupArrayBy<any>(testArray, 'c');
    expect(actual).to.eql(expected);
  });

  describe('sortItemsInGroup', ()=> {
    it('ascending, it should sort the inner groups in ascending order', () => {
      const actual = {
        'g': [{a: 5, b: 'ab', c: 'g'}, {a: 1, b: 'a', c: 'g'}],
        'h': [{a: 2, b: 'aa', c: 'h'}]
      };
      const expected = {
        'g': [{a: 1, b: 'a', c: 'g'}, {a: 5, b: 'ab', c: 'g'}],
        'h': [{a: 2, b: 'aa', c: 'h'}]
      };
      sortItemsInGroup(actual, {key: 'a', sortDirection: SortDirection.acending});
      expect(actual).to.eql(expected);
    });
    it('descending, it should sort the inner groups in descending order', () => {
      const actual = {
        'g': [{a: 5, b: 'ab', c: 'g'}, {a: 1, b: 'a', c: 'g'}],
        'h': [{a: 2, b: 'aa', c: 'h'}]
      };
      const expected = {
        'g': [{a: 5, b: 'ab', c: 'g'}, {a: 1, b: 'a', c: 'g'}],
        'h': [{a: 2, b: 'aa', c: 'h'}]
      };
      sortItemsInGroup(actual, {key: 'a', sortDirection: SortDirection.decending});
      expect(actual).to.eql(expected);
    });
  });

  describe('groupByAndSort', ()=>{
    describe('outer sort', ()=> {
      it('ascending, it should sort the outer group in ascending order', () => {
        const expected = {
          'g': [{a: 1, b: 'a', c: 'g'}, {a: 5, b: 'ab', c: 'g'}],
          'h': [{a: 2, b: 'aa', c: 'h'}]
        };
        const actual = groupByAndSort<any>(testArray,
          'c',
          {outerSortOptions: {key: 'c', sortDirection: SortDirection.acending}})
        expect(actual).to.eql(expected);
      });

      it('descending, it should sort the outer group in descending order', () => {
        const expected = {
          'h': [{a: 2, b: 'aa', c: 'h'}],
          'g': [{a: 1, b: 'a', c: 'g'}, {a: 5, b: 'ab', c: 'g'}],
        };
        const actual = groupByAndSort<any>(testArray,
          'c',
          {outerSortOptions: {key: 'c', sortDirection: SortDirection.acending}})
        expect(actual).to.eql(expected);
      })
    });

    describe('inner sort', ()=> {
      it('ascending, it should sort the inner group in ascending order', () => {
        const expected = {
          'g': [{a: 1, b: 'a', c: 'g'}, {a: 5, b: 'ab', c: 'g'}],
          'h': [{a: 2, b: 'aa', c: 'h'}],
        };
        const actual = groupByAndSort<any>(testArray,
          'c',
          {innerSortOptions: {key: 'a', sortDirection: SortDirection.acending}})
        expect(actual).to.eql(expected);
      });

      it('descending, it should sort the outer group in descending order', () => {
        const expected = {
          'g': [{a: 5, b: 'ab', c: 'g'}, {a: 1, b: 'a', c: 'g'}],
          'h': [{a: 2, b: 'aa', c: 'h'}],
        };
        const actual = groupByAndSort<any>(testArray,
          'c',
          {innerSortOptions: {key: 'a', sortDirection: SortDirection.decending}})
        expect(actual).to.eql(expected);
      })
    });
  })

  it('groupsToArray, it should turn a groups into an array', ()=>{
    const testGroups = {
      'g': [{a: 1, b: 'a', c: 'g'}, {a: 5, b: 'ab', c: 'g'}],
      'h': [{a: 2, b: 'aa', c: 'h'}]
    };

    const actual = groupsToArray(testGroups);
    expect(actual).to.eql(testArray);
  })


  function getTestArray(){
    return [
      {a: 1, b: 'a', c: 'g'},
      {a: 5, b: 'ab', c: 'g'},
      {a: 2, b: 'aa', c:'h'}
    ];
  }
  const expectedOutputOrder: string[] = [
    "LastName",
    "FirstName",
    "Gender",
    "DateOfBirth",
    "FavoriteColor"
  ];
  async function parseExpectedOutputToUser(): Promise<any[]> {

    let str = await filePathToString(expectedFilePath);
    let userStrings = str.split('\n').filter(st=>
      st.indexOf('Output') === -1 && !!st);

    const users = userStrings.map((usrStr: string)=> {
      const values: string[] = usrStr.split(' ');

      return expectedOutputOrder.reduce((obj: any, expectedKey: string, index: number) => {
        if(expectedKey === 'DateOfBirth')
          obj[expectedKey] = new Date(values[index]);
        else
          obj[expectedKey] = values[index];
        return obj;
      }, {});
    });
    return [users.slice(0,9),
      users.slice(9,18),
      users.slice(18,27)]
  }
})