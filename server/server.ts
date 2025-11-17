import type { Plugin, ViteDevServer } from 'vite';
import express, { Express } from 'express';
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';

export function apiPlugin(): Plugin {
  return {
    name: 'api-routes',
    configureServer(server: ViteDevServer) {
      const app: Express = express();

      // Middleware
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      // CORS headers
      app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.sendStatus(200);
          return;
        }
        next();
      });

      // API routes
      app.use('/api/auth', authRoutes);
      app.use('/api/todos', todoRoutes);

      // Error handling
      app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error('API Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      });

      // Use the Express app as middleware
      server.middlewares.use(app);
    },
  };
}
