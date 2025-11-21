const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth.middleware");
const { adminMiddleware } = require("../middleware/admin.middleware");
const {
  borrowBook,
  returnBook,
  adminViewAllBorrows,
  userCurrentBorrows,
  userBorrowHistory
} = require("../controllers/borrow.controller");


router.post("/borrow", authMiddleware, borrowBook);
router.post("/return", authMiddleware, returnBook);
router.get("/my-borrows", authMiddleware, userCurrentBorrows);
router.get("/history", authMiddleware, userBorrowHistory);


router.get("/all", authMiddleware, adminMiddleware, adminViewAllBorrows);

module.exports = router;
