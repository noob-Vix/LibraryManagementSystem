import express from 'express';
import { borrowBook, userBorrowHistory,returnBook,userCurrentBorrows , adminViewAllBorrows, getOverdueBorrows} from '../controller/borrow.controller.js';
import { authorize } from '../middleware/auth.middleware.js';
import { adminCheck } from '../middleware/admin.middleware.js';

const borrowRouter = express.Router();

borrowRouter.post("/borrow", authorize, borrowBook);

borrowRouter.post("/return", authorize, returnBook);

borrowRouter.get("/my-borrows", authorize, userCurrentBorrows);

borrowRouter.get("/history", authorize, userBorrowHistory);

borrowRouter.get("/all", authorize, adminCheck, adminViewAllBorrows);

borrowRouter.get("/overdue",authorize, adminCheck, getOverdueBorrows)

export default borrowRouter;