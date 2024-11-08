import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { TextField, Button } from '@mui/material'
import LoginContext from '../context/LoginContext'
import login from '../services/login'
import { useContext } from 'react'
import { setToken } from '../services/blogs'
import { useCreateNotification } from '../context/NotificationContext'

const LoginForm = () => {
  const [user, Logindispatch] = useContext(LoginContext)
  const createNotification = useCreateNotification()
  const navigate = useNavigate()

  useEffect(() => {
    createNotification(
      'Read and create blogs, like for the best ones. Please log in',
      'info'
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const userMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setToken(user.token)
      Logindispatch({ type: 'SET_USER', payload: user })
      createNotification(`Welcome ${user.name}`, 'create')
    },
    onError: (error) => {
      console.log('Login error:', error)
      createNotification('wrong username or password', 'error')
    }
  })

  const creatUser = async (userObject) => {
    userMutation.mutate(userObject)
  }

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    creatUser({
      username,
      password
    })
    setUsername('')
    setPassword('')
    navigate('/')
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button variant="contained" color="primary" type="submit">
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
