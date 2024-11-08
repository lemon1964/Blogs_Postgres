import PropTypes from 'prop-types'
import { useContext } from 'react'
import LoginContext from '../context/LoginContext'
import styled from 'styled-components'

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

const Input = styled.input`
  margin: 0.25em;
`

const BlogForm = ({ createBlogform }) => {
  const [user, Logindispatch] = useContext(LoginContext)

  const addBlog = (event) => {
    event.preventDefault()
    const content = event.target.blogTitle.value
    const author = event.target.blogAuthor.value
    const url = event.target.blogUrl.value
    const year = event.target.blogYear.value

    createBlogform({
      title: content,
      author,
      url,
      likes: 0,
      year,
      user: { username: user.username, name: user.name }
    })
    event.target.blogTitle.value = ''
    event.target.blogAuthor.value = ''
    event.target.blogUrl.value = ''
    event.target.blogYear.value = ''
  }

  return (
    <div>
      <form onSubmit={addBlog}>
        <div>
          title
          <Input placeholder="title" name="blogTitle" />
        </div>
        <div>
          author
          <Input placeholder="author" name="blogAuthor" />
        </div>
        <div>
          url
          <Input placeholder="url" name="blogUrl" type="url" />
        </div>
        <div>
          year
          <Input placeholder="year" name="blogYear" />
        </div>
        <Button type="submit">create</Button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlogform: PropTypes.func.isRequired
}

export default BlogForm
