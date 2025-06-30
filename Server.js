const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ✅ MongoDB Connection (Replace with your MongoDB URI if needed)
mongoose.connect('mongodb+srv://Srilekhamuthu:Srikrishna@cluster0.khriewt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Blog Schema & Model
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
});
const Blog = mongoose.model('Blog', blogSchema);

// ✅ Comment Schema & Model
const commentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  },
  text: String,
  author: String,
});
const Comment = mongoose.model('Comment', commentSchema);

// ✅ Routes

// Default route
app.get('/', (req, res) => {
  res.send('✅ Blog Backend Running');
});

// ✅ GET all blogs
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST a new blog
app.post('/blogs', async (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).json({ error: 'All fields required' });
  }
  try {
    const newBlog = new Blog({ title, content, author });
    await newBlog.save();
    res.status(201).json({ message: 'Blog created', blog: newBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ DELETE a blog
app.delete('/blogs/:id', async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST Comment for a Blog
app.post('/blogs/:id/comments', async (req, res) => {
  const { text, author } = req.body;

  if (!text || !author) {
    return res.status(400).json({ error: 'Text and Author required' });
  }

  try {
    const newComment = new Comment({
      blogId: req.params.id,
      text,
      author,
    });
    await newComment.save();
    res.status(201).json({ message: 'Comment added', comment: newComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ GET Comments for a Blog
app.get('/blogs/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.id });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
