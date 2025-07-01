import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogComments from './BlogComments';

function BlogList() {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('https://rd-infra-technology.onrender.com/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://rd-infra-technology.onrender.com/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div>
      <h2>All Blogs 📖</h2>
      <ul>
        {blogs.map((blog) => (
          <li key={blog._id}>
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
            <em>- {blog.author}</em>
            <button onClick={() => handleDelete(blog._id)}>Delete ❌</button>

            {/* ✅ Show comments under each blog */}
            <BlogComments blogId={blog._id} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogList;
