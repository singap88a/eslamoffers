"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Typography, TextField, Button, Select, MenuItem, 
  FormControl, InputLabel, List, ListItem, ListItemText, Paper, 
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const API_BASE_URL = 'https://api.eslamoffers.com/api';

const AuthAdminPanel = () => {
  // State for authentication
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
  
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // State for role management
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  
  // State for user management
  const [editUserData, setEditUserData] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // UI feedback
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [openSnackbar, setOpenSnackbar] = useState(false);

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

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

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
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      showMessage('Login successful!', 'success');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Login failed', 'error');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
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
      // First find the user by email
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
      fetchAllUsers(); // Refresh users list
    } catch (error) {
      showMessage(error.response?.data || error.message || 'Failed to add role', 'error');
    }
  };

  const removeRoleFromUser = async (userId, roleName) => {
    try {
      await axios.delete(`${API_BASE_URL}/Roles/DeleteRoleFromUser/${roleName}/${userId}`);
      showMessage(`Role ${roleName} removed from user`, 'success');
      fetchAllUsers(); // Refresh users list
    } catch (error) {
      showMessage(error.response?.data || error.message || 'Failed to remove role', 'error');
    }
  };

  // User management functions
  const handleEditUser = (user) => {
    setEditUserData({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address || '',
      phoneNumber: user.phoneNamber || ''
    });
    setOpenEditDialog(true);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`${API_BASE_URL}/Account/EditUser`, {
        id: editUserData.id,
        name: editUserData.name,
        email: editUserData.email,
        address: editUserData.address,
        phoneNamber: editUserData.phoneNumber
      });
      
      showMessage('User updated successfully', 'success');
      setOpenEditDialog(false);
      fetchAllUsers();
    } catch (error) {
      showMessage(error.response?.data || 'Failed to update user', 'error');
    }
  };

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
    <Container maxWidth="lg">
      <Typography variant="h3" gutterBottom>
        Admin Panel
      </Typography>
      
      {/* Feedback Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      
      {!isAuthenticated ? (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={loginData.email}
            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={loginData.password}
            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLogin}
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Paper>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Welcome, {currentUser?.name} ({currentUser?.roles?.join(', ')})
            </Typography>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Paper>
          
          {/* Register New User (Admin only) */}
          {isAdmin && (
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Register New User
              </Typography>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={authData.name}
                onChange={(e) => setAuthData({...authData, name: e.target.value})}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={authData.email}
                onChange={(e) => setAuthData({...authData, email: e.target.value})}
              />
              {/* <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={authData.password}
                onChange={(e) => setAuthData({...authData, password: e.target.value})}
              /> */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={authData.role}
                  label="Role"
                  onChange={(e) => setAuthData({...authData, role: e.target.value})}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.name}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleRegister}
                sx={{ mt: 2 }}
              >
                Register
              </Button>
            </Paper>
          )}
          
          {/* Users List (Admin only) */}
          {isAdmin && (
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Users Management
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow >
                      <TableCell >Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Roles</TableCell>
                      {/* <TableCell>Phone</TableCell> */}
                      {/* <TableCell>Address</TableCell> */}
                      <TableCell>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.roles?.join(', ')}</TableCell>
                        {/* <TableCell>{user.phoneNamber || '-'}</TableCell>
                        <TableCell>{user.address || '-'}</TableCell> */}
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleEditUser(user)}>
                            {/* <Edit /> */}
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => {
                              setDeleteUserId(user.id);
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
            </Paper>
          )}
          
          {/* Manage User Rolesنن */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Manage User Roles
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Select User</InputLabel>
              <Select
                value={selectedUser}
                label="Select User"
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.email}>
                    {user.name} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Role</InputLabel>
              <Select
                value={selectedRole}
                label="Select Role"
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={addRoleToUser}
              sx={{ mt: 2, mb: 3 }}
              disabled={!selectedUser || !selectedRole}
            >
              Add Role to User
            </Button>
            
            <Typography variant="h6" gutterBottom>
              Current User Roles
            </Typography>
            {selectedUser && (
              <List>
                {users.find(u => u.email === selectedUser)?.roles?.map((role) => (
                  <ListItem key={role} 
                    secondaryAction={
                      <Button 
                        color="error"
                        onClick={() => removeRoleFromUser(
                          users.find(u => u.email === selectedUser).id, 
                          role
                        )}
                      >
                        Remove
                      </Button>
                    }
                  >
                    <ListItemText primary={role} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </>
      )}
      
      {/* Edit User Dialog */}
      {/* <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editUserData && (
            <>
              <TextField
                margin="dense"
                label="Name"
                fullWidth
                value={editUserData.name}
                onChange={(e) => setEditUserData({...editUserData, name: e.target.value})}
              />
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                value={editUserData.email}
                onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
              />
              <TextField
                margin="dense"
                label="Phone Number"
                fullWidth
                value={editUserData.phoneNumber}
                onChange={(e) => setEditUserData({...editUserData, phoneNumber: e.target.value})}
              />
              <TextField
                margin="dense"
                label="Address"
                fullWidth
                value={editUserData.address}
                onChange={(e) => setEditUserData({...editUserData, address: e.target.value})}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser} color="primary">Save</Button>
        </DialogActions>
      </Dialog> */}
      
      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AuthAdminPanel;