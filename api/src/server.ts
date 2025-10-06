import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()


const app = express()
const port = process.env.PORT || 3000


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})



app.get('/health', (req: Request, res: Response) => {
  res.send('OK')
})

app.use((req: Request, res: Response) => {
  const pathName = req.path
  res.send(pathName)
  // res.redirect('/')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
