'use client';
import React, { useState, useEffect } from 'react';
import CategoryTable from '../../../components/admin/Category/CategoryTable';
import CategoryFormModal from '../../../components/admin/Category/CategoryFormModal';
import ConfirmDialog from '../../../components/admin/Store/ConfirmDialog';
import Toast from '../../../components/admin/Store/Toast';
import { FaPlus } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const API_URL = 'https://api.eslamoffers.com/api/Category';

  // Function to get token from cookies
  const getToken = () => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'token') return value;
      }
    }
    return null;
  };

  const fetchCategories = async () => {
    const token = getToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const response = await fetch('https://api.eslamoffers.com/api/Category/GetAllCategories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        // Unauthorized - token expired or invalid
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      showToast('Failed to fetch categories', 'error');
    } finally {
      setIsLoading(false);
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
    const token = getToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    const token = getToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const token = getToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setCategoryToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const token = getToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/DeleteCategory/${categoryToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/admin/login');
        return;
      }

      if (!response.ok) throw new Error('Failed to delete category');

      fetchCategories();
      showToast('تم حذف الفئة بنجاح', 'success');
    } catch (error) {
      console.error('Failed to delete category:', error);
      showToast('فشل في حذف الفئة', 'error');
    } finally {
      setIsConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleSave = async (category, imageFile, tagsInput) => {
    const token = getToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const method = category.id ? 'PUT' : 'POST';
    const url = category.id
      ? `${API_URL}/UpdateCategory/${category.id}`
      : `${API_URL}/AddCategory`;
      
    try {
      const formData = new FormData();
      formData.append('Name', category.name);
      formData.append('Slug', category.slug);
      formData.append('AltText', category.altText || '');
      if (imageFile) {
        formData.append('IconUrl', imageFile);
      } else if (category.iconUrl) {
        formData.append('IconUrl', category.iconUrl);
      }

      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/admin/login');
        return;
      }

      if (!response.ok) throw new Error(`Failed to ${category.id ? 'update' : 'add'} category`);

      // Handle tags separately
      if (tagsInput && tagsInput.trim().length > 0) {
        const categoryId = category.id;
        try {
          if (!categoryId) {
            // For new categories, we need to get the ID from the response
            const responseData = await response.json();
            if (responseData.id) {
              console.log('New category created with ID:', responseData.id);
              await addTagsToCategory(responseData.id, tagsInput.trim());
            } else {
              console.error('No ID returned from category creation');
            }
          } else {
            // For existing categories, update tags
            console.log('Updating tags for existing category:', categoryId);
            await updateCategoryTags(categoryId, tagsInput.trim());
          }
        } catch (tagError) {
          console.error('Error handling tags:', tagError);
          showToast(`تم ${category.id ? 'تحديث' : 'إضافة'} الفئة بنجاح، لكن فشل في حفظ الوسوم`, 'warning');
        }
      }

      fetchCategories();
      showToast(`تم ${category.id ? 'تحديث' : 'إضافة'} الفئة بنجاح`, 'success');
    } catch (error) {
      console.error(error.message);
      showToast(error.message, 'error');
    } finally {
      setIsModalOpen(false);
    }
  };

  const addTagsToCategory = async (categoryId, tags) => {
    const token = getToken();
    if (!token) return;

    try {
      console.log(`Adding tags to category ${categoryId}:`, tags);
      const response = await fetch(`${API_URL}/AddTagsToCategory/${categoryId}?tags=${encodeURIComponent(tags)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to add tags to category:', response.status, errorText);
        throw new Error(`Failed to add tags: ${response.status}`);
      } else {
        console.log('Tags added successfully to category:', categoryId);
      }
    } catch (error) {
      console.error('Error adding tags to category:', error);
      throw error;
    }
  };

  const updateCategoryTags = async (categoryId, tags) => {
    const token = getToken();
    if (!token) return;

    try {
      console.log(`Updating tags for category ${categoryId}:`, tags);
      const response = await fetch(`${API_URL}/UpdateCategoryTag/${categoryId}?tags=${encodeURIComponent(tags)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to update category tags:', response.status, errorText);
        throw new Error(`Failed to update tags: ${response.status}`);
      } else {
        console.log('Tags updated successfully for category:', categoryId);
      }
    } catch (error) {
      console.error('Error updating category tags:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4 md:p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14b8a6]"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">إدارة الفئات</h1>
          <button
            onClick={handleAdd}
            className="flex items-center cursor-pointer gap-2 bg-[#14b8a6] text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-[#11a394] transition-all duration-300 font-semibold"
          >
            <FiPlus size={20} />
            <span>إضافة فئة جديدة</span>
          </button>
        </div>
        
        {toast.show && (
          <div className={`mb-4 p-4 rounded-md border-l-4 ${
            toast.type === 'error' ? 'bg-red-100 border-red-500 text-red-700' : 
            toast.type === 'warning' ? 'bg-yellow-100 border-yellow-500 text-yellow-700' :
            'bg-green-100 border-green-500 text-green-700'
          }`}>
            <p className="font-bold">
              {toast.type === 'error' ? 'خطأ' : 
               toast.type === 'warning' ? 'تحذير' : 
               'نجاح'}
            </p>
            <p>{toast.message}</p>
          </div>
        )}
        
        <CategoryTable 
          categories={categories} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
        
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
      </div>
    </div>
  );
};

export default CategoryPage;