// Admin.js
import React, { useState, useEffect } from "react";
import "../styles/admin_doctor.css";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Table,
  Select,
  message,
  Modal,
  Form,
  Input,
  Button,
} from "antd";

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

  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem("adminData", JSON.stringify(adminData));
  }, [adminData]);

  useEffect(() => {
    const storedFeatures = localStorage.getItem("features");
    if (storedFeatures) {
      setFeatureOptions(JSON.parse(storedFeatures));
    }
  }, []);

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
    form.resetFields();
  };

  const handleAddOrUpdateAdmin = () => {
    const values = form.getFieldsValue();
    const name = `${values.firstName} ${values.lastName}`.trim();

    const adminEntry = { ...values, name };

    if (!isEditMode) {
      const duplicate = adminData.find(
        (admin) => admin.email === values.email || admin.phone === values.phone
      );
      if (duplicate) {
        message.error("Email or phone already exists.");
        return;
      }

      const maxIdNumber = adminData.reduce((max, admin) => {
        const match = admin.id?.match(/^ADM(\d+)$/);
        const num = match ? parseInt(match[1], 10) : 0;
        return Math.max(max, num);
      }, 0);

      const newId = `ADM${maxIdNumber + 1}`;
      setAdminData([...adminData, { ...adminEntry, id: newId }]);
      message.success("Admin added successfully!");
    } else {
      const updatedData = adminData.map((admin) =>
        admin.id === editingId ? { ...adminEntry, id: editingId } : admin
      );
      setAdminData(updatedData);
      message.success("Admin updated successfully!");
    }

    setShowModal(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleEdit = (record) => {
    const [firstName, ...lastParts] = record.name.split(" ");
    const lastName = lastParts.join(" ");
    const updatedAdmin = {
      ...record,
      firstName,
      lastName,
    };

    form.setFieldsValue(updatedAdmin);
    setNewAdmin(updatedAdmin);
    setEditingId(record.id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const filtered = adminData.filter((admin) => admin.id !== id);
    setAdminData(filtered);
    message.success("Admin deleted successfully!");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
    },
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
        <Button type="primary" htmlType="submit" onClick={openAddModal}>
               <PlusOutlined /> Add Admin
        </Button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <Table
          columns={columns}
          dataSource={adminData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>

      <Modal
        title={isEditMode ? "Edit Admin" : "Add Admin"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        destroyOnClose
        className="admin-modal"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={newAdmin}
          onFinish={handleAddOrUpdateAdmin}
          requiredMark={false}
          className="admin-form"
        >
          <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "First name is required!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Last name is required!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Email is required!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Phone number is required!"}]}>
            <Input />
          </Form.Item>
          <Form.Item label="Specialization" name="specialization" rules={[{ required: true, message: "Specialization is required!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true, message: "Address is required!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Features" name="features" className="features-field">
            <Select
              mode="multiple"
              allowClear
              placeholder="Select Features"
              onChange={(value) => setNewAdmin({ ...newAdmin, features: value })}
            >
              {featureOptions.map((feature) => (
                <Option key={feature.name} value={feature.name}>
                  {feature.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <div className="admin-form-button">
            <Button type="primary" htmlType="submit" className="admin-form-button">
              {isEditMode ? "Update" : "Add"}
            </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin;
