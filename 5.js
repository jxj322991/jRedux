/*
 * @LastEditTime: 2020-07-07 11:33:45
 * @LastEditors: jinxiaojian
 */ 
/*
 * @LastEditTime: 2020-07-06 20:08:50
 * @LastEditors: jinxiaojian
 */

function counterReducer (state = {
  count: 0
}, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1
      }
    default:
      return state;
  }
}

function InfoReducer (state = {
  name: '',
  description: ''
}, action) {
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.name
      }
    case 'SET_DESCRIPTION':
      return {
        ...state,
        description: action.description
      }
    default:
      return state;
  }
}

function combineReducers (reducers) {
  /* reducerKeys = ['counter', 'info']*/
  const reducerKeys = Object.keys(reducers)
  /*返回合并后的新的reducer函数*/
  return function combination (state = {}, action) {
    /*生成的新的state*/
    const nextState = {}
    /*遍历执行所有的reducers，整合成为一个新的state*/
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i]
      const stateCell = state[key]
      /*执行 分 reducer，获得新的state*/
      const newStateCell = reducers[key](stateCell, action)
      nextState[key] = newStateCell
    }
    return nextState;
  }
}


const reducer = combineReducers({
  counter: counterReducer,
  info: InfoReducer
});


const createStore = function (reducer) {
  let state
  let listeners = [];
  /*订阅*/
  function subscribe (listener) {
    listeners.push(listener);
  }
  function dispatch (action) {
    state = reducer(state, action);
    /*当 state 改变的时候，我们要去通知所有的订阅者*/
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }
  function getState () {
    return state
  }
  dispatch({ type: Symbol() })
  return {
    subscribe,
    dispatch,
    getState
  }
}

let store = createStore(reducer);

// 记录日志
/*重写了store.dispatch*/
const next = store.dispatch;
store.dispatch = (action) => {
  console.log('this state', store.getState(),'action', action);
  next(action);
  console.log('next state', store.getState());
}
store.dispatch({
  type: 'INCREMENT'
});