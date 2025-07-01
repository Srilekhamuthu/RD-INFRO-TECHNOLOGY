import React, { useState } from 'react';
import axios from 'axios';

function BlogForm({ onBlogAdded }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('https://rd-infra-technology.onrender.com/blogs', {
        title,
        content,
        author,
      });
      onBlogAdded(); // Refresh the blog list after adding
      setTitle('');
      setContent('');
      setAuthor('');
    } catch (error) {
      console.error('Error adding blog:', error);
    }
  };

  return (
    <>
      <h2>Add a New Blog ✏️</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          rows="5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button type="submit">Add Blog ✅</button>
      </form>
    </>
  );
}

export default BlogForm;
