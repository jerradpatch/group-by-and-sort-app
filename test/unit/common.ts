import {fixtureInputs} from "./consts";


export function setInputsAsFixtures(){
  const [pComma, pPipe, pSpace] = fixtureInputs;
  process.argv = [`paths=${pComma},${pPipe},${pSpace}`]
}