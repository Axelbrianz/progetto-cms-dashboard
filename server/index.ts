import 'dotenv/config' ;
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';

import { errorHandler } from './middleware/errMiddleware.js';



const app = express();
const PORT = process.env.PORT

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', productRoutes);
app.use('/api',authRoutes);
app.use(errorHandler)
// Avvio del server

app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});


