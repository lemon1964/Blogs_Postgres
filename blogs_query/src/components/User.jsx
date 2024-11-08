import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { getUserById } from '../services/users';

const User = ({ loggedUser, user }) => {
  const [readingList, setReadingList] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchReadingList();
    }
  }, [user, filter]);

  const fetchReadingList = async () => {
    const readParam = filter === 'all' ? null : filter === 'read';
    const data = await getUserById(user.id, readParam);
    setReadingList(data.readings);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  if (!loggedUser) {
    return null;
  }

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <Typography variant="h4" component="h2">
        {user.name}
      </Typography>
      <Typography variant="h5" component="h3">
        Added Blogs
      </Typography>
      <List>
        {user.blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <ListItem key={blog.id} style={{ paddingLeft: 0 }}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </ListItem>
          ))}
      </List>

      <Typography variant="h5" component="h3" style={{ marginTop: '20px' }}>
        Reading List
      </Typography>
      <RadioGroup row value={filter} onChange={handleFilterChange}>
        <FormControlLabel value="all" control={<Radio />} label="All" />
        <FormControlLabel value="read" control={<Radio />} label="Read" />
        <FormControlLabel value="unread" control={<Radio />} label="Unread" />
      </RadioGroup>

      <List>
        {readingList.map((blog) => (
          <ListItem key={blog.id} style={{ paddingLeft: 0 }}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default User;
