// src/components/pages/authors/AuthorList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthors, deleteAuthor as deleteAuthorApi } from "../../services/AuthorService";
import AuthorCreate from "./AuthorCreate";
import { showAlert, showConfirm } from "../../utils/alertService";

function AuthorList() {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Load authors
  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = () => {
    setLoading(true);
    getAuthors()
      .then((res) => {
        setAuthors(res.data || []);
        setFilteredAuthors(res.data || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || "Failed to load authors");
      })
      .finally(() => setLoading(false));
  };

  // Filter authors based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAuthors(authors);
    } else {
      const filtered = authors.filter(
        (c) =>
          (c.author_name && c.author_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (c.address && c.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredAuthors(filtered);
    }
  }, [searchTerm, authors]);

  // Delete author with confirmation
  const handleDelete = async (id) => {
    const confirmed = await showConfirm("Are you sure you want to delete this author?", "Delete Author");
    if (!confirmed) return;

    try {
      await deleteAuthorApi(id);
      const updated = authors.filter((c) => c.author_id !== id);
      setAuthors(updated);
      setFilteredAuthors(updated);
      showAlert("Author deleted successfully!", "success");
    } catch (err) {
      showAlert(err.response?.data?.message || "Delete failed", "danger");
        }
      };
    
      // Add/Edit modal
      const handleAdd = () => {
        setSelectedAuthor(null);
        setShowModal(true);
      };

      const handleEdit = (author) => {
        setSelectedAuthor(author);
        setShowModal(true);
      };
    
      const handleSaveSuccess = () => {
        setShowModal(false);
        loadAuthors();
      };

  return (
     <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Authors</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          Add Author
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <div className="text-center py-4">Loading authors...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          {filteredAuthors.length === 0 ? (
            <div className="alert alert-info">No authors found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>        
                    <th>Country</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuthors.map((author) => (
                    <tr key={author.author_id}>
                       <td>{author.author_id}</td>
                        <td>{author.author_name}</td>
                        <td>{author.country}</td>
                        <td>{author.address}</td>
                        <td>{author.phone}</td>
                        <td>{author.email}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-secondary me-3" onClick={() => handleEdit(author)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(author.author_id)}>
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
      <AuthorCreate
        show={showModal}
        onHide={() => setShowModal(false)}
        author={selectedAuthor}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}

export default AuthorList;