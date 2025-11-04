import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks, deleteBook as deleteBookApi } from "../../services/BookService";
import BookCreate from "./BookCreate";
import { showAlert, showConfirm } from "../../utils/alertService";

function BookList() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Load books
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    setLoading(true);
    getBooks()
      .then((res) => {
        setBooks(res.data || []);
        setFilteredBooks(res.data || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || "Failed to load books");
      })
      .finally(() => setLoading(false));
  };

  // Filter books based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(
        (c) =>
          (c.title && c.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (c.author_name && c.author_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (c.category_name && c.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (c.publisher_name && c.publisher_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredBooks(filtered);
    }
  }, [searchTerm, books]);

  // Delete book with confirmation
  const handleDelete = async (id) => {
    const confirmed = await showConfirm("Are you sure you want to delete this book?", "Delete Book");
    if (!confirmed) return;

    try {
      await deleteBookApi(id);
      const updated = books.filter((c) => c.book_id !== id);
      setBooks(updated);
      setFilteredBooks(updated);
      showAlert("Book deleted successfully!", "success");
    } catch (err) {
      showAlert(err.response?.data?.message || "Delete failed", "danger");
    }
  };

  // Add/Edit modal
  const handleAdd = () => {
    setSelectedBook(null);
    setShowModal(true);
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleSaveSuccess = () => {
    setShowModal(false);
    loadBooks();
  };



  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Books</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          Add Book
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title, author, category, or publisher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <div className="text-center py-4">Loading books...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          {filteredBooks.length === 0 ? (
            <div className="alert alert-info">No books found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Publisher</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book.book_id}>
                      <td>{book.book_id}</td>
                      <td>{book.title}</td>
                      <td>{book.description}</td>
                      <td>{book.author_name}</td>
                      <td>{book.category_name}</td>
                      <td>{book.publisher_name}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-secondary me-3" onClick={() => handleEdit(book)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(book.book_id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <BookCreate
        show={showModal}
        onHide={() => setShowModal(false)}
        book={selectedBook}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}

export default BookList;