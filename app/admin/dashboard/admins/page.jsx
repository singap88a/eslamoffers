"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Delete, Edit, Close, PersonAdd, Login, Logout } from '@mui/icons-material';

const API_BASE_URL = 'https://api.eslamoffers.com/api';

const AuthAdminPanel = () => {
  // Authentication state
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User'
  });
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [token, setToken] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Role management state
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  
  // User management state
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // UI feedback
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Initialize token from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token') || '';
      setToken(storedToken);
    }
  }, []);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
      fetchRoles();
      fetchAllUsers();
    }
  }, [token]);

  useEffect(() => {
    if (currentUser) {
      setIsAdmin(currentUser.roles?.includes('admin'));
    }
  }, [currentUser]);

  // Auto-hide snackbar after 3 seconds
  useEffect(() => {
    if (openSnackbar) {
      const timer = setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [openSnackbar]);

  const showMessage = (msg, sev) => {
    setMessage(msg);
    setSeverity(sev);
    setOpenSnackbar(true);
  };

  // Authentication functions
  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Authenticate/Register`, {
        name: authData.name,
        email: authData.email,
        password: authData.password,
        role: authData.role
      });
      
      showMessage('User registered successfully!', 'success');
      setAuthData({
        name: '',
        email: '',
        password: '',
        role: 'User'
      });
      fetchAllUsers();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Registration failed', 'error');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Authenticate/Login`, {
        email: loginData.email,
        password: loginData.password
      });
      
      setToken(response.data.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
      }
      setIsAuthenticated(true);
      showMessage('Login successful!', 'success');
      setLoginData({ email: '', password: '' });
    } catch (error) {
      showMessage(error.response?.data?.message || 'Login failed', 'error');
    }
  };

  const handleLogout = () => {
    setToken('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsAdmin(false);
    showMessage('Logged out successfully', 'info');
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Account/GetUser`);
      setCurrentUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch current user', error);
    }
  };

  // Role management functions
  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Roles/GetRoles`);
      setRoles(response.data);
    } catch (error) {
      showMessage('Failed to fetch roles', 'error');
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Account/GetUsers`);
      setUsers(response.data);
    } catch (error) {
      showMessage('Failed to fetch users', 'error');
    }
  };

  const addRoleToUser = async () => {
    try {
      const user = users.find(u => u.email === selectedUser);
      if (!user) {
        throw new Error('User not found');
      }
      
      await axios.post(`${API_BASE_URL}/Roles/AddRolesToUser`, {
        UserId: user.id,
        RoleName: selectedRole
      }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      showMessage(`Role ${selectedRole} added to user ${selectedUser}`, 'success');
      setSelectedUser('');
      setSelectedRole('');
      fetchAllUsers();
    } catch (error) {
      showMessage(error.response?.data || error.message || 'Failed to add role', 'error');
    }
  };

  const removeRoleFromUser = async (userId, roleName) => {
    try {
      await axios.delete(`${API_BASE_URL}/Roles/DeleteRoleFromUser/${roleName}/${userId}`);
      showMessage(`Role ${roleName} removed from user`, 'success');
      fetchAllUsers();
    } catch (error) {
      showMessage(error.response?.data || error.message || 'Failed to remove role', 'error');
    }
  };

  // User management functions
  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/Account/DeleteUser/${deleteUserId}`);
      showMessage('User deleted successfully', 'success');
      setOpenDeleteDialog(false);
      fetchAllUsers();
    } catch (error) {
      showMessage(error.response?.data || 'Failed to delete user', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-teal-600">Admin Panel</h1>
      
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
      
      {!isAuthenticated ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-teal-600">Login</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            />
          </div>
          <button 
            className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200"
            onClick={handleLogin}
          >
            <Login className="mr-2" />
            Login
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-teal-600">
                  Welcome, <span className="font-bold">{currentUser?.name}</span>
                </h2>
                <p className="text-gray-600">
                  Roles: <span className="font-medium">{currentUser?.roles?.join(', ')}</span>
                </p>
              </div>
              <button 
                className="flex items-center text-red-600 hover:text-red-800 px-3 py-1 border border-red-600 hover:border-red-800 rounded-lg cursor-pointer transition-colors duration-200"
                onClick={handleLogout}
              >
                <Logout className="mr-1" />
                Logout
              </button>
            </div>
          </div>
          
          {/* Register New User (Admin only) */}
          {isAdmin && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-teal-600">Register New User</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    value={authData.name}
                    onChange={(e) => setAuthData({...authData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    value={authData.email}
                    onChange={(e) => setAuthData({...authData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 cursor-pointer"
                  value={authData.role}
                  onChange={(e) => setAuthData({...authData, role: e.target.value})}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer transition-colors duration-200"
                onClick={handleRegister}
              >
                <PersonAdd className="mr-2" />
                Register User
              </button>
            </div>
          )}
          
          {/* Users List (Admin only) */}
          {isAdmin && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-teal-600">Users Management</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {user.roles?.map((role) => (
                              <span key={role} className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setDeleteUserId(user.id);
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
            </div>
          )}
          
          {/* Manage User Roles */}
          {isAdmin && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-teal-600">Manage User Roles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 cursor-pointer"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.email}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 cursor-pointer"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg mb-6 cursor-pointer transition-colors duration-200 disabled:opacity-50"
                onClick={addRoleToUser}
                disabled={!selectedUser || !selectedRole}
              >
                Add Role to User
              </button>
              
              {selectedUser && (
                <div>
                  <h3 className="text-lg font-medium mb-2 text-teal-600">Current User Roles</h3>
                  <div className="space-y-2">
                    {users.find(u => u.email === selectedUser)?.roles?.map((role) => (
                      <div key={role} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium">{role}</span>
                        <button
                          onClick={() => removeRoleFromUser(
                            users.find(u => u.email === selectedUser).id, 
                            role
                          )}
                          className="text-red-600 hover:text-red-800 px-3 py-1 rounded-lg border border-red-600 hover:border-red-800 cursor-pointer transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      {/* Delete User Dialog */}
      {openDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              <p className="text-gray-600 text-center">Are you sure you want to delete this user? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setOpenDeleteDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
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

export default AuthAdminPanel;