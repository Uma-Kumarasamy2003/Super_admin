import React, { useState, useEffect } from "react";
import "../styles/admin_doctor_scancentre.css";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Table, Select, message, Modal, Form, Input, Button } from "antd";

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
  const [form] = Form.useForm();

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

  const openAddModal = () => {
    const resetData = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialization: "",
      address: "",
      features: [],
      adminName: "",
    };
    setNewDoctor(resetData);
    form.setFieldsValue(resetData);
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleAddOrUpdateAdmin = () => {
    const values = form.getFieldsValue();
    const {
      firstName,
      lastName,
      email,
      phone,
      specialization,
      address,
      adminName,
    } = values;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !specialization ||
      !address ||
      !adminName
    ) {
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
      setDoctorData([...doctorData, { ...values, name: fullName, id: newId }]);
      message.success("Doctor added successfully!");
    } else {
      const updatedData = doctorData.map((doctor) =>
        doctor.id === editingId
          ? { ...values, name: fullName, id: editingId }
          : doctor
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
    const editData = { ...record, firstName, lastName };
    setNewDoctor(editData);
    form.setFieldsValue(editData);
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
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
    },
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
        <Button type="primary" onClick={openAddModal}>
          <PlusOutlined /> Add Doctor
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={doctorData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={isEditMode ? "Edit Doctor" : "Add Doctor"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null} // removed default footer
        className="admin-modal"
        width={700} 
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={newDoctor}
          requiredMark={false}
          className="admin-form"
          onFinish={handleAddOrUpdateAdmin}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "First name is required!" }]}
          >
            <Input placeholder="Enter First name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Last name is required!" }]}
          >
            <Input  placeholder="Enter Last name"/>
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Email is required!" }]}
          >
            <Input type="email" placeholder="Enter Email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Phone number is required!" }]}
          >
            <Input placeholder="Enter Phone" />
          </Form.Item>
          <Form.Item
            name="specialization"
            label="Specialization"
            rules={[{ required: true, message: "Specialization is required!" }]}
          >
            <Input  placeholder="Enter Specialization"/>
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Address is required!" }]}
          >
            <Input  placeholder="Enter Address"/>
          </Form.Item>
          <Form.Item name="features" label="Features" className="features-field">
            <Select mode="multiple" allowClear placeholder="Select Features">
              {featureOptions.map((feature) => (
                <Option key={feature.name} value={feature.name}>
                  {feature.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="adminName"
            label="Admin Name"
            className="features-field"
            placeholder="Select Admin"
            rules={[{ required: true, message: "Admin name is required!" }]}
          >
            <Select allowClear placeholder="Select Admin" >
              {adminOptions.map((admin) => (
                <Option key={admin} value={admin}>
                  {admin}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <div className="admin-form-button">
              <Button type="primary" htmlType="submit">
                {isEditMode ? "Update" : "Add"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Doctors;
