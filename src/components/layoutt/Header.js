// src/components/layoutt/Header.js
import React from 'react';
import '../../index.css';
import { LogoutOutlined } from '@ant-design/icons';

const Header = () => {
  return (
    <div className="header">
      
      <span className="user-name">NIVETHITHA HEMACHANDRAN</span>
      <div className="header-buttons">
        <button className="logout-button">
          <LogoutOutlined style={{ paddingRight: '8px' }} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
