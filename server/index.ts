import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', productRoutes);

// Avvio del server

app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});


