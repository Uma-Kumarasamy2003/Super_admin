// src/components/layoutt/Header.js
import React from "react";
import "../../index.css";
import { LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";

const Header = () => {
  return (
    <div className="header">
      <span className="user-name">NIVETHITHA HEMACHANDRAN</span>

      <Button type="primary">
        <LogoutOutlined />
        Logout
      </Button>
    </div>
  );
};

export default Header;
