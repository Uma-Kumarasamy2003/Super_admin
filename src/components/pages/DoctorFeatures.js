import React, { useEffect, useState } from "react";
import { Select, Table } from "antd";
import "../styles/admin_doctor_features.css";

const { Option } = Select;

const DoctorFeatures = () => {
  const [adminData, setAdminData] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [features, setFeatures] = useState([]);
  const [metadata, setMetadata] = useState({
    features: [],
  });

  // Load metadata (features) from localStorage
  useEffect(() => {
    const storedFeatures = JSON.parse(localStorage.getItem("features") || "[]");
    setMetadata((prev) => ({ ...prev, features: storedFeatures }));
  }, []);

  // Load admin and doctor data from localStorage
  useEffect(() => {
    const storedAdmins = localStorage.getItem("adminData");
    const storedDoctors = localStorage.getItem("doctorData");

    if (storedAdmins) {
      setAdminData(JSON.parse(storedAdmins));
    }
    if (storedDoctors) {
      setDoctorData(JSON.parse(storedDoctors));
    }
  }, []);

  const handleAdminChange = (adminId) => {
    setSelectedAdminId(adminId);
    setSelectedDoctorId(null); // Reset doctor selection

    // Clear features table when switching admin
    setFeatures([]);
  };

  const handleDoctorChange = (doctorId) => {
    setSelectedDoctorId(doctorId);

    const selectedDoctor = doctorData.find((doctor) => doctor.id === doctorId);

    const selectedFeatures = selectedDoctor ? selectedDoctor.features : [];
    const mappedFeatures = selectedFeatures.map((featureName) => {
      const feature = metadata.features.find(
        (metadataFeature) => metadataFeature.name === featureName
      );
      return {
        featureId: feature ? feature.id : "N/A",
        featureName: featureName,
      };
    });

    setFeatures(mappedFeatures);
  };

  const getSelectedAdminName = () => {
    const admin = adminData.find((admin) => admin.id === selectedAdminId);
    return admin ? admin.name : null;
  };

  // Columns for the features table
  const columns = [
    {
      title: "Feature ID",
      dataIndex: "featureId",
      key: "featureId",
    },
    {
      title: "Feature Name",
      dataIndex: "featureName",
      key: "featureName",
    },
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Doctor Features</h2>
      </div>

      <div className="admin-dropdown-row">
        <div className="dropdown-group">
          <label>Admin Name:</label>
          <Select
            placeholder="Select Admin"
            style={{ width: 200 }}
            value={selectedAdminId}
            onChange={handleAdminChange}
          >
            {adminData.map((admin) => (
              <Option key={admin.id} value={admin.id}>
                {admin.name}
              </Option>
            ))}
          </Select>
        </div>

        <div className="dropdown-group">
          <label>Doctor Name:</label>
          <Select
            placeholder="Select Doctor"
            style={{ width: 200 }}
            value={selectedDoctorId}
            onChange={handleDoctorChange}
            disabled={!selectedAdminId}
          >
            {doctorData
              .filter(
                (doctor) => doctor.adminName === getSelectedAdminName()
              )
              .map((doctor) => (
                <Option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </Option>
              ))}
          </Select>
        </div>
      </div>

      <div className="admin-features-table">
        <Table columns={columns} dataSource={features} rowKey="featureId" pagination={false} />
      </div>
    </div>
  );
};

export default DoctorFeatures;
