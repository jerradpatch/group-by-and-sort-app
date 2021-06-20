import {main} from "./index";

/**
 * @module a file used to run and error catch for the app
 */

/** This runs the application and sets up error handling */
function run(){
  main().catch(e=>{
    console.error('main application error', e)
  })
}
run();