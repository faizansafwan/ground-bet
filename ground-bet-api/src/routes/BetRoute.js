import express from 'express';
import { addBet, deleteBetById, deleteMultipleBets, getAllBets, getDonationsByPerson, getTotalDonation, updateBetById } from '../controllers/BetController.js';

const router = express.Router();

router.post('/', addBet);
router.get('/', getAllBets);
router.put('/:id', updateBetById);
router.delete('/:id', deleteBetById);
router.delete('/multiple', deleteMultipleBets);
router.get('/donation', getTotalDonation);
router.get('/person', getDonationsByPerson);


export default router;