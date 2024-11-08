import { useRef, useContext, useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper
} from '@mui/material'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { useCreateNotification } from '../context/NotificationContext'
import { createBlog } from '../services/blogs'
import LoginContext from '../context/LoginContext'
import axios from 'axios'
import api from '../services/api'
import BlogItem from './BlogItem'

const Home = ({ disable }) => {
  const blogFormRef = useRef()
  const queryClient = useQueryClient()
  const createNotification = useCreateNotification()
  const [user] = useContext(LoginContext)
  const [searchQuery, setSearchQuery] = useState('')
  const [readingList, setReadingList] = useState([])

  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs', searchQuery],
    queryFn: async () => {
      const response = await axios.get('/api/blogs', {
        params: { search: searchQuery }
      })
      return response.data
    }
  })

  useEffect(() => {
    const fetchUserReadingList = async () => {
      if (user?.id) {
        try {
          const response = await api.getUserReadingList(user.id)
          setReadingList(response)
        } catch (error) {
          console.error('Failed to fetch reading list:', error)
        }
      }
    }

    fetchUserReadingList()
  }, [user?.id])

  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (newBlog) => {
      newBlog.user = user
      queryClient.invalidateQueries(['blogs'])
      createNotification(`you created '${newBlog.title}'`, 'create')
    },
    onError: () => {
      createNotification(
        'Title must be at least 5 characters and unique. Author and url are required. Your token may have expired, please log in again.',
        'error'
      )
    }
  })

  const addBlog = async (blog) => {
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(blog)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  if (user) {
    return (
      <div>
        <div>
          {disable ? (
            <p style={{ color: 'red', fontWeight: 'bold' }}>
              {user.name}, your account is "disabled: true". You cannot perform
              actions requiring authorization. Please log out and log back in to
              regain access.
            </p>
          ) : (
            <p style={{ color: "green", fontWeight: "bold" }}>
              Hi, {user.name}, your account status is "disabled: false". You
              have full access to the site. To disable your account, click
              "disable" in the menu.
            </p>
          )}
        </div>
        <h2>blogs app</h2>
        <div>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlogform={addBlog} />
          </Togglable>
          <input
            type="text"
            placeholder="Search blogs"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginBottom: '20px' }}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <BlogItem
                        blog={blog}
                        readingList={readingList}
                        userId={user.id}
                        user={user}
                      />
                    </TableCell>
                    <TableCell>{blog.author}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    )
  }

  return null
}

export default Home
