

//put it outside so no to clutter the test
export const expectedTestUsers: any = [
  //comma
  {LastName: 'Abercrombie', FirstName: 'Neil', Gender: 'Male', FavoriteColor: 'Tan', DateOfBirth: new Date('2/13/1943')},
  {LastName: 'Bishop', FirstName: 'Timothy', Gender: 'Male', FavoriteColor: 'Yellow', DateOfBirth: new Date('4/23/1967')},
  {LastName: 'Kelly', FirstName: 'Sue', Gender: 'Female', FavoriteColor: 'Pink', DateOfBirth: new Date('7/12/1959')},
  //pipe
  {LastName: 'Smith', FirstName: 'Steve', MiddleInitial: 'D', Gender: 'Male', FavoriteColor: 'Red', DateOfBirth: new Date('3-3-1985')},
  {LastName: 'Bonk', FirstName: 'Radek', MiddleInitial: 'S', Gender: 'Male', FavoriteColor: 'Green', DateOfBirth: new Date('6-3-1975')},
  {LastName: 'Bouillon', FirstName: 'Francis', MiddleInitial: 'G', Gender: 'Male', FavoriteColor: 'Blue', DateOfBirth: new Date('6-3-1975')},
  //space
  {LastName: 'Kournikova', FirstName: 'Anna', MiddleInitial: 'F', Gender: 'Female', DateOfBirth: new Date('6-3-1975'), FavoriteColor: 'Red'},
  {LastName: 'Hingis', FirstName: 'Martina', MiddleInitial: 'M', Gender: 'Female', DateOfBirth: new Date('4-2-1979'), FavoriteColor: 'Green'},
  {LastName: 'Seles', FirstName: 'Monica', MiddleInitial: 'H', Gender: 'Female', DateOfBirth: new Date('12-2-1973'), FavoriteColor: 'Black'},
];

export const expectedFilePath = './test/fixtures/expected_output.txt';

const baseInFP = './test/fixtures/input/';

export const fixtureInputs = [
  baseInFP+'comma.txt',
  baseInFP+'pipe.txt',
  baseInFP+'space.txt'
]