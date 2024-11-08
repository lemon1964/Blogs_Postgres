import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { update, remove } from '../services/blogs'
import { useCreateNotification } from '../context/NotificationContext'
import styled from 'styled-components'
import { Typography, Button as MuiButton } from '@mui/material'

const Button = styled(MuiButton)`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

const Blog = ({ loggedUser, blog }) => {
  const queryClient = useQueryClient()
  const createNotification = useCreateNotification()
  const navigate = useNavigate()

  const deleteBlogMutation = useMutation({
    mutationFn: remove,
    onSuccess: (_, id) => {
      const cachedBlogs = queryClient.getQueryData(['blogs']) || [];
      const deletedBlog = cachedBlogs.find((b) => b.id === id);
      queryClient.setQueryData(['blogs'], cachedBlogs.filter((b) => b.id !== id));
      queryClient.invalidateQueries(['blogs']);
      createNotification(
        `Blog '${deletedBlog.title}' deleted successfully`,
        'delete'
      );
    },
    onError: () => {
      createNotification('Error deleting blog', 'error');
    }
  });

  const updatedBlogMutation = useMutation({
    mutationFn: update,
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs'], (blogs) =>
        blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
      );
      queryClient.invalidateQueries(['blogs']);
      createNotification(`Blog '${updatedBlog.title}' liked`, 'like');
    },
    onError: () => {
      createNotification('Error updating blog', 'error');
    }
  });

  if (!loggedUser) {
    return null;
  }

  if (!blog) {
    return <div>Loading data...</div>;
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user ? blog.user.id : null
    };
    await updatedBlogMutation.mutate({ id: blog.id, ...updatedBlog });
  };

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await deleteBlogMutation.mutate(blog.id);
      navigate('/');
    }
  };

  const showRemoveButton =
    loggedUser && blog.user && blog.user.name === loggedUser.name;

  return (
    <div>
      <Typography variant="h4" component="h2">
        {blog.title} by {blog.author}
      </Typography>
      <div>
        <Link to={blog.url}>{blog.url}</Link>
      </div>
      <div>
        {blog.likes} likes
        <Button onClick={handleLike}>like</Button>
      </div>
      <div>added by {blog.user ? blog.user.name : 'unknown'}</div>
      <div>in year {blog.year}</div>
      {showRemoveButton && (
        <Button color="error" onClick={handleRemove}>
          remove
        </Button>
      )}
    </div>
  );
}

export default Blog;
