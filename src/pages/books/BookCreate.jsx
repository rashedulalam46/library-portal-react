import React, { useEffect, useState, useRef } from "react";
import { addBook as createBook, updateBook } from "../../services/BookService";
import { getAuthors, getPublishers, getCategories } from "../../services/DropdownService";
import { showAlert } from "../../utils/alertService";

function BookCreate({ show, onHide, book, onSaveSuccess }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [authors, setAuthors] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [publisher, setPublisher] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const modalRef = useRef(null);
  const bsModalRef = useRef(null);
  const initializedRef = useRef(false);

  // Load dropdown data once
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [authorRes, publisherRes, categoryRes] = await Promise.all([
          getAuthors(),
          getPublishers(),
          getCategories(),
        ]);
        setAuthors(authorRes.data || []);
        setPublishers(publisherRes.data || []);
        setCategories(categoryRes.data || []);
      } catch (err) {
        showAlert("Failed to load dropdown data", "danger");
      }
    };
    fetchDropdowns();
  }, []);

  // Load book data
  useEffect(() => {
    if (book) {
      setTitle(book.title || "");

      // author_id may be: 123 OR { value: 123, text: 'Name' } OR { id: 123, name: 'Name' }
      const normalizeId = (v) => {
        if (v == null) return "";
        if (typeof v === "object") return v.value ?? v.id ?? "";
        return v;
      };

      setAuthor(String(normalizeId(book.author_id || "") || ""));
      setCategory(String(normalizeId(book.category_id || "") || ""));
      setPublisher(String(normalizeId(book.publisher_id || "") || ""));
      setDescription(book.description || "");
    } else {
      setTitle("");
      setAuthor("");
      setCategory("");
      setPublisher("");
      setDescription("");
    }
  }, [book, show]);

  // Initialize Bootstrap modal once
  useEffect(() => {
    if (!modalRef.current || initializedRef.current) return;

    bsModalRef.current = new window.bootstrap.Modal(modalRef.current, {
      backdrop: "static",
      keyboard: true,
    });

    const handleHidden = () => onHide();
    modalRef.current.addEventListener("hidden.bs.modal", handleHidden);

    initializedRef.current = true;

    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener("hidden.bs.modal", handleHidden);
      }
    };
  }, [onHide]);

  // Show or hide modal when `show` changes
  useEffect(() => {
    if (!bsModalRef.current) return;
    if (show) bsModalRef.current.show();
    else {
      bsModalRef.current.hide();
      removeBackdrop();
    }
  }, [show]);

  // Show or hide modal when `show` changes
  useEffect(() => {
    if (!bsModalRef.current) return;
    if (show) bsModalRef.current.show();
    else {
      bsModalRef.current.hide();
      removeBackdrop();
    }
  }, [show]);

  const removeBackdrop = () => {
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove();
    document.body.classList.remove("modal-open");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      book_id: book ? book.book_id : undefined,
      title: title.trim(),
      author_id: author.trim(),
      category_id: category.trim(),
      publisher_id: publisher.trim(),
      description: description.trim(),
    };

    try {
      if (book) {
        await updateBook(book.book_id, payload);
        showAlert("Book updated successfully!", "success");
      } else {
        await createBook(payload);
        showAlert("Book created successfully!", "success");
      }

      setSaving(false);
      if (bsModalRef.current) bsModalRef.current.hide();
      removeBackdrop();
      onSaveSuccess();
    } catch (err) {
      setSaving(false);
      showAlert(err.response?.data?.message || err.message || "Failed to save book", "danger");
    }
  };


  return (
    <div
      className="modal fade"
      ref={modalRef}
      id="authorModal"
      tabIndex="-1"
      aria-labelledby="authorModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="authorModalLabel">
              {book ? "Edit Book" : "Add Book"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Book Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c, index) => (
                    <option key={index} value={c.value}>
                      {c.text}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Author</label>
                <select
                  className="form-select"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                >
                  <option value="">Select Author</option>
                  {authors.map((c, index) => (
                    <option key={index} value={c.value}>
                      {c.text}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Publisher</label>
                <select
                  className="form-select"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  required
                >
                  <option value="">Select Publisher</option>
                  {publishers.map((c, index) => (
                    <option key={index} value={c.value}>
                      {c.text}
                    </option>
                  ))}
                </select>
              </div>


              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  data-bs-dismiss="modal"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : author ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookCreate;
