import React, { useState, useEffect } from "react";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Table, message } from "antd"; // Import message
import "../styles/scancentres.css";

const Scancentres = () => {
  const [centres, setCentres] = useState(() => {
    const saved = localStorage.getItem("scanCentres");
    return saved ? JSON.parse(saved) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    localStorage.setItem("scanCentres", JSON.stringify(centres));
  }, [centres]);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", email: "", phone: "", address: "" });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = () => {
    const { name, email, phone, address } = formData;
    if (!name || !email || !phone || !address) {
      message.warning("Please fill in all fields.");
      return;
    }

    if (isEditMode) {
      setCentres((prev) =>
        prev.map((centre) =>
          centre.id === editingId ? { ...formData, id: editingId } : centre
        )
      );
      message.success("Scan Centre updated successfully!");
    } else {
      const newId = `SC${centres.length + 1}`;
      setCentres((prev) => [...prev, { ...formData, id: newId }]);
      message.success("Scan Centre added successfully!");
    }

    setShowModal(false);
    setFormData({ name: "", email: "", phone: "", address: "" });
    setEditingId(null);
  };

  const handleEdit = (record) => {
    setFormData(record);
    setEditingId(record.id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const filtered = centres.filter((centre) => centre.id !== id);
    setCentres(filtered);
    message.success("Scan Centre deleted successfully!");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
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
        <h2>Scan Centres</h2>
        <button className="add-admin-btn" onClick={openAddModal}>
          <PlusOutlined style={{ paddingRight: "5px" }} />
          <span>Add Scan Centre</span>
        </button>
      </div>

      <Table
        columns={columns}
        dataSource={centres}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {showModal && (
        <div className="modal-overlay-scancentre">
          <div className="modal">
            <h3>{isEditMode ? "Edit Scan Centre" : "Add Scan Centre"}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={handleAddOrUpdate}>
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

export default Scancentres;
