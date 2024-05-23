import path from 'node:path'
import cors from 'cors'
import express, { type Request, type Response } from 'express'

import { createURLShortener } from './routes/create-urlshortener'
import { redirectToOriginalURL } from './routes/redirect-to-original-url'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static(path.join(__dirname, '../public')))

app.get('/', (req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, '../views/index.html'))
})

app.post('/api/shorturl', createURLShortener)
app.get('/api/shorturl/:id', redirectToOriginalURL)

const PORT = 3333
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`)
})
