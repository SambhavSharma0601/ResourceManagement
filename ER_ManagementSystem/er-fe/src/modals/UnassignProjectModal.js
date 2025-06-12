import React, { useEffect, useState } from 'react';
import axios from 'axios';

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalContainerStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '500px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  position: 'relative',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '15px',
  fontSize: '18px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

const UnassignProjectModal = ({ onClose }) => {
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineerId, setSelectedEngineerId] = useState('');

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/engineers');
        const filtered = res.data.filter((eng) => eng.project_assigned); // Only show engineers with projects
        setEngineers(filtered);
      } catch (err) {
        console.error('Error fetching engineers:', err);
      }
    };

    fetchEngineers();
  }, []);

  const handleUnassign = async () => {
    if (!selectedEngineerId) return;

    try {
      await axios.put(`http://localhost:5000/api/unassign/${selectedEngineerId}`);
      alert('Project unassigned successfully!');
      onClose();
    } catch (err) {
      console.error('Error unassigning project:', err);
      alert('Failed to unassign project');
    }
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={modalContainerStyle}>
        <button style={closeButtonStyle} onClick={onClose}>✖</button>
        <h2>Unassign Project</h2>

        <select
          value={selectedEngineerId}
          onChange={(e) => setSelectedEngineerId(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '1rem' }}
        >
          <option value="">Select Engineer</option>
          {engineers.map((eng) => (
            <option key={eng._id} value={eng._id}>
              {eng.name} ({eng.email})
            </option>
          ))}
        </select>

        <button
          onClick={handleUnassign}
          disabled={!selectedEngineerId}
          style={{
            marginTop: '1.5rem',
            padding: '10px 20px',
            backgroundColor: selectedEngineerId ? '#dc3545' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: selectedEngineerId ? 'pointer' : 'not-allowed',
          }}
        >
          Unassign Project
        </button>
      </div>
    </div>
  );
};

export default UnassignProjectModal;
