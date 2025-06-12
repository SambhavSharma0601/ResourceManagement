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

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '1rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const AssignmentModal = ({ onClose }) => {
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState('');
  const [assignmentName, setAssignmentName] = useState('');

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const res = await axios.get('https://resourcemanagement-4gp2.onrender.com/api/engineers');
        setEngineers(res.data);
      } catch (error) {
        console.error('Error fetching engineers:', error);
      }
    };

    fetchEngineers();
  }, []);

  const handleAssign = async () => {
    if (!selectedEngineer || !assignmentName.trim()) return;

    try {
      await axios.post('https://resourcemanagement-4gp2.onrender.com/api/assignments/assign', {
        engineerId: selectedEngineer,
        assignment_name: assignmentName,
      });
      alert("Assignment created and assigned!");
      onClose();
    } catch (error) {
      console.error("Assignment creation failed:", error);
      alert("Failed to assign");
    }
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={modalContainerStyle}>
        <button style={closeButtonStyle} onClick={onClose}>✖</button>
        <h2>Assign New Assignment</h2>

        <select
          value={selectedEngineer}
          onChange={(e) => setSelectedEngineer(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select Engineer</option>
          {engineers.map((eng) => (
            <option key={eng._id} value={eng._id}>{eng.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Assignment Name"
          value={assignmentName}
          onChange={(e) => setAssignmentName(e.target.value)}
          style={inputStyle}
        />

        <button
          style={{
            ...inputStyle,
            marginTop: '1rem',
            backgroundColor: selectedEngineer && assignmentName ? '#007bff' : '#aaa',
            color: '#fff',
            cursor: selectedEngineer && assignmentName ? 'pointer' : 'not-allowed',
            border: 'none'
          }}
          disabled={!selectedEngineer || !assignmentName}
          onClick={handleAssign}
        >
          Assign
        </button>
      </div>
    </div>
  );
};

export default AssignmentModal;
