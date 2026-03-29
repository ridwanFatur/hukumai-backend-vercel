import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.get('/env', (req, res) => {
  res.json({ appName: process.env.APP_NAME })
})

app.get('/', (req, res) => {
  res.json({ message: 'Can I push this?'});
});

app.get('/api/users/:id', (_req, res) => {
  res.json({ id: _req.params.id })
})

app.get('/api/posts/:postId/comments/:commentId', (_req, res) => {
  res.json({ postId: _req.params.postId, commentId: _req.params.commentId })
})

export default app
