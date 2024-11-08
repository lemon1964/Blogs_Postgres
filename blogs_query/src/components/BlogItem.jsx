import { useState, useEffect } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

const BlogItem = ({ blog, readingList, userId, user }) => {
  const [status, setStatus] = useState(null)

  const userReadingEntry = readingList?.readings?.find(
    (entry) => entry.id === blog.id
  )

  useEffect(() => {
    if (userReadingEntry) {
      setStatus({
        read: userReadingEntry.readinglists.read,
        id: userReadingEntry.readinglists.id
      })
    }
  }, [userReadingEntry])

  const handleMarkAsReading = async () => {
    try {
      const response = await api.addToReadingList(blog.id, userId)

      setStatus({ read: false, id: response.id })
    } catch (error) {
      console.error('Error marking as reading:', error)
    }
  }

  const handleMarkAsRead = () => {
    api
      .markAsRead(status.id, user.token)
      .then((data) => {
        setStatus((prevStatus) => ({ ...prevStatus, read: true }))
      })
      .catch((error) => {
        console.error('Error marking as read:', error)
      })
  }

  const renderButton = () => {
    if (blog.user.name === readingList.name) {
      return <span>My blog</span>
    }

    if (status?.read) {
      return <span>Read</span>
    }

    if (status && !status.read) {
      return <button onClick={handleMarkAsRead}>Mark as Read</button>
    }

    return <button onClick={handleMarkAsReading}>Mark as Reading</button>
  }

  return (
    <div>
      <h2>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      </h2>
      {renderButton()}
    </div>
  )
}

export default BlogItem
