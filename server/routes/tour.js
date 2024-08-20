import express from 'express';
import { createTour, deleteTour,  getRelatedTours,  getTour, getTourBySearch, getTours, getToursByTag, getToursByUser, likeTour, updateTour } from '../controllers/tour.js';
import auth from '../middleware/auth.js';

const router=express.Router();


router.get('/getTours',getTours);
router.get('/search', getTourBySearch);
router.get('/tag/:tag', getToursByTag);
router.post('/relatedTours', getRelatedTours);
router.get('/getTour/:id',getTour);


router.post('/create',auth,createTour);
router.get('/userTours/:id',auth,getToursByUser);
router.delete('/deleteTour/:id',auth,deleteTour);
router.patch('/updateTour/:id',auth,updateTour);
router.patch('/like/:id', auth, likeTour);

export default router;