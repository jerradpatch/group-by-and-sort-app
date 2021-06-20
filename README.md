
See the docs page for the flashy version of this readme:
https://jerradpatch.github.io/group-by-and-sort-app

## User GroupBy and Sort Application
The following application is a sample application written to take a list of files from 
input parameters, convert them into user models, and then sort and group them in a 
predefined manner.

!!This application is not useful except for demo purposes.

### How it works?:

The input.ts file's purpose is to get the file inputs, read and parse them, transform them,
and then preform validation on them resulting in an array of User models

The transform.ts file is meant to take a user model list, given from inout.ts, 
group and sort it into an expected output.

The output.ts file is meant to take user groups and print them into a file.

### Required environment:
the following version of node and npm were used to compile and write the code
```json
{
  "engines": {
     "node": ">=14.15.0",
     "npm": ">=6.14.8"
  }
}
```

### How to run
1) install node:
if on windows install the exe for node above
if on linux, I recommend using NVM,
https://github.com/nvm-sh/nvm

2) run the application
    the dist folder is included in the case there is compiling issues.
    so running 
    ```
   npm run app
   ```
    should be enough.
    
    The npm command gets the files from "./test/fixtures/input" and puts the
    results in the "./actual_output.txt" file.
    
    Your own input files can be used by running
    ```bash
    node ./dist/run.js paths=./test/fixtures/input/comma.txt,./test/fixtures/input/pipe.txt,./test/fixtures/input/space.txt,
    ```
    node ./dist/run.js paths=\<path1>,\<path2>,\<path3>

3) optional: if you would like to build the app before running
run 
```bash 
npm run build
```

I spent a while writing unit test and docs, so I hope it all goes well, 
but if not please feel free to let me know and I will fix it.


