import React from 'react';
import '../../index.css';
import {
  DatabaseFilled,
  MedicineBoxOutlined,
  UsergroupDeleteOutlined,
  UnorderedListOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Sidebar = ({ toggleSidebar, collapsed }) => {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="menu-toggle" onClick={toggleSidebar}>
        {collapsed ? <UnorderedListOutlined  style={{paddingRight:'13px'}}/> : <LeftOutlined/>}
      </button>
      <div className="sidebar-header">
        {!collapsed && <h2 className="sidebar-title">RadiolinQ</h2>}
        {!collapsed && <p className="admin-label">SUPER ADMIN</p>}
      </div>
      <nav className="nav-links">
        <Link to="/superadmin/admin"><DatabaseFilled /> {!collapsed && <span>Admin</span>}</Link>
        <Link to="/superadmin/cases"><DatabaseFilled /> {!collapsed && <span>Cases</span>}</Link>
        <Link to="/superadmin/scancenters"><MedicineBoxOutlined /> {!collapsed && <span>Scan Centers</span>}</Link>
        <Link to="/superadmin/doctors"><UsergroupDeleteOutlined /> {!collapsed && <span>Doctors</span>}</Link>
        <Link to="/superadmin/adminfeatures"><UsergroupDeleteOutlined /> {!collapsed && <span>Admin Features</span>}</Link>
        <Link to="/superadmin/doctorfeatures"><UsergroupDeleteOutlined /> {!collapsed && <span>Doctor Features</span>}</Link>
        <Link to="/superadmin/metadata"><UsergroupDeleteOutlined /> {!collapsed && <span>Meta Data</span>}</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
