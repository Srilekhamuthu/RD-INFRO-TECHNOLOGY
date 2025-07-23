// src/pages/admin/AdminPanel.js

import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

// GraphQL Queries
const GET_USERS = gql`
  query {
    getUsers {
      id
      username
      email
      role
    }
  }
`;

const GET_PROJECTS = gql`
  query {
    getProjects {
      id
      title
      description
      user {
        username
      }
    }
  }
`;

const GET_TASKS = gql`
  query {
    getTasks {
      id
      title
      status
      assignedTo {
        username
      }
      project {
        title
      }
    }
  }
`;

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');

  const { data: userData } = useQuery(GET_USERS);
  const { data: projectData } = useQuery(GET_PROJECTS);
  const { data: taskData } = useQuery(GET_TASKS);

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <section style={styles.section}>
            <h2 style={styles.heading}>👥 Registered Users</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {userData?.getUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      case 'projects':
        return (
          <section style={styles.section}>
            <h2 style={styles.heading}>📁 Projects</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody>
                {projectData?.getProjects.map(project => (
                  <tr key={project.id}>
                    <td>{project.title}</td>
                    <td>{project.description}</td>
                    <td>{project.user?.username || 'Unknown'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      case 'tasks':
        return (
          <section style={styles.section}>
            <h2 style={styles.heading}>✅ All Tasks</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Project</th>
                </tr>
              </thead>
              <tbody>
                {taskData?.getTasks.map(task => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.status}</td>
                    <td>{task.assignedTo?.username || 'Unassigned'}</td>
                    <td>{task.project?.title || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👨‍💼 Admin Panel Overview</h1>

      <div style={styles.tabBar}>
        <button
          onClick={() => setActiveTab('users')}
          style={activeTab === 'users' ? styles.activeTab : styles.tab}
        >
          👥 Users
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          style={activeTab === 'projects' ? styles.activeTab : styles.tab}
        >
          📁 Projects
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          style={activeTab === 'tasks' ? styles.activeTab : styles.tab}
        >
          ✅ Tasks
        </button>
      </div>

      {renderContent()}
    </div>
  );
}

// 🔧 Styling
const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Poppins, sans-serif',
    background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
    minHeight: '100vh'
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '2rem',
    fontWeight: '700'
  },
  heading: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    fontWeight: '600'
  },
  tabBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  },
  tab: {
    padding: '0.7rem 1.2rem',
    border: 'none',
    backgroundColor: '#e0e7ff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1.1rem'
  },
  activeTab: {
    padding: '0.7rem 1.2rem',
    border: 'none',
    backgroundColor: '#6366f1',
    color: 'white',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '1.1rem',
    cursor: 'pointer'
  },
  section: {
    backgroundColor: '#ffffffcc',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    fontSize: '1.05rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '1.05rem'
  }
};

export default AdminPanel;
