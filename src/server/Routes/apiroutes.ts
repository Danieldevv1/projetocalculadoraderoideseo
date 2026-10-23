// src/server/routes/roi.routes.ts
import { Router } from 'express';
import { handleCalculateRoi } from '../Controllers/controllers.js';

const router = Router();

// Define o endpoint POST
router.post('/calculate-roi', handleCalculateRoi);

export default router;