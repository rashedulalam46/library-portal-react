import React, { useEffect, useState } from "react";
import { getCategories, deleteCategory as deleteCategoryApi } from "../../services/CategoryService";
import CategoryCreate from "./CategoryCreate";
import { showAlert, showConfirm } from "../../utils/alertService";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setLoading(true);
    getCategories()
      .then((res) => {
        setCategories(res.data || []);
        setFilteredCategories(res.data || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || "Failed to load categories");
      })
      .finally(() => setLoading(false));
  };

  // Filter categories based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(
        (c) =>
          (c.category_name && c.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  // Delete category with confirmation
  const handleDelete = async (id) => {
    const confirmed = await showConfirm("Are you sure you want to delete this category?", "Delete Category");
    if (!confirmed) return;

    try {
      await deleteCategoryApi(id);
      const updated = categories.filter((c) => c.category_id !== id);
      setCategories(updated);
      setFilteredCategories(updated);
      showAlert("Category deleted successfully!", "success");
    } catch (err) {
      showAlert(err.response?.data?.message || "Delete failed", "danger");
    }
  };

  // Add/Edit modal
  const handleAdd = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleSaveSuccess = () => {
    setShowModal(false);
    loadCategories();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Categories</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          Add Category
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

      {loading && <div className="text-center py-4">Loading categories...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          {filteredCategories.length === 0 ? (
            <div className="alert alert-info">No categories found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.category_id}>
                      <td>{category.category_id}</td>
                      <td>{category.category_name}</td>
                      <td>{category.description}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-secondary me-3" onClick={() => handleEdit(category)}>                        
                          Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(category.category_id)}>
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
      <CategoryCreate
        show={showModal}
        onHide={() => setShowModal(false)}
        category={selectedCategory}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}

export default CategoryList;
