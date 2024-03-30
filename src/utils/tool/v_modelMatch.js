import { isString } from "./typeJudge.js";

function v_modelMatch(exp, data, value) {
  if(isString(exp)) {
    eval(`${exp} = value`)
  }
}

export { v_modelMatch }