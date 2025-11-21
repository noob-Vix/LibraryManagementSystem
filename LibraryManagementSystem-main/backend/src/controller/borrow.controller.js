const Borrow = require("../models/borrow.model");
const Book = require("../models/book.model");

const borrowBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.availableCopies <= 0) return res.status(400).json({ message: "Book is not available" });

    const borrowRecord = await Borrow.create({
      user: userId,
      book: bookId,
      borrowDate: new Date(),
      status: "BORROWED",
    });

    book.availableCopies -= 1;
    await book.save();

    res.status(201).json(borrowRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.body;
    const record = await Borrow.findById(borrowId);
    if (!record) return res.status(404).json({ message: "Borrow record not found" });
    if (record.status === "RETURNED") return res.status(400).json({ message: "Book already returned" });

    const book = await Book.findById(record.book);

    record.returnDate = new Date();
    record.status = "RETURNED";
    await record.save();

    book.availableCopies += 1;
    await book.save();

    res.json({ message: "Book returned successfully", record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const adminViewAllBorrows = async (req, res) => {
  try {
    const data = await Borrow.find()
      .populate("user", "name email")
      .populate("book", "title author");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const userCurrentBorrows = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await Borrow.find({ user: userId, status: "BORROWED" })
      .populate("book", "title author");
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const userBorrowHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await Borrow.find({ user: userId })
      .populate("book", "title author");
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  borrowBook,
  returnBook,
  adminViewAllBorrows,
  userCurrentBorrows,
  userBorrowHistory
};
