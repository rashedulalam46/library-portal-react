import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublishers, deletePublisher as deletePublisherApi } from "../../services/PublisherService";
import PublisherCreate from "./PublisherCreate";
import { showAlert, showConfirm } from "../../utils/alertService";

function PublisherList() {
  const [publishers, setPublishers] = useState([]);
  const [filteredPublishers, setFilteredPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
    const [selectedPublisher, setSelectedPublisher] = useState(null);
  
    const [searchTerm, setSearchTerm] = useState("");
  
    // Load publishers
    useEffect(() => {
      loadPublishers();
    }, []);

    const loadPublishers = () => {
      setLoading(true);
      getPublishers()
        .then((res) => {
          setPublishers(res.data || []);
          setFilteredPublishers(res.data || []);
          setError(null);
        })
        .catch((err) => {
          setError(err.response?.data?.message || err.message || "Failed to load publishers");
        })
        .finally(() => setLoading(false));
    };

    // Filter publishers based on search term
    useEffect(() => {
      if (!searchTerm) {
        setFilteredPublishers(publishers);
      } else {
        const filtered = publishers.filter(
          (c) =>
            (c.publisher_name && c.publisher_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (c.address && c.address.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredPublishers(filtered);
      }
    }, [searchTerm, publishers]);

    // Delete publisher with confirmation
    const handleDelete = async (id) => {
      const confirmed = await showConfirm("Are you sure you want to delete this publisher?", "Delete Publisher");
      if (!confirmed) return;
  
      try {
        await deletePublisherApi(id);
        const updated = publishers.filter((c) => c.publisher_id !== id);
        setPublishers(updated);
        setFilteredPublishers(updated);
        showAlert("Publisher deleted successfully!", "success");
      } catch (err) {
        showAlert(err.response?.data?.message || "Delete failed", "danger");
      }
    };
  
    // Add/Edit modal
    const handleAdd = () => {
      setSelectedPublisher(null);
      setShowModal(true);
    };

    const handleEdit = (publisher) => {
      setSelectedPublisher(publisher);
      setShowModal(true);
    };
  
    const handleSaveSuccess = () => {
      setShowModal(false);
      loadPublishers();
    };

  return (
   <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Publishers</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          Add Publisher
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <div className="text-center py-4">Loading publishers...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          {filteredPublishers.length === 0 ? (
            <div className="alert alert-info">No publishers found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>                   
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPublishers.map((publisher) => (
                    <tr key={publisher.publisher_id}>
                       <td>{publisher.publisher_id}</td>
                        <td>{publisher.publisher_name}</td>                     
                        <td>{publisher.address}</td>
                        <td>{publisher.phone}</td>
                        <td>{publisher.email}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-secondary me-3" onClick={() => handleEdit(publisher)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(publisher.publisher_id)}>
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
      <PublisherCreate
        show={showModal}
        onHide={() => setShowModal(false)}
        publisher={selectedPublisher}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}

export default PublisherList;
