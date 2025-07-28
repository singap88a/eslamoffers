'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Paper, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Box
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';

const API_BASE_URL = 'https://api.eslamoffers.com/api';

export default function BannerManagement() {
  // State for banners
  const [banners, setBanners] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for banner form
  const [bannerData, setBannerData] = useState({
    imageUrl: null,
    link: '',
    priority: 0
  });
  
  // State for file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // State for edit/delete operations
  const [editBannerId, setEditBannerId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteBannerId, setDeleteBannerId] = useState(null);
  
  // State for feedback
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  // State for linking to store
  const [linkType, setLinkType] = useState('external'); // 'external' or 'store'
  const [selectedStore, setSelectedStore] = useState('');
  
  // Initialize token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchBanners();
      fetchStores();
    }
  }, []);
  
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/Banner/GetAllBanners`);
      setBanners(response.data);
    } catch (error) {
      showMessage('فشل في جلب البانرات', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStores = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Store/GetAllStores`);
      setStores(response.data);
    } catch (error) {
      showMessage('فشل في جلب المتاجر', 'error');
    }
  };
  
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
  
  const handleLinkTypeChange = (event) => {
    setLinkType(event.target.value);
    // Reset link value when changing type
    setBannerData({
      ...bannerData,
      link: ''
    });
    setSelectedStore('');
  };
  
  const handleStoreChange = (event) => {
    const storeId = event.target.value;
    setSelectedStore(storeId);
    // Set the link to the store URL
    setBannerData({
      ...bannerData,
      link: `/stores/${storeId}`
    });
  };
  
  const handleAddBanner = async () => {
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('ImageUrl', selectedFile);
      }
      formData.append('Link', bannerData.link);
      formData.append('Priority', bannerData.priority);
      
      await axios.post(`${API_BASE_URL}/Banner/AddBanner`, formData);
      showMessage('تم إضافة البانر بنجاح', 'success');
      resetForm();
      fetchBanners();
    } catch (error) {
      showMessage('فشل في إضافة البانر', 'error');
    }
  };
  
  const handleUpdateBanner = async () => {
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('ImageUrl', selectedFile);
      }
      formData.append('Link', bannerData.link);
      formData.append('Priority', bannerData.priority);
      
      await axios.put(`${API_BASE_URL}/Banner/UpdateBanner/${editBannerId}`, formData);
      showMessage('تم تحديث البانر بنجاح', 'success');
      setOpenDialog(false);
      resetForm();
      fetchBanners();
    } catch (error) {
      showMessage('فشل في تحديث البانر', 'error');
    }
  };
  
  const handleDeleteBanner = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/Banner/DeleteBanner/${deleteBannerId}`);
      showMessage('تم حذف البانر بنجاح', 'success');
      setOpenDeleteDialog(false);
      fetchBanners();
    } catch (error) {
      showMessage('فشل في حذف البانر', 'error');
    }
  };
  
  const openEditDialog = (banner) => {
    setEditBannerId(banner.id);
    setBannerData({
      link: banner.link,
      priority: banner.priority
    });
    
    // Determine if link is to a store or external
    if (banner.link && banner.link.startsWith('/stores/')) {
      setLinkType('store');
      const storeId = banner.link.replace('/stores/', '');
      setSelectedStore(storeId);
    } else {
      setLinkType('external');
      setSelectedStore('');
    }
    
    setPreviewUrl(banner.imageUrl ? `https://api.eslamoffers.com/uploads/${banner.imageUrl}` : '');
    setOpenDialog(true);
  };
  
  const resetForm = () => {
    setBannerData({
      imageUrl: null,
      link: '',
      priority: 0
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setEditBannerId(null);
    setLinkType('external');
    setSelectedStore('');
  };
  
  const showMessage = (msg, sev) => {
    setMessage(msg);
    setSeverity(sev);
    setOpenSnackbar(true);
  };
  
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  
  return (
    <Container maxWidth="lg" dir="rtl">
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        إدارة البانرات
      </Typography>
      
      {/* Feedback Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      
      {/* Add Banner Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editBannerId ? 'تعديل البانر' : 'إضافة بانر جديد'}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="banner-image-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="banner-image-upload">
            <Button variant="contained" component="span">
              اختر صورة البانر
            </Button>
          </label>
          {previewUrl && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img src={previewUrl} alt="معاينة البانر" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </Box>
          )}
        </Box>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>نوع الرابط</InputLabel>
          <Select
            value={linkType}
            label="نوع الرابط"
            onChange={handleLinkTypeChange}
          >
            <MenuItem value="external">رابط خارجي</MenuItem>
            <MenuItem value="store">متجر</MenuItem>
          </Select>
        </FormControl>
        
        {linkType === 'external' ? (
          <TextField
            label="الرابط"
            fullWidth
            margin="normal"
            value={bannerData.link}
            onChange={(e) => setBannerData({...bannerData, link: e.target.value})}
          />
        ) : (
          <FormControl fullWidth margin="normal">
            <InputLabel>اختر المتجر</InputLabel>
            <Select
              value={selectedStore}
              label="اختر المتجر"
              onChange={handleStoreChange}
            >
              {stores.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        
        <TextField
          label="الأولوية"
          type="number"
          fullWidth
          margin="normal"
          value={bannerData.priority}
          onChange={(e) => setBannerData({...bannerData, priority: parseInt(e.target.value) || 0})}
        />
        
        <Button
          variant="contained"
          color="primary"
          onClick={editBannerId ? handleUpdateBanner : handleAddBanner}
          sx={{ mt: 2 }}
        >
          {editBannerId ? 'تحديث البانر' : 'إضافة البانر'}
        </Button>
        
        {editBannerId && (
          <Button
            variant="outlined"
            onClick={resetForm}
            sx={{ mt: 2, mr: 2 }}
          >
            إلغاء
          </Button>
        )}
      </Paper>
      
      {/* Banners List */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          قائمة البانرات
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography>جاري التحميل...</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>الصورة</TableCell>
                  <TableCell>الرابط</TableCell>
                  <TableCell>الأولوية</TableCell>
                  <TableCell>تاريخ الإنشاء</TableCell>
                  <TableCell>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      {banner.imageUrl ? (
                        <img 
                          src={`https://api.eslamoffers.com/uploads/${banner.imageUrl}`} 
                          alt="صورة البانر" 
                          style={{ width: '100px', height: 'auto' }} 
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">لا توجد صورة</Typography>
                      )}
                    </TableCell>
                    <TableCell>{banner.link}</TableCell>
                    <TableCell>{banner.priority}</TableCell>
                    <TableCell>{new Date(banner.createdAt).toLocaleDateString('ar-EG')}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => openEditDialog(banner)}>
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => {
                          setDeleteBannerId(banner.id);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Delete Banner Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>هل أنت متأكد من حذف هذا البانر؟</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>إلغاء</Button>
          <Button onClick={handleDeleteBanner} color="error">حذف</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
