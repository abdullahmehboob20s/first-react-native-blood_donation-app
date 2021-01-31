import React from "react"
import {createStore,applyMiddleware} from "redux"
import {Provider } from "react-redux"
import thunk from "redux-thunk"
import AllReducers from "./redux/reducers/AllReducers"
import Navigator from "./Navigator"

let store = createStore(AllReducers,applyMiddleware(thunk))


let App = () => {
  return(
    <Provider store={store}>
      <Navigator />
    </Provider>
  )
}

export default App