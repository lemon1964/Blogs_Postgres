import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Authors = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('/api/authors');
        setAuthors(response.data);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <thead>
          <tr>
            <th>Author</th>
            <th>Articles</th>
            <th>Likes</th>
          </tr>
        </thead>
        <tbody>
          {authors.map(author => (
            <tr key={author.author}>
              <td>{author.author}</td>
              <td>{author.articles}</td>
              <td>{author.likes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Authors;
