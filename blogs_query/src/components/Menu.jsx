import { Link } from 'react-router-dom'
import LoginContext from '../context/LoginContext'
import { useContext } from 'react'
import { AppBar, Toolbar, Button } from '@mui/material'
import api from '../services/api'

const Menu = ({setDisable}) => {
  const [user, Logindispatch] = useContext(LoginContext)

  if (!user) {
    return <div>Loading data...</div>
  }

  const handleDisableAccount = async () => {
    try {
      await api.logout(user.token);
      setDisable(true);
    } catch (error) {
      console.error("Error disabling account:", error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          home
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <Button color="inherit" component={Link} to="/authors">
          authors
        </Button>
        <em style={{ color: 'lightgray' }}>{user.name} logged in</em>
        <Button
          color="inherit"
          onClick={() => {
            window.localStorage.removeItem('loggedBlogappUser')
            Logindispatch({ type: 'LOGOUT' })
            setDisable(false);
          }}
          component={Link}
          to="/"
        >
          logout
        </Button>
        <Button color="inherit" onClick={handleDisableAccount}>
          disable
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Menu
