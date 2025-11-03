import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategories,
  deleteCategory as deleteCategoryApi
} from "../../services/CategoryService";


function CategoryList() {
  return (
    <div className="category-list">
      <h2>Category List</h2>
      {/* Render the list of categories here */}
    </div>
  );
}

export default CategoryList;
