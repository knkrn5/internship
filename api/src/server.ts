// import dotenv from 'dotenv'
// dotenv.config({ quiet: true })
import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'


import cors from 'cors'
import './db/mongooseConnect';
import { authRouter } from './routes/auth.route';


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
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter)


app.get('/', (_: Request, res: Response) => {
  res.send('Hello World!')
})

app.get('/health', (_: Request, res: Response) => {
  res.send('✅OK')
})

app.use((req: Request, res: Response) => {
  const { method, path, originalUrl, query } = req
  res.json({ method, path, originalUrl, query })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
