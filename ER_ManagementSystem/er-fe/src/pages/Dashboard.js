import React, { useEffect, useState } from "react";
import axios from "axios";
import AssignProjectModal from "../modals/AssignProjectModal";
import AssignmentModal from "../modals/AssignmentModal";
import UnassignProjectModal from "../modals/UnassignProjectModal";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [engineers, setEngineers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [projectDetails, setProjectDetails] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  const [assignModalState, setAssignModalState] = useState(false);
  const [assignmentModalState, setAssignmentModalState] = useState(false);
  const [showUnassignModal, setShowUnassignModal] = useState(false);

  const [filterProjectNone, setFilterProjectNone] = useState(false);
  
  const [filterCurrentlyNotAssigned, setFilterCurrentlyNotAssigned] =
    useState(false);
  const [selectedDomain, setSelectedDomain] = useState("");

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const res = await axios.get("https://resourcemanagement-4gp2.onrender.com/api/engineers");
        setEngineers(res.data);

        // If engineer, fetch own data
        if (currentUser?.role === "Engineer") {
          const currentEngineer = res.data.find(
            (eng) => eng.email === currentUser.email
          );

          if (currentEngineer?.project_assigned) {
            setProjectDetails(currentEngineer.project_assigned);
            const team = res.data.filter(
              (eng) =>
                eng.project_assigned === currentEngineer.project_assigned &&
                eng.email !== currentUser.email
            );
            setTeamMembers(team);
          }

          // Fetch Assignments
          const assignRes = await axios.get(
            `https://resourcemanagement-4gp2.onrender.com/api/assignments/by-engineer/${currentEngineer._id}`
          );
          setAssignments(assignRes.data);
        }
      } catch (error) {
        console.error("Error fetching engineer data:", error);
      }
    };

    fetchEngineers();
  }, []);

  // For Manager: Get domains
  const getAllDomains = () => {
    const uniqueDomains = new Set(engineers.map((eng) => eng.domain));
    return Array.from(uniqueDomains);
  };

  const [selectedStatus, setSelectedStatus] = useState("");
  const [showSave, setShowSave] = useState(false);
  const filteredEngineers = engineers.filter((eng) => {
    let isMatch = true;
    if (filterProjectNone && eng.project_assigned) isMatch = false;
    if (filterCurrentlyNotAssigned && eng.currently_assigned) isMatch = false;
    if (selectedDomain && eng.domain !== selectedDomain) isMatch = false;
    return isMatch;
  });

  const handleStatusSave = async (assignmentId, status, hideSave) => {
    const statusMap = {
      "Started Overview": { current_status: "Started Overview", percent_completed: 25 },
      "Partially Completed": { current_status: "Partially Completed", percent_completed: 50 },
      "Done": { current_status: "Done", percent_completed: 100 },
    };
  
    try {
      await axios.put(`https://resourcemanagement-4gp2.onrender.com/api/assignments/${assignmentId}`, {
        ...statusMap[status],
      });
  
      // Update local state after successful save
      setAssignments((prev) =>
        prev.map((a) =>
          a._id === assignmentId ? { ...a, ...statusMap[status] } : a
        )
      );
  
      hideSave(false); // hide Save button again
    } catch (err) {
      console.error("Error saving assignment update:", err);
    }
  };
  

  // Styling
  const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
    background: "#f9f9f9",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  };

  const sectionTitle = {
    fontSize: "20px",
    margin: "1.5rem 0 1rem",
    color: "#333",
  };

  return (
    <>
      <Header />
      {/* <Sidebar /> */}
      <div className="dashboard-container">
        <h2>Welcome, {currentUser?.email}</h2>
        <p className="role">Role: {currentUser?.role}</p>

        {/* MANAGER VIEW */}
        {currentUser?.role === "Manager" && (
          <>
            <Link to="/manager-stats" className="stats-link">
              View Stats
            </Link>

            <div className="filters">
              <label>
                <input
                  type="checkbox"
                  checked={filterProjectNone}
                  onChange={() => setFilterProjectNone((prev) => !prev)}
                />
                Project Assigned: None
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={filterCurrentlyNotAssigned}
                  onChange={() =>
                    setFilterCurrentlyNotAssigned((prev) => !prev)
                  }
                />
                Currently Assigned: No
              </label>

              <label>
                Domain:
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  style={{ marginLeft: "0.5rem" }}>
                  <option value="">All</option>
                  {getAllDomains().map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="engineer-cards">
              {filteredEngineers.map((engineer) => (
                <div key={engineer._id} className="card">
                  <h4>{engineer.name}</h4>
                  <p>Email: {engineer.email}</p>
                  <p>Domain: {engineer.domain}</p>
                  <p>Project Assigned: {engineer.project_assigned || "None"}</p>
                  <p>
                    Currently Assigned:{" "}
                    {engineer.currently_assigned ? "Yes" : "No"}
                  </p>
                  <p>Hours Allocated: {engineer.hours_allocated}</p>
                </div>
              ))}
            </div>

            <div className="actions">
              <button onClick={() => setAssignModalState(true)}>
                Assign Projects
              </button>
              <button onClick={() => setAssignmentModalState(true)}>
                Assign Assignment
              </button>
              <button onClick={() => setShowUnassignModal(true)}>
                Unassign a Project
              </button>
            </div>
          </>
        )}

        {/* ENGINEER VIEW */}
        {currentUser?.role === "Engineer" && (
          <>
            {/* Project Info */}
            <div className="section">
              <h3 className="section-title">Your Assigned Project</h3>
              {projectDetails ? (
                <p>{projectDetails}</p>
              ) : (
                <p style={{ color: "gray" }}>No project assigned</p>
              )}
            </div>

            <div className="section">
              <h3 className="section-title">Your Team</h3>
              {teamMembers.length > 0 ? (
                <ul>
                  {teamMembers.map((teammate) => (
                    <li key={teammate._id}>
                      {teammate.name} ({teammate.email})
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "gray" }}>No teammates found</p>
              )}
            </div>

            <div className="section">
              <h3 className="section-title">Your Assignments</h3>
              {assignments.length > 0 ? (
                <ul>
                  {assignments.map((assn) => {


                    return (
                      <li key={assn._id} style={{ marginBottom: "1.5rem" }}>
                        <strong>{assn.assignment_name}</strong> –{" "}
                        {assn.current_status} ({assn.percent_completed || 0}%
                        complete)
                        <br />
                        <em>{assn.remarks}</em>
                        <br />
                        <label htmlFor={`status-${assn._id}`}>
                          Update Status:{" "}
                        </label>
                        <select
                          id={`status-${assn._id}`}
                          value={selectedStatus}
                          onChange={(e) => {
                            setSelectedStatus(e.target.value);
                            setShowSave(true);
                          }}>
                          <option value="">--Select--</option>
                          <option value="Started Overview">
                            Started Overview
                          </option>
                          <option value="Partially Completed">
                            Partially Completed
                          </option>
                          <option value="Done">Done</option>
                        </select>
                        {showSave && (
                          <button
                            style={{ marginLeft: "0.5rem" }}
                            onClick={() =>
                              handleStatusSave(
                                assn._id,
                                selectedStatus,
                                setShowSave
                              )
                            }>
                            Save
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p style={{ color: "gray" }}>No assignments assigned yet</p>
              )}
            </div>
          </>
        )}

        {/* Modals */}
        {showUnassignModal && (
          <UnassignProjectModal onClose={() => setShowUnassignModal(false)} />
        )}
        {assignModalState && (
          <AssignProjectModal onClose={() => setAssignModalState(false)} />
        )}
        {assignmentModalState && (
          <AssignmentModal onClose={() => setAssignmentModalState(false)} />
        )}
      </div>
    </>
  );
};

export default Dashboard;
