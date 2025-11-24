import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import Tabs from "../components/ui/Tabs";

type Book = {
  _id?: string;
  title: string;
  author: string;
  isbn: string;
  year: number;
  totalCopies: number;
  availableCopies: number;
};

type Borrow = {
  _id?: string;
  book: Book | string;
  user?: { _id?: string; name?: string; email?: string };
  borrowDate?: string;
  dueDate?: string;
  returnDate?: string | null;
};

const UserDashboard: React.FC = () => {
  const auth = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [myBorrows, setMyBorrows] = useState<Borrow[]>([]);
  const [history, setHistory] = useState<Borrow[]>([]);
  const [search, setSearch] = useState<string>('')
  const [error, setError] = useState<string | null>(null);

  console.log({
    books,
    myBorrows,
    history
  })

  const authHeaders = {
    Authorization: `Bearer ${auth.token}`,
    "Content-Type": "application/json",
  };

  const fetchBooks = async (q: string = '') => {
    try {
      const url = new URL('http://localhost:3000/api/books')
      if (q) url.searchParams.set('search', q)
      const res = await fetch(url.toString(), {
        headers: { ...authHeaders },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch books");
      setBooks(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchMyBorrows = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/borrows/my-borrows", {
        headers: { ...authHeaders },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch borrows");
      setMyBorrows(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/borrows/history", {
        headers: { ...authHeaders },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch history");
      setHistory(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchMyBorrows();
    fetchHistory();
  }, []);


  const borrowBook = async (bookId?: string) => {
    if (!bookId) return;
    try {
      const res = await fetch("http://localhost:3000/api/borrows/borrow", {
        method: "POST",
        headers: { ...authHeaders },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Borrow failed");
      // refresh
      fetchBooks();
      fetchMyBorrows();
      fetchHistory();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const returnBorrow = async (borrowId?: string) => {
    if (!borrowId) return;
    try {
      const res = await fetch("http://localhost:3000/api/borrows/return", {
        method: "POST",
        headers: { ...authHeaders },
        body: JSON.stringify({ borrowId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Return failed");
      fetchBooks();
      fetchMyBorrows();
      fetchHistory();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const booksContent = (
    <div>
      <div className="mb-4">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            fetchBooks(search);
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books"
            className="border px-3 py-2 rounded-md flex-1 dark:bg-slate-900 dark:border-none"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="space-y-3 mb-6">
        {books.map((b) => (
          <div
            key={b._id}
            className="dark:bg-slate-900 dark:border-none border border-gray-200 p-3 gap-2 bg-white rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{b.title}</div>
              <div className="text-sm dark:text-slate-400 text-gray-600">
                {b.author} • {b.isbn} • {b.year}
              </div>
              <div className="text-sm">
                Available: {b.availableCopies}/{b.totalCopies}
              </div>
            </div>
            <div>
              <Button
                onClick={() => borrowBook(b._id)}
                disabled={b.availableCopies <= 0}
              >
                Borrow
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const borrowsContent = (
    <section className="mb-6">
      <h2 className="text-xl mb-2">My Current Borrows</h2>
      <div className="space-y-3">
        {myBorrows.length === 0 && (
          <div className="text-sm text-gray-600">You have no current borrows.</div>
        )}
        {myBorrows.map((m) => (
          <div
            key={m._id}
            className="dark:bg-slate-900 dark:border-none border border-gray-200 p-3 gap-2 bg-white rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <div className="font-medium">
                {typeof m.book === "string" ? "Book" : (m.book as Book).title}
              </div>
              <div className="text-sm dark:text-slate-400 text-gray-600">
                Borrowed at: {" "}
                {m.borrowDate ? new Date(m.borrowDate).toLocaleString() : "-"}
              </div>

              <div className="text-sm dark:text-slate-400 text-gray-600">
                Due: {" "}
                {m.dueDate ? new Date(m.dueDate).toLocaleString() : "-"}
              </div>
            </div>
            <div>
              <Button onClick={() => returnBorrow(m._id)}>Return</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  const historyContent = (
    <section>
      <h2 className="text-xl mb-2">Borrow History</h2>
      <div className="space-y-3">
        {history.length === 0 && (
          <div className="text-sm text-gray-600">No borrow history.</div>
        )}
        {history.map((h) => (
          <div key={h._id} className="dark:bg-slate-900 dark:border-none border gap-2 border-gray-200 p-3 bg-white rounded shadow-sm">
            <div className="font-medium">
              {typeof h.book === "string" ? "Book" : (h.book as Book).title}
            </div>
            <div className="text-sm dark:text-slate-400 text-gray-600">
              Borrowed: {" "}
              {h.borrowDate ? new Date(h.borrowDate).toLocaleString() : "-"} •
              <div className={`text-sm ${
                h.dueDate && new Date(h.dueDate) < new Date()
                  ? "text-red-500 font-semibold"
                  : "dark:text-slate-400 text-gray-600"
              }`}>
              </div>
              Returned: {" "}
              {h.returnDate ? new Date(h.returnDate).toLocaleString() : "—"}
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  const tabs = [
    { key: 'books', label: 'Books', content: booksContent },
    { key: 'borrows', label: 'Borrowed', content: borrowsContent },
    { key: 'history', label: 'History', content: historyContent },
  ]

  return (
    <div>
      <h1 className="text-2xl mb-4">Library</h1>
      {error && <div className="text-red-600">{error}</div>}
      <Tabs tabs={tabs} />
    </div>
  )
}

export default UserDashboard;
