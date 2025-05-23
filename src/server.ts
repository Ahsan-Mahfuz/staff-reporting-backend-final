import dotenv from 'dotenv'
dotenv.config()

import app from './app'

const PORT = process.env.PORT || 5000

app.use('/', (req, res) => {
  res.send('ChatApplication server is running perfectly!')
})
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
