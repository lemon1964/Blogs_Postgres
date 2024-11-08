import { useContext, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Routes, Route, useMatch } from 'react-router-dom'
import { Container } from '@mui/material'
import { getUsers } from './services/users'
import { getBlogs } from './services/blogs'
import Notification from './components/Notification'
import Users from './components/Users'
import Home from './components/Home'
import User from './components/User'
import UserContext from './context/UserContext'
import BlogContext from './context/BlogContext'
import Blog from './components/Blog'
import Authors from './components/Authors'
import LoginContext from './context/LoginContext'
import { setToken } from './services/blogs'
import Menu from './components/Menu'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import styled from 'styled-components'

const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`

const Navigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`

const App = () => {
  const [users, Userdispatch] = useContext(UserContext)
  const [blogs, blogDispatch] = useContext(BlogContext)
  const [loggedUser, Logindispatch] = useContext(LoginContext)
  const [disable, setDisable] = useState(false);


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      if (user.token) {
        try {
          setToken(user.token)
          Logindispatch({ type: 'SET_USER', payload: user })
        } catch (error) {
          console.error('Token is invalid:', error)
          window.localStorage.removeItem('loggedBlogappUser')
          Logindispatch({ type: 'LOGOUT' })
        }
      }
    }
  }, [Logindispatch])

  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  })

  useEffect(() => {
    if (usersData) {
      Userdispatch({ type: 'SET_USERS', payload: usersData })
    }
  }, [usersData, Userdispatch])

  const {
    data: blogsData,
    isLoading: isBlogsLoading,
    error: blogsError
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs
  })

  useEffect(() => {
    if (blogsData) {
      // blogsData.sort((a, b) => b.likes - a.likes)
      blogDispatch({ type: 'SET_BLOGS', payload: blogsData })
    }
  }, [blogsData, blogDispatch])

  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')

  const user_id =
    userMatch && users
      ? users.find((user) => user.id === Number(userMatch.params.id))
      : null

  const blog =
    blogMatch && blogs
      ? blogs.find((blog) => blog.id === Number(blogMatch.params.id))
      : null

  if (isUsersLoading || isBlogsLoading) {
    return <div>Loading...</div>
  }

  if (usersError) {
    return <div>Error loading users</div>
  }

  if (blogsError) {
    return <div>Error loading blogs</div>
  }

  return (
    <Page>
      <Container>
        <Notification />
        <Navigation>
          {loggedUser ? (
            <Menu user={loggedUser.name} setDisable={setDisable} />
          ) : (
            <Togglable buttonLabel="login">
              <LoginForm />
            </Togglable>
          )}
        </Navigation>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Home disable={disable}/>} />
          <Route path="/users" element={<Users loggedUser={loggedUser} />} />
          <Route path="/authors" element={<Authors />} />
          <Route
            path="/users/:id"
            element={<User loggedUser={loggedUser} user={user_id} />}
          />
          <Route
            path="/blogs/:id"
            element={<Blog loggedUser={loggedUser} blog={blog} />}
          />
        </Routes>
      </Container>
    </Page>
  )
}

export default App
