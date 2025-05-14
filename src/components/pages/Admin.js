import React, { useState, useEffect } from "react";
import "../styles/admin_doctor.css";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Table, Select, message } from "antd";

const { Option } = Select;

const Admin = () => {
  const [adminData, setAdminData] = useState(() => {
    const savedAdmins = localStorage.getItem("adminData");
    return savedAdmins ? JSON.parse(savedAdmins) : [];
  });

  const [featureOptions, setFeatureOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phone: "",
    specialization: "",
    address: "",
    features: [],
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("adminData", JSON.stringify(adminData));
  }, [adminData]);

  useEffect(() => {
    const storedFeatures = localStorage.getItem("features");
    if (storedFeatures) {
      setFeatureOptions(JSON.parse(storedFeatures));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedAdmin = { ...newAdmin, [name]: value };

    if (name === "firstName" || name === "lastName") {
      updatedAdmin.name = `${updatedAdmin.firstName || ""} ${updatedAdmin.lastName || ""}`.trim();
    }

    setNewAdmin(updatedAdmin);
  };

  const handleFeatureSelect = (value) => {
    setNewAdmin({ ...newAdmin, features: value });
  };

  const openAddModal = () => {
    setNewAdmin({
      firstName: "",
      lastName: "",
      name: "",
      email: "",
      phone: "",
      specialization: "",
      address: "",
      features: [],
    });
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleAddOrUpdateAdmin = () => {
    const { name, email, phone, specialization, address } = newAdmin;

    if (!name || !email || !phone || !specialization || !address) {
      alert("Please fill in all fields.");
      return;
    }

    if (!isEditMode) {
      const duplicate = adminData.find(
        (admin) => admin.email === email || admin.phone === phone
      );
      if (duplicate) {
        alert("Email or phone already exists.");
        return;
      }

      // Generate next sequential ADM ID
      const maxIdNumber = adminData.reduce((max, admin) => {
        const match = admin.id?.match(/^ADM(\d+)$/);
        const num = match ? parseInt(match[1], 10) : 0;
        return Math.max(max, num);
      }, 0);

      const newId = `ADM${maxIdNumber + 1}`;
      setAdminData([...adminData, { ...newAdmin, id: newId }]);
      message.success("Admin added successfully!");
      
    } else {
      const updatedData = adminData.map((admin) =>
        admin.id === editingId ? { ...newAdmin, id: editingId } : admin
      );
      setAdminData(updatedData);
      message.success("Admin updated successfully!");
      
    }

    setShowModal(false);
    setNewAdmin({
      firstName: "",
      lastName: "",
      name: "",
      email: "",
      phone: "",
      specialization: "",
      address: "",
      features: [],
    });
    setEditingId(null);
  };

  const handleEdit = (record) => {
    const [firstName, ...lastParts] = record.name.split(" ");
    const lastName = lastParts.join(" ");

    setNewAdmin({
      ...record,
      firstName,
      lastName,
    });

    setEditingId(record.id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const filtered = adminData.filter((admin) => admin.id !== id);
    setAdminData(filtered);
    message.success("Admin added successfully!");
    
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Specialization", dataIndex: "specialization", key: "specialization" },
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span style={{ color: "#085cda", cursor: "pointer", fontSize: "15px" }}>
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ marginRight: "10px" }}
          />
          <DeleteOutlined onClick={() => handleDelete(record.id)} />
        </span>
      ),
    },
  ];

  return (
    
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admins</h2>
        <button className="add-admin-btn" onClick={openAddModal}>
          <PlusOutlined style={{ paddingRight: "5px" }} /> Add Admin
        </button>
      </div>

      <Table
        columns={columns}
        dataSource={adminData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{isEditMode ? "Edit Admin" : "Add Admin"}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={newAdmin.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={newAdmin.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newAdmin.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={newAdmin.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={newAdmin.specialization}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={newAdmin.address}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group full-width">
                <label>Features</label>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Select Features"
                  value={newAdmin.features}
                  onChange={handleFeatureSelect}
                  style={{ width: "100%" }}
                >
                  {featureOptions.map((feature) => (
                    <Option key={feature.name} value={feature.name}>
                      {feature.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={handleAddOrUpdateAdmin}>
                {isEditMode ? "Update" : "Add"}
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
