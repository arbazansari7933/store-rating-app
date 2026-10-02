import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/security.js';
import { requestId } from './middleware/requestId.js';

export const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(requestId);
app.use(helmet());
app.use(cors({ origin: env.corsOrigin.split(',').map((item) => item.trim()), credentials: false }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use('/api', apiLimiter);

app.get('/api/health', async (req, res) => {
  res.json({
    success: true,
    data: { status: 'ok', service: 'roxiler-store-rating-api', requestId: req.requestId },
  });
});
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);
