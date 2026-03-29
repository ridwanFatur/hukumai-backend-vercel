import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express on Vercel! (Updated 29-03-2026)' });
});

app.get('/api/users/:id', (_req, res) => {
  res.json({ id: _req.params.id })
})

app.get('/api/posts/:postId/comments/:commentId', (_req, res) => {
  res.json({ postId: _req.params.postId, commentId: _req.params.commentId })
})

export default app
