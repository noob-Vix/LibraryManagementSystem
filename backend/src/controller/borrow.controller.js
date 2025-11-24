import { Book } from "../model/book.model.js";
import Borrow from "../model/borrow.model.js";

export const borrowBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.availableCopies <= 0) return res.status(400).json({ message: "Book is not available" });

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 7);

    const borrowRecord = await Borrow.create({
      user: userId,
      book: bookId,
      borrowDate: new Date(),
      dueDate,
      status: "BORROWED",
    });

    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({borrowRecord, borrowUntil:dueDate});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const returnBook = async (req, res) => {
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

export const adminViewAllBorrows = async (req, res) => {
  try {
    const data = await Borrow.find()
      .populate("user", "name email")
      .populate("book", "title author");
    const result = data.map((record) => {
      const isOverdue =
        record.status !== "RETURNED" &&
        record.dueDate &&
        new Date(record.dueDate) < new Date();

      return {
        ...record._doc,
        isOverdue,
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const userCurrentBorrows = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await Borrow.find({ user: userId, status: "BORROWED" })
      .populate("book", "title author");
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const userBorrowHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await Borrow.find({ user: userId })
      .populate("book", "title author");
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOverdueBorrows = async (req, res) => {
  try {
    const now = new Date();

    // Update overdue statuses
    await Borrow.updateMany(
      { dueDate: { $lt: now }, returnDate: null },
      { status: "OVERDUE" }
    );

    const overdue = await Borrow.find({
      status: "OVERDUE"
    })
      .populate("book")
      .populate("user");

    res.json(overdue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
