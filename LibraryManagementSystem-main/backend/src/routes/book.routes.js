import express from 'express';
import { createBook, deleteBook, getAllBooks, getBookById, updateBookById } from '../controller/book.controller.js';
import { authorize } from '../middleware/auth.middleware.js';
import { adminCheck } from '../middleware/admin.middleware.js';

const router = express.Router();

router.get('/',authorize, getAllBooks)

router.get('/:id',authorize, getBookById)

router.post('/',authorize,adminCheck, createBook)

router.put('/:id',authorize,adminCheck, updateBookById)

router.delete('/:id',authorize,adminCheck, deleteBook)

export default router;