import { createContext, useReducer } from 'react'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USERS':
      return action.payload
    default:
      return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [users, userDispatch] = useReducer(userReducer, [])

  return (
    <UserContext.Provider value={[users, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext
