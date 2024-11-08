import { createContext, useReducer } from 'react'

const blogReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BLOGS':
      return action.payload
    default:
      return state
  }
}

const BlogContext = createContext()

export const BlogContextProvider = ({ children }) => {
  const [blogs, blogDispatch] = useReducer(blogReducer, [])

  return (
    <BlogContext.Provider value={[blogs, blogDispatch]}>
      {children}
    </BlogContext.Provider>
  )
}

export default BlogContext
