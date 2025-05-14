import React, { useEffect, useState } from "react";
import { Select, Table } from "antd";
import "../styles/admin_doctor_features.css";

const { Option } = Select;

const AdminFeatures = () => {
  const [adminData, setAdminData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [features, setFeatures] = useState([]);
  const [metadata, setMetadata] = useState({
    features: [],
  });

  // Load metadata (features) from localStorage
  useEffect(() => {
    const storedFeatures = JSON.parse(localStorage.getItem("features") || "[]");
    setMetadata((prev) => ({ ...prev, features: storedFeatures }));
  }, []);

  // Load admin data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("adminData");
    if (storedData) {
      setAdminData(JSON.parse(storedData));
    }
  }, []);

  const handleIdChange = (value) => {
    setSelectedId(value);
    const selectedAdmin = adminData.find((admin) => admin.id === value);
    setSelectedName(selectedAdmin ? selectedAdmin.name : null);

    // Map feature names to feature IDs
    const selectedFeatures = selectedAdmin ? selectedAdmin.features : [];
    const mappedFeatures = selectedFeatures.map((featureName) => {
      const feature = metadata.features.find(
        (metadataFeature) => metadataFeature.name === featureName
      );
      return {
        featureId: feature ? feature.id : "N/A", // Default to "N/A" if no feature match
        featureName: featureName,
      };
    });

    setFeatures(mappedFeatures); // Set features with ids
  };

  // Columns for the features table
  const columns = [
    {
      title: 'Feature ID',
      dataIndex: 'featureId',
      key: 'featureId',
    },
    {
      title: 'Feature Name',
      dataIndex: 'featureName',
      key: 'featureName',
    },
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Features</h2>
      </div>

      <div className="admin-dropdown-row">
        <div className="dropdown-group">
          <label>Admin ID:</label>
          <Select
            placeholder="Select Admin ID"
            style={{ width: 200 }}
            value={selectedId}
            onChange={handleIdChange}
          >
            {adminData.map((admin) => (
              <Option key={admin.id} value={admin.id}>
                {admin.id}
              </Option>
            ))}
          </Select>
        </div>

        <div className="dropdown-group">
          <label>Admin Name:</label>
          <Select
            placeholder="Admin Name"
            style={{ width: 200 }}
            value={selectedName}
            
          >
            {selectedName && (
              <Option value={selectedName}>{selectedName}</Option>
            )}
          </Select>
        </div>
      </div>

      {/* Features Table */}
      <div className="admin-features-table">
        <Table columns={columns} dataSource={features} pagination={false} />
      </div>
    </div>
  );
};

export default AdminFeatures;
