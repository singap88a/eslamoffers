'use client';
import React, { useState, useEffect } from 'react';
import CategoryTable from '../../../components/admin/Category/CategoryTable';
import CategoryFormModal from '../../../components/admin/Category/CategoryFormModal';
import ConfirmDialog from '../../../components/admin/Store/ConfirmDialog'; // Assuming a generic confirm dialog exists
import Toast from '../../../components/admin/Store/Toast'; // Assuming a generic toast notification exists
import { FaPlus } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';

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
      const response = await fetch('http://147.93.126.19:8080/api/Category/GetAllCategories');
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

  const handleSave = async (category, imageFile) => {
    const method = category.id ? 'PUT' : 'POST';
    const url = category.id
      ? `${API_URL}/UpdateCategory/${category.id}`
      : `${API_URL}/AddCategory`;
    try {
      const formData = new FormData();
      formData.append('Name', category.name);
      if (imageFile) {
        formData.append('IconUrl', imageFile);
      } else if (category.iconUrl) {
        formData.append('IconUrl', category.iconUrl);
      }
      const response = await fetch(url, {
        method,
        body: formData,
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
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">إدارة الفئات</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-[#14b8a6] text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-[#11a394] transition-all duration-300 font-semibold"
          >
            <FiPlus size={20} />
            <span>إضافة فئة جديدة</span>
          </button>
        </div>
        {/* Toast for error/success messages */}
        {toast.message && (
          <div className={`mb-4 p-4 rounded-md border-l-4 ${toast.type === 'error' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700'}`}>
            <p className="font-bold">{toast.type === 'error' ? 'خطأ' : 'نجاح'}</p>
            <p>{toast.message}</p>
          </div>
        )}
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
    </div>
  );
};

export default CategoryPage; 