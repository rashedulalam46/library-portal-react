// src/components/pages/authors/AuthorList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAuthors,
  deleteAuthor as deleteAuthorApi
} from "../../services/AuthorService";

function AuthorList() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch authors
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getAuthors()
      .then(res => {
        if (!mounted) return;
        // axios returns response.data usually; adjust if your service returns differently
        setAuthors(res.data || []);
      })
      .catch(err => {
        if (!mounted) return;
        setError(err.response?.data?.message || err.message || "Failed to load authors");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this author?");
    if (!ok) return;

    try {
      await deleteAuthorApi(id);
      // remove from UI
      setAuthors(prev => prev.filter(a => a.author_id !== id)); // try both id shapes
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  return (
    <div className="author-list">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Authors</h2>
        <Link to="/authors/add" className="btn btn-primary">Add Author</Link>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border" role="status" aria-hidden="true"></div>
          <div className="mt-2">Loading authors...</div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {authors.length === 0 ? (
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
                  {authors.map((author, idx) => {
                    // adapt properties depending on your API shape
                    const id = author.authorId;
                    return (
                      <tr key={id || idx}>
                        <td>{author.author_id}</td>
                        <td>{author.author_name}</td>
                        <td>{author.country}</td>
                        <td>{author.address}</td>
                        <td>{author.phone}</td>
                        <td>{author.email}</td>
                        <td className="text-end">                          
                          <Link to={`/authors/edit/${id}`} className="btn btn-sm btn-outline-secondary me-2">
                            Edit
                          </Link>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(author.author_id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AuthorList;