import { Link } from 'react-router-dom'
import { useContext } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper
} from '@mui/material'
import UserContext from '../context/UserContext'

const Users = ({ loggedUser }) => {
  const [users] = useContext(UserContext)

  if (!loggedUser) {
    return null
  }

  if (!users) {
    return <div>Loading users...</div>
  }

  if (users.length === 0) {
    return <div>No users found.</div>
  }

  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>blogs created</TableCell>
            </TableRow>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users
