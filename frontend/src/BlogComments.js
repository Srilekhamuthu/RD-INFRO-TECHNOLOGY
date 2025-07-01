import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';

function BlogComments({ blogId }) {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://rd-infra-technology.onrender.com/blogs/${blogId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('❌ Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  return (
    <div className="comment-section">
      <h4>Comments:</h4>
      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment._id}>
            {comment.text} - <em>{comment.author}</em>
          </li>
        ))}
      </ul>

      <CommentForm blogId={blogId} onCommentAdded={fetchComments} />
    </div>
  );
}

export default BlogComments;
