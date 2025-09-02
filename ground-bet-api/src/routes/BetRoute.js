import express from 'express';
import { addBet, deleteBetById, getAllBets, getTotalDonation, updateBetById } from '../controllers/BetController.js';

const router = express.Router();

router.post('/', addBet);
router.get('/', getAllBets);
router.put('/:id', updateBetById);
router.delete('/:id', deleteBetById);
router.get('/donation', getTotalDonation);

export default router;