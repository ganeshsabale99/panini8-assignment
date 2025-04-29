import express from 'express';
import jwt from 'jsonwebtoken';
import Post from '../models/Post.js';

const router = express.Router();

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
}

router.post('/', verifyToken, async (req, res) => {
  try {
    const post = new Post({ ...req.body, author: req.userId });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.json(post);
});

router.put('/:id', async (req,res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id,req.body);
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;