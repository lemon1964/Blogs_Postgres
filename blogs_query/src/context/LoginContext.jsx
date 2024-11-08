import React, { createContext, useReducer } from 'react'

const LoginContext = createContext()

const loginReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: null }
    default:
      return state
  }
}

export const LoginContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loginReducer, { user: null })
  return (
    <LoginContext.Provider value={[state.user, dispatch]}>
      {children}
    </LoginContext.Provider>
  )
}

export default LoginContext
