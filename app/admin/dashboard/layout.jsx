// import Sidebar from '../app/components/admin/Sidebar';
import Sidebar from '../../components/admin/Sidebar';

import React from 'react';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
};

export default AdminLayout; 