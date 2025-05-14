import React, { useState, useEffect } from "react";
import "../styles/admin_doctor.css";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Table, Select, message } from "antd"; // ✅ Import message from antd

const { Option } = Select;

const Doctors = () => {
  const [doctorData, setDoctorData] = useState(() => {
    const savedDoctors = localStorage.getItem("doctorData");
    return savedDoctors ? JSON.parse(savedDoctors) : [];
  });

  const [featureOptions, setFeatureOptions] = useState([]);
  const [adminOptions, setAdminOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    address: "",
    features: [],
    adminName: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("doctorData", JSON.stringify(doctorData));
  }, [doctorData]);

  useEffect(() => {
    const storedFeatures = localStorage.getItem("features");
    if (storedFeatures) {
      setFeatureOptions(JSON.parse(storedFeatures));
    }

    const storedAdmins = localStorage.getItem("adminData");
    if (storedAdmins) {
      const admins = JSON.parse(storedAdmins);
      const adminNames = admins.map((admin) => admin.name);
      setAdminOptions(adminNames);
    }
  }, []);

  const handleChange = (e) => {
    setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
  };

  const handleFeatureSelect = (value) => {
    setNewDoctor({ ...newDoctor, features: value });
  };

  const handleAdminSelect = (value) => {
    setNewDoctor({ ...newDoctor, adminName: value });
  };

  const openAddModal = () => {
    setNewDoctor({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialization: "",
      address: "",
      features: [],
      adminName: "",
    });
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleAddOrUpdateAdmin = () => {
    const { firstName, lastName, email, phone, specialization, address, adminName } = newDoctor;

    if (!firstName || !lastName || !email || !phone || !specialization || !address || !adminName) {
      message.warning("Please fill in all fields.");
      return;
    }

    const fullName = `${firstName} ${lastName}`;

    if (!isEditMode) {
      const duplicate = doctorData.find(
        (doctor) => doctor.email === email || doctor.phone === phone
      );
      if (duplicate) {
        message.error("Email or phone already exists.");
        return;
      }

      const newId = `DOC${doctorData.length + 1}`;
      setDoctorData([...doctorData, { ...newDoctor, name: fullName, id: newId }]);
      message.success("Doctor added successfully!");
    } else {
      const updatedData = doctorData.map((doctor) =>
        doctor.id === editingId ? { ...newDoctor, name: fullName, id: editingId } : doctor
      );
      setDoctorData(updatedData);
      message.success("Doctor updated successfully!");
    }

    setShowModal(false);
    setNewDoctor({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialization: "",
      address: "",
      features: [],
      adminName: "",
    });
    setEditingId(null);
  };

  const handleEdit = (record) => {
    const [firstName, lastName] = record.name.split(" ");
    setNewDoctor({ ...record, firstName, lastName });
    setEditingId(record.id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const filtered = doctorData.filter((doctor) => doctor.id !== id);
    setDoctorData(filtered);
    message.success("Doctor deleted successfully!");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Specialization", dataIndex: "specialization", key: "specialization" },
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Admin Name", dataIndex: "adminName", key: "adminName" },
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
        <h2>Doctors</h2>
        <button className="add-admin-btn" onClick={openAddModal}>
          <PlusOutlined style={{ paddingRight: "5px" }} /> Add Doctor
        </button>
      </div>

      <Table
        columns={columns}
        dataSource={doctorData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{isEditMode ? "Edit Doctor" : "Add Doctor"}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={newDoctor.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={newDoctor.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newDoctor.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={newDoctor.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={newDoctor.specialization}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={newDoctor.address}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Features</label>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Select Features"
                  value={newDoctor.features}
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
              <div className="form-group">
                <label>Admin Name</label>
                <Select
                  allowClear
                  placeholder="Select Admin"
                  value={newDoctor.adminName}
                  onChange={handleAdminSelect}
                  style={{ width: "100%" }}
                >
                  {adminOptions.map((admin) => (
                    <Option key={admin} value={admin}>
                      {admin}
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

export default Doctors;
