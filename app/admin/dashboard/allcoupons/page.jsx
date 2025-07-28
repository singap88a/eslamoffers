'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Delete, Edit, Close, CloudUpload } from '@mui/icons-material';

const API_BASE_URL = 'https://api.eslamoffers.com/api';

const CouponsAdminPanel = () => {
  // State management
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  
  // Edit coupon state
  const [editCoupon, setEditCoupon] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Delete coupon state
  const [deleteCouponId, setDeleteCouponId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // UI feedback
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Get token from cookies
  const getTokenFromCookies = () => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
      return tokenCookie ? tokenCookie.split('=')[1] : '';
    }
    return '';
  };

  // Initialize token from cookies
  useEffect(() => {
    const tokenFromCookies = getTokenFromCookies();
    if (!tokenFromCookies) {
      window.location.href = '/admin/login';
    }
    setToken(tokenFromCookies);
  }, []);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCoupons();
    }
  }, [token]);

  // Response interceptor for handling 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Auto-hide snackbar after 3 seconds
  useEffect(() => {
    if (openSnackbar) {
      const timer = setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [openSnackbar]);

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/Coupons/GetAllCoupons`);
      setCoupons(response.data);
    } catch (error) {
      showMessage('Failed to fetch coupons', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update coupon
  const handleUpdateCoupon = async () => {
    try {
      const formData = new FormData();
      
      // Append all fields to formData
      formData.append('Title', editCoupon.title);
      formData.append('Description', editCoupon.descriptionCoupon);
      formData.append('Discount', editCoupon.discount);
      formData.append('CouponCode', editCoupon.couponCode);
      formData.append('StratDate', editCoupon.stratDate);
      formData.append('EndDate', editCoupon.endDate);
      formData.append('IsActive', editCoupon.isActive);
      formData.append('IsBest', editCoupon.isBest);
      formData.append('LinkRealStore', editCoupon.linkRealStore);
      formData.append('StoreId', editCoupon.storeId);
      formData.append('categoryId', editCoupon.categoryId);
      
      if (selectedFile) {
        formData.append('ImageUrl', selectedFile);
      }

      await axios.put(`${API_BASE_URL}/Coupons/UpdateCoupon/${editCoupon.id}`, formData);
      
      showMessage('Coupon updated successfully', 'success');
      setOpenEditModal(false);
      fetchCoupons();
    } catch (error) {
      showMessage(error.response?.data || 'Failed to update coupon', 'error');
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/Coupons/DeleteCoupons/${deleteCouponId}`);
      showMessage('Coupon deleted successfully', 'success');
      setOpenDeleteDialog(false);
      fetchCoupons();
    } catch (error) {
      showMessage(error.response?.data || 'Failed to delete coupon', 'error');
    }
  };

  // Open edit dialog
  const openEditDialog = (coupon) => {
    setEditCoupon({
      ...coupon,
      descriptionCoupon: coupon.descriptionCoupon || ''
    });
    setPreviewUrl(coupon.imageUrl ? `https://api.eslamoffers.com/uploads/${coupon.imageUrl}` : '');
    setOpenEditModal(true);
  };

  // Show message
  const showMessage = (msg, sev) => {
    setMessage(msg);
    setSeverity(sev);
    setOpenSnackbar(true);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-teal-600">Coupons Management</h1>
      
      {/* Feedback Snackbar */}
      {openSnackbar && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 ${
          severity === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          <div className="flex justify-between items-center">
            <span>{message}</span>
            <button onClick={() => setOpenSnackbar(false)} className="ml-4 cursor-pointer">
              <Close className="text-lg" />
            </button>
          </div>
        </div>
      )}
      
      {/* Coupons List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-teal-600">All Coupons</h2>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No coupons available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.imageUrl ? (
                        <img 
                          src={`https://api.eslamoffers.com/uploads/${coupon.imageUrl}`} 
                          alt="Coupon" 
                          className="h-16 w-16 object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-medium">{coupon.title}</div>
                      <div className="text-sm text-gray-500 truncate">{coupon.descriptionCoupon}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      {coupon.couponCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                        {coupon.discount}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div>Start: {formatDate(coupon.stratDate)}</div>
                      <div>End: {formatDate(coupon.endDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {coupon.isBest && (
                        <span className="ml-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditDialog(coupon)}
                        className="text-teal-600 hover:text-teal-900 mr-3 p-1 rounded-full hover:bg-teal-50 cursor-pointer transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit className="text-xl" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteCouponId(coupon.id);
                          setOpenDeleteDialog(true);
                        }}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 cursor-pointer transition-colors duration-200"
                        title="Delete"
                      >
                        <Delete className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Edit Coupon Modal */}
      {openEditModal && editCoupon && (
        <div className="fixed inset-0 bg-[#00000098] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-teal-600">Edit Coupon</h2>
              <button 
                onClick={() => setOpenEditModal(false)} 
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <Close />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {previewUrl ? (
                        <div className="relative">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="mx-auto h-40 w-auto rounded-lg object-contain border border-gray-200"
                          />
                          <button
                            onClick={() => {
                              setPreviewUrl('');
                              setSelectedFile(null);
                            }}
                            className="absolute top-0 left-0 bg-red-500 text-white rounded-full p-1 -translate-x-1/2 -translate-y-1/2 shadow-md hover:bg-red-600 cursor-pointer"
                          >
                            <Close className="text-sm" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <CloudUpload className="text-4xl text-gray-400 mb-3" />
                          <label className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg inline-flex items-center transition-colors duration-200">
                            Upload New Image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      value={editCoupon.couponCode}
                      onChange={(e) => setEditCoupon({...editCoupon, couponCode: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      value={editCoupon.discount}
                      onChange={(e) => setEditCoupon({...editCoupon, discount: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Link</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      value={editCoupon.linkRealStore}
                      onChange={(e) => setEditCoupon({...editCoupon, linkRealStore: e.target.value})}
                    />
                  </div>
                </div>
                
                {/* Right Column */}
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      value={editCoupon.title}
                      onChange={(e) => setEditCoupon({...editCoupon, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      rows="3"
                      value={editCoupon.descriptionCoupon}
                      onChange={(e) => setEditCoupon({...editCoupon, descriptionCoupon: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        value={editCoupon.stratDate.split('.')[0]}
                        onChange={(e) => setEditCoupon({...editCoupon, stratDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        value={editCoupon.endDate.split('.')[0]}
                        onChange={(e) => setEditCoupon({...editCoupon, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 mb-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        checked={editCoupon.isActive}
                        onChange={(e) => setEditCoupon({...editCoupon, isActive: e.target.checked})}
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                    
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        checked={editCoupon.isBest}
                        onChange={(e) => setEditCoupon({...editCoupon, isBest: e.target.checked})}
                      />
                      <span className="ml-2 text-sm text-gray-700">Featured</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setOpenEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCoupon}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg cursor-pointer transition-colors duration-200"
                >
                  Update Coupon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      {openDeleteDialog && (
        <div className="fixed inset-0 bg-[#00000098] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
              <button 
                onClick={() => setOpenDeleteDialog(false)} 
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <Close />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Delete className="text-red-600 text-3xl" />
                </div>
              </div>
              <p className="text-gray-600 text-center">Are you sure you want to delete this coupon? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setOpenDeleteDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCoupon}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsAdminPanel;