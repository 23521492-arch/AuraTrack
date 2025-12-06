import express from 'express';
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoute.js';
import { protectedRoute } from './middlewares/authMiddleware.js';
import moodRoute from './routes/moodRoute.js';
import journalRoute from './routes/journalRoute.js';
import habitRoute from './routes/habitRoute.js';
import sleepRoute from './routes/sleepRoute.js';
import overviewRoute from './routes/overviewRoute.js';
import factRoute from './routes/factRoute.js';
import paymentRoute from './routes/paymentRoute.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './src/.env' });

const app = express();
const PORT = process.env.PORT || 5001;

//middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files (sounds) - public route, no auth required
app.use('/sounds', express.static(path.join(__dirname, '.')));

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AuraTrack API Documentation',
      version: '1.0.0',
      description: 'API documentation for AuraTrack - Mental Health Tracking Application',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development Server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

//public routes
app.use('/api/auth', authRoute);

//private routes
app.use(protectedRoute);
app.use('/api/users', userRoute);
app.use('/api/moods', moodRoute);
app.use('/api/journals', journalRoute);
app.use('/api/habits', habitRoute);
app.use('/api/sleeps', sleepRoute);
app.use('/api/overview', overviewRoute);
app.use('/api/facts', factRoute);
app.use('/api/payments', paymentRoute);

connectDB().then(async () => {
  // Auto-seed facts if database is empty
  try {
    const { seedFacts } = await import('./utils/seedFacts.js');
    const Fact = (await import('./models/Fact.js')).default;
    const factCount = await Fact.countDocuments();
    if (factCount === 0) {
      console.log('🌱 No facts found, seeding initial facts...');
      await seedFacts();
    }
  } catch (error) {
    console.error('Warning: Could not auto-seed facts:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});