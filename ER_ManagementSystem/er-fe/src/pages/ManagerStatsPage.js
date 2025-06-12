import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import './ManagerStats.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ManagerStatsPage = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/stats/overview');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p className="loading-text">Loading stats...</p>;

  const pieData = [
    { name: 'Assigned Engineers', value: stats.assignedEngineers },
    { name: 'Unassigned Engineers', value: stats.unassignedEngineers },
  ];

  return (
    <div className="manager-stats-container">
      <div className="stats-header">
        <h2>📊 Manager Statistics Dashboard</h2>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>⬅ Back to Dashboard</button>
      </div>

      <div className="charts-section">
        <div className="chart-box">
          <h3>Total Engineers Distribution</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              cx={150}
              cy={150}
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="chart-box">
          <h3>Engineers per Project</h3>
          <BarChart
            width={500}
            height={300}
            data={stats.projectWiseEngineerCount}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>

      <div className="summary-section">
        <h4>🔢 Total Stats Summary</h4>
        <ul>
          <li>Total Engineers: {stats.totalEngineers}</li>
          <li>Assigned Engineers: {stats.assignedEngineers}</li>
          <li>Unassigned Engineers: {stats.unassignedEngineers}</li>
          <li>Total Projects: {stats.totalProjects}</li>
        </ul>
      </div>
    </div>
  );
};

export default ManagerStatsPage;
