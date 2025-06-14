import express from 'express';
import client from 'prom-client';

const router = express.Router();
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

router.get('/', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

export default router; 