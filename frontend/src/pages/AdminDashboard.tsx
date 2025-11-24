import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import Tabs from "../components/ui/Tabs";
import Card from "../components/ui/Card";
import Dialog from "../components/ui/Dialog";
import Alert from "../components/ui/Alert";

type Book = {
  _id?: string;
  title: string;
  author: string;
  isbn: string;
  year: number;
  totalCopies: number;
  availableCopies: number;
};

type User = { _id?: string; name?: string; email?: string; role?: string };

type Borrow = {
  _id?: string
  book?: Book | string
  user?: User | string
  borrowDate?: string;
  dueDate?: string
  returnDate?: string | null;
}

const AdminDashboard: React.FC = () => {
  const auth = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState<Book>({
    title: "",
    author: "",
    isbn: "",
    year: new Date().getFullYear(),
    totalCopies: 1,
    availableCopies: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [borrowsAll, setBorrowsAll] = useState<Borrow[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [bookFormOpen, setBookFormOpen] = useState(false)

  const authHeaders = {
    Authorization: `Bearer ${auth.token}`,
    "Content-Type": "application/json",
  };

  const fetchBooks = async (q = "") => {
    try {
      const url = new URL("http://localhost:3000/api/books");
      if (q) url.searchParams.set("search", q);
      const res = await fetch(url.toString(), { headers: authHeaders });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch books");
      setBooks(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchAllBorrows = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/borrows/all', { headers: authHeaders });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch borrows')
      setBorrowsAll(data || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchBooks();
    fetchUsers();
    fetchAllBorrows();
  }, []);

  

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        const res = await fetch(
          `http://localhost:3000/api/books/${editing._id}`,
          { method: "PUT", headers: authHeaders, body: JSON.stringify(form) }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Update failed");
      } else {
        const res = await fetch("http://localhost:3000/api/books", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Create failed");
      }
      setForm({
        title: "",
        author: "",
        isbn: "",
        year: new Date().getFullYear(),
        totalCopies: 1,
        availableCopies: 1,
      });
      setEditing(null);
      fetchBooks();
      // close modal form if open
      setBookFormOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  

  const openBookModal = (b: Book) => {
    setSelectedBook(b)
    setModalOpen(true)
  }

  const closeBookModal = () => {
    setSelectedBook(null)
    setModalOpen(false)
  }

  const del = async (id?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:3000/api/books/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Delete failed");
      }
      fetchBooks();
      // close modal if open
      if (selectedBook?._id === id) closeBookModal()
      setDeleteConfirmOpen(false)
    } catch (err: any) {
      setError(err.message);
    }
  };

  const isOverdue = (borrow: Borrow) => {
  if (!borrow.dueDate || borrow.returnDate) return false;
  return new Date(borrow.dueDate) < new Date();
};

const daysLeft = (borrow: Borrow) => {
  if (!borrow.dueDate) return null;
  const diff = new Date(borrow.dueDate).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};


  return (
    <div>
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Books</div>
          <div className="text-2xl font-semibold">{books.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Users</div>
          <div className="text-2xl font-semibold">{users.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Borrowed</div>
          <div className="text-2xl font-semibold">{borrowsAll.length}</div>
        </Card>
      </div>

      <Tabs
        tabs={[
          {
            key: 'books',
            label: 'Books',
            content: (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Books</h3>
                  <Button onClick={() => { setSelectedBook(null); setEditing(null); setForm({ title: '', author: '', isbn: '', year: new Date().getFullYear(), totalCopies: 1, availableCopies: 1 }); setBookFormOpen(true); }}>Add Book</Button>
                </div>

                <div className="space-y-3">
                  {books.map((b) => (
                    <div
                      key={b._id}
                      className=" dark:bg-slate-900 dark:border-none border border-gray-200 p-3 bg-white rounded  shadow-sm flex justify-between items-center cursor-pointer"
                      onClick={() => openBookModal(b)}
                    >
                      <div>
                        <div className="font-medium">{b.title}</div>
                        <div className="dark:text-slate-400 text-sm text-gray-600">
                          {b.author} • {b.isbn}
                        </div>
                      </div>
                      <div className="dark:text-slate-400 text-sm text-gray-600">{b.availableCopies}/{b.totalCopies}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          },
          {
            key: 'users',
            label: 'Users',
            content: (
              <div>
                <h3 className="font-semibold mb-2">Users</h3>
                <div className="space-y-2">
                  {users.map((u) => (
                    <div
                      key={u._id}
                      className="dark:bg-slate-900 dark:border-none p-3 bg-white rounded border border-gray-200 shadow-sm flex justify-between"
                    >
                      <div>
                        <div className="font-medium">{u.name || u.email}</div>
                        <div className="text-sm dark:text-slate-400 text-gray-600">{u.email} • {u.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          },
          {
            key: 'borrows',
            label: 'Borrows',
            content: (
              <div>
                <h3 className="font-semibold mb-2">All Borrows</h3>
                <div className="space-y-2">
                  
                  {borrowsAll.length === 0 && <div className="text-sm text-gray-600">No borrows found.</div>}
                  {borrowsAll.map(b => {
                    const isOverdue = b.dueDate && !b.returnDate && new Date(b.dueDate) < new Date();
                    const remainingDays = !b.returnDate && b.dueDate 
                      ? Math.ceil((new Date(b.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                      : null;

                    return (
                      <div
                        key={b._id}
                        className={`dark:bg-slate-900 dark:border-none p-3 border rounded shadow-sm ${
                          isOverdue ? "border-red-600 bg-red-100" : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="font-medium">
                          {typeof b.book === 'string' ? 'Book' : (b.book as Book).title}
                        </div>

                        <div className="text-sm dark:text-slate-400 text-gray-600">
                          User: {typeof b.user === 'string' ? b.user : (b.user as User)?.email} • 
                          Borrowed: {b.borrowDate ? new Date(b.borrowDate).toLocaleDateString() : '-'} • 
                          Returned: {b.returnDate ? new Date(b.returnDate).toLocaleDateString() : '—'}
                          {!b.returnDate && b.dueDate && (
                            <> • Due: {new Date(b.dueDate).toLocaleDateString()} {remainingDays !== null ? `(${remainingDays} day${remainingDays > 1 ? 's' : ''} left)` : ''}</>
                          )}
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>
            )
          }
        ]}
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen} title={selectedBook?.title}>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Author: {selectedBook?.author}</div>
            <div className="text-sm text-gray-600">ISBN: {selectedBook?.isbn}</div>
            <div className="text-sm text-gray-600">Year: {selectedBook?.year}</div>
            <div className="text-sm text-gray-600">Available: {selectedBook?.availableCopies}/{selectedBook?.totalCopies}</div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => { if (selectedBook) { setEditing(selectedBook); setForm({...selectedBook}); setModalOpen(false); setBookFormOpen(true); } }}>Edit</Button>
            <Button className="bg-red-600" onClick={() => setDeleteConfirmOpen(true)}>Delete</Button>
          </div>
        </div>
      </Dialog>

      <Alert open={deleteConfirmOpen} title="Delete book" description={`Are you sure you want to delete "${selectedBook?.title}"? This action cannot be undone.`} onCancel={() => setDeleteConfirmOpen(false)} onConfirm={() => { del(selectedBook?._id); }} />

      <Dialog open={bookFormOpen} onOpenChange={setBookFormOpen} title={editing ? 'Edit Book' : 'Add Book'}>
        <form onSubmit={handleCreateOrUpdate} className="space-y-3">
          <Input label="Title" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} />
          <Input label="Author" value={form.author} onChange={(e)=>setForm({...form, author: e.target.value})} />
          <Input label="ISBN" value={form.isbn} onChange={(e)=>setForm({...form, isbn: e.target.value})} />
          <Input label="Year" type="number" value={String(form.year)} onChange={(e)=>setForm({...form, year: Number(e.target.value)})} />
          <Input label="Total Copies" type="number" value={String(form.totalCopies)} onChange={(e)=>setForm({...form, totalCopies: Number(e.target.value)})} />
          <Input label="Available Copies" type="number" value={String(form.availableCopies)} onChange={(e)=>setForm({...form, availableCopies: Number(e.target.value)})} />
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={()=>{ setBookFormOpen(false); setEditing(null); setForm({ title: '', author: '', isbn: '', year: new Date().getFullYear(), totalCopies: 1, availableCopies: 1 }); }}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
          </div>
          {error && <div className="text-red-600">{error}</div>}
        </form>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
