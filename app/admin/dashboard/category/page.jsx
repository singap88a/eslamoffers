'use client';
import React, { useState, useEffect } from 'react';
import CategoryTable from '../../../components/admin/Category/CategoryTable';
import CategoryFormModal from '../../../components/admin/Category/CategoryFormModal';
import ConfirmDialog from '../../../components/admin/Store/ConfirmDialog'; // Assuming a generic confirm dialog exists
import Toast from '../../../components/admin/Store/Toast'; // Assuming a generic toast notification exists

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const API_URL = 'http://147.93.126.19:8080/api/Category';

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/GetAllCategories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      showToast('Failed to fetch categories', 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`${API_URL}/DeleteCategory/${categoryToDelete}`, {
        method: 'DELETE',
      });
      fetchCategories();
      showToast('Category deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete category:', error);
      showToast('Failed to delete category', 'error');
    } finally {
      setIsConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleSave = async (category) => {
    const method = category.id ? 'PUT' : 'POST';
    const url = category.id
      ? `${API_URL}/UpdateCategory/${category.id}`
      : `${API_URL}/AddCategory`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: category.name, iconUrl: category.iconUrl }),
      });
      if (response.ok) {
        fetchCategories();
        showToast(`Category ${category.id ? 'updated' : 'added'} successfully`, 'success');
      } else {
        throw new Error(`Failed to ${category.id ? 'update' : 'add'} category`);
      }
    } catch (error) {
      console.error(error.message);
      showToast(error.message, 'error');
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">إدارة الفئات</h1>
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        إضافة فئة جديدة
      </button>
      <CategoryTable categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        category={selectedCategory}
      />
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        message="هل أنت متأكد أنك تريد حذف هذه الفئة؟"
      />
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ show: false, message: '', type: '' })}
      />
    </div>
  );
};

export default CategoryPage; 