import React, { useState } from 'react';
import axios from 'axios';

function CommentForm({ blogId, onCommentAdded }) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`https://rd-infra-technology.onrender.com/blogs/${blogId}/comments`, {
        text,
        author,
      });
      onCommentAdded(); // Refresh comments
      setText('');
      setAuthor('');
    } catch (error) {
      console.error('❌ Failed to add comment!', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <button type="submit">Add Comment ✅</button>
    </form>
  );
}

export default CommentForm;
