import { all } from "redux-saga/effects";
export const delay = ms => new Promise(res => setTimeout(res, ms));

export function* helloSaga() {
  console.warn("hello saga!");
}
export default function* rootSaga() {
  yield all([helloSaga()]);
}
