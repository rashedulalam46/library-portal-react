import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getPublishers,
  deletePublisher as deletePublisherApi
} from "../../services/PublisherService";

function PublisherList() {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch authors
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getPublishers()
      .then(res => {
        if (!mounted) return;
        // axios returns response.data usually; adjust if your service returns differently
        setPublishers(res.data || []);
      })
      .catch(err => {
        if (!mounted) return;
        setError(err.response?.data?.message || err.message || "Failed to load publishers");
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
    const ok = window.confirm("Are you sure you want to delete this publisher?");
    if (!ok) return;

    try {
      await deletePublisherApi(id);
      // remove from UI
      setPublishers(prev => prev.filter(c => c.publisher_id !== id)); // try both id shapes
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  return (
    <div className="publisher-list">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Publishers</h2>
        <Link to="/publishers/add" className="btn btn-primary">Add Publisher</Link>
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
          {publishers.length === 0 ? (
            <div className="alert alert-info">No publishers found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {publishers.map((publisher, idx) => {
                    // adapt properties depending on your API shape
                    const id = publisher.publisher_id;
                    return (
                      <tr key={id || idx}>
                        <td>{publisher.publisher_id}</td>
                        <td>{publisher.publisher_name}</td>
                        <td>{publisher.description}</td>
                        <td>{publisher.address}</td>
                        <td>{publisher.phone}</td>
                        <td>{publisher.email}</td>
                        <td className="text-end">                         
                          <Link to={`/publishers/edit/${id}`} className="btn btn-sm btn-outline-secondary me-2">
                            Edit
                          </Link>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(publisher.publisher_id)}>
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

export default PublisherList;
