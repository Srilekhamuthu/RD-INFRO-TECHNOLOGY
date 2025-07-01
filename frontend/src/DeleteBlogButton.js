import React from 'react';
import axios from 'axios';

function DeleteBlogButton({ blogId, onDelete }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/blogs/${blogId}`);
      alert('✅ Blog deleted successfully');
      onDelete();  // Refresh blog list
    } catch (error) {
      console.error('❌ Error deleting blog:', error);
      alert('❌ Failed to delete blog');
    }
  };

  return (
    <button onClick={handleDelete}>Delete</button>
  );
}

export default DeleteBlogButton;
