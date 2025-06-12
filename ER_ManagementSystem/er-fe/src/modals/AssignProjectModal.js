import React, { useEffect, useState } from "react";
import axios from "axios";

const modalBackdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalContainerStyle = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "600px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  position: "relative",
};

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "15px",
  fontSize: "18px",
  background: "none",
  border: "none",
  cursor: "pointer",
};

const AssignProjectModal = ({ onClose }) => {
  const [projects, setProjects] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedEngineer, setSelectedEngineer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await axios.get(
          "https://resourcemanagement-4gp2.onrender.com/api/projects"
        );
        setProjects(projectRes.data);

        const engineerRes = await axios.get(
          "https://resourcemanagement-4gp2.onrender.com/api/engineers"
        );
        const unassignedEngineers = engineerRes.data.filter(
          (eng) => !eng.project_assigned || eng.project_assigned === "None"
        );
        setEngineers(unassignedEngineers);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleProjectSelect = (e) => {
    const project = projects.find((p) => p._id === e.target.value);
    setSelectedProject(project);
  };

  const handleEngineerSelect = (e) => {
    const engineer = engineers.find((eng) => eng._id === e.target.value);
    setSelectedEngineer(engineer);
  };

  const handleAssign = async () => {
    try {
      const response = await axios.put(
        `https://resourcemanagement-4gp2.onrender.com/api/assign/${selectedEngineer._id}`,
        {
          projectId: selectedProject._id,
        }
      );

      alert("✅ Project assigned successfully!");
      onClose();
    } catch (error) {
      console.error("❌ Failed to assign project:", error);
      alert("Error assigning project.");
    }
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={modalContainerStyle}>
        <button style={closeButtonStyle} onClick={onClose}>
          ✖
        </button>
        <h2>Assign Project</h2>

        

        {/* Project Dropdown */}
        <label>Choose Project:</label>
        <select
          onChange={handleProjectSelect}
          defaultValue=""
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "0.5rem",
            marginBottom: "1rem",
          }}>
          <option value="" disabled>
            Select a project
          </option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>

        {/* Engineer Dropdown */}
        <label>Choose Engineer:</label>
        <select
          onChange={handleEngineerSelect}
          defaultValue=""
          style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}>
          <option value="" disabled>
            Select an engineer
          </option>
          {engineers.map((engineer) => (
            <option key={engineer._id} value={engineer._id}>
              {engineer.name} ({engineer.email})
            </option>
          ))}
        </select>

        {/* Selected Project Details */}
        {selectedProject && (
          <div
            style={{
              marginBottom: "1rem",
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "6px",
            }}>
            <h3>{selectedProject.name}</h3>
            <p>
              <strong>Domain:</strong> {selectedProject.domain}
            </p>
            <p>
              <strong>Description:</strong> {selectedProject.description}
            </p>
            <p>
              <strong>Status:</strong> {selectedProject.status}
            </p>
            <p>
              <strong>Total Hours:</strong> {selectedProject.total_hours}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(selectedProject.start_date).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(selectedProject.end_date).toLocaleDateString()}
            </p>
          </div>
        )}

        <button
          disabled={!selectedProject || !selectedEngineer}
          onClick={handleAssign}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor:
              selectedProject && selectedEngineer ? "#007bff" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor:
              selectedProject && selectedEngineer ? "pointer" : "not-allowed",
          }}>
          Assign Project
        </button>
      </div>
    </div>
  );
};

export default AssignProjectModal;
