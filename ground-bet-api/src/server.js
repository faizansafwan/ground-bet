import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import betRoutes from './routes/BetRoute.js';
import { db } from './database/db.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: ['https://faizansafwan.github.io', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
app.use(express.json());

app.use('/api/bets', betRoutes);

app.get('/', (req, res) => {
    res.send('Ground Bet API is running...');
});

// in your Express.js backend
app.get("/api/ping", (req, res) => {
    res.send("pong");
});
  

app.listen( port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

db.getConnection().then(() => console.log('✅ MySQL connected successfully'))
.catch((err) => console.error('❌ MySQL connection failed:', err));
