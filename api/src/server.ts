import dotenv from 'dotenv'
dotenv.config({ quiet: true })

import express, { Request, Response } from 'express'
import cors from 'cors'
import './db/mongoDbClient';




const app = express()
const port = process.env.PORT || 8000


const dynamicCorsOptions = function (req: Request, callback: (err: any, options?: cors.CorsOptions) => void) {
  let corsOptions;
  if (req.path.startsWith('/auth/')) {
    corsOptions = {
      origin: process.env.CLIENT_URL,
      credentials: true,
    };
  } else {
    corsOptions = { origin: process.env.CLIENT_URL };
  }
  callback(null, corsOptions);
};


app.use(cors(dynamicCorsOptions))


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})


app.get('/health', (req: Request, res: Response) => {
  res.send('OK')
})

app.use((req: Request, res: Response) => {
  const { method, path, originalUrl, query } = req
  res.json({ method, path, originalUrl, query })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
