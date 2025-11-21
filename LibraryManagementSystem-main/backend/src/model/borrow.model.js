const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  status: { type: String, enum: ["BORROWED", "RETURNED"], default: "BORROWED" },
}, { timestamps: true });

const Borrow = mongoose.model("Borrow", borrowSchema);

module.exports = Borrow;
