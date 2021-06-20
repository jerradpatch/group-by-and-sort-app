

/** This is a user class and is used to give structure to the input */
export class User {
  FirstName: string;
  LastName: string;
  MiddleInitial: string;
  Gender: string;
  FavoriteColor: string;
  DateOfBirth: Date;

  /**
   * takes an input object and optionally modifies the types/values
   *  of the input if they are of the incorrect type or value.
   * @param {Object} obj - the raw object that should be changed into a user model
   */
  constructor(obj: Partial<Omit<User, 'DateOfBirth'> & {DateOfBirth: Date | string}>) {
    Object.assign(this, obj);
    if(typeof obj.DateOfBirth === 'string')
      this.DateOfBirth = new Date(obj.DateOfBirth);

    if(typeof obj.Gender === 'string' && obj.Gender.length === 1){
      if(obj.Gender.match(/[Mm]/))
        this.Gender = 'Male';
      else
        this.Gender = 'Female';
    }
  }
}