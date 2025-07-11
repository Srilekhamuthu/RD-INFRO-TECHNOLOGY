import React, { useState } from 'react';
import BlogForm from './BlogForm';
import BlogList from './BlogList';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBlogAdded = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <div className="container">
      <h1>Blog Without Borders 📝🌐</h1>
      <BlogForm onBlogAdded={handleBlogAdded} />
      <BlogList key={refreshKey} />
    </div>
  );
}

export default App;
