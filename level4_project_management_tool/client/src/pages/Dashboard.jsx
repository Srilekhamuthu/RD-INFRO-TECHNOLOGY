import React, { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

// GraphQL Queries & Mutations
const GET_DATA = gql`
  query {
    getUsers {
      id
      username
    }
    getProjects {
      id
      title
      description
      user {
        id
        username
      }
    }
    getTasks {
      id
      title
      status
      deadline
      project {
        id
        title
      }
      assignedTo {
        id
        username
      }
    }
  }
`;

const CREATE_PROJECT = gql`
  mutation CreateProject($title: String!, $description: String!, $userId: ID!) {
    createProject(title: $title, description: $description, userId: $userId) {
      id
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $status: String!, $projectId: ID!, $assignedTo: ID, $deadline: String) {
    createTask(title: $title, status: $status, projectId: $projectId, assignedTo: $assignedTo, deadline: $deadline) {
      id
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: ID!, $status: String!) {
    updateTaskStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

function Dashboard() {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_DATA);
  const [createProject] = useMutation(CREATE_PROJECT);
  const [createTask] = useMutation(CREATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [updateStatus] = useMutation(UPDATE_TASK_STATUS);

  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  const [projectForm, setProjectForm] = useState({ title: '', description: '', userId: '' });
  const [taskForms, setTaskForms] = useState({});

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      alert('Please login!');
      navigate('/login');
    }
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data.</p>;

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    await createProject({ variables: projectForm });
    setProjectForm({ title: '', description: '', userId: '' });
    refetch();
  };

  const handleTaskSubmit = async (e, projectId) => {
    e.preventDefault();
    const form = taskForms[projectId];
    if (!form?.title || !form?.assignedTo) return;
    await createTask({ variables: { ...form, projectId } });
    setTaskForms(prev => ({ ...prev, [projectId]: { title: '', status: 'Pending', assignedTo: '', deadline: '' } }));
    refetch();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteTask({ variables: { id } });
      refetch();
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await updateStatus({ variables: { id: taskId, status: newStatus } });
    refetch();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>🎯 Welcome, {username} ({role})</h2>
        <button
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
          style={styles.logout}
        >
          🔓 Logout
        </button>
      </div>

      {/* Admin: Project Creation */}
      {role === 'admin' && (
        <div style={styles.card}>
          <h3>➕ Create Project</h3>
          <form onSubmit={handleProjectSubmit} style={styles.form}>
            <input
              placeholder="Project Title"
              style={styles.input}
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              required
            />
            <input
              placeholder="Description"
              style={styles.input}
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              required
            />
            <select
              style={styles.input}
              value={projectForm.userId}
              onChange={(e) => setProjectForm({ ...projectForm, userId: e.target.value })}
              required
            >
              <option value="">Assign to User</option>
              {data.getUsers.map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
            <button style={styles.button}>Add Project</button>
          </form>
        </div>
      )}

      {/* Project Cards */}
      {data.getProjects.map(project => (
        <div key={project.id} style={styles.card}>
          <h3>📌 {project.title}</h3>
          <p>{project.description}</p>
          <p>👤 Owner: {project.user?.username}</p>

          <h4>📋 Tasks</h4>
          <ul>
            {data.getTasks
              .filter(task => task.project?.id === project.id)
              .filter(task => role === 'admin' || task.assignedTo?.id === userId)
              .map(task => (
                <li key={task.id}>
                  ✅ {task.title} — <i>{task.status}</i>
                  {task.deadline && <> 🕒 <small>Due: {new Date(task.deadline).toLocaleString()}</small></>}
                  {" "}({task.assignedTo?.username || "Unassigned"})
                  {role === 'member' && task.assignedTo?.id === userId && (
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      style={{ marginLeft: 10 }}
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>
                  )}
                  {role === 'admin' && (
                    <button
                      onClick={() => handleDelete(task.id)}
                      style={styles.delete}
                    >
                      🗑️
                    </button>
                  )}
                </li>
              ))}
          </ul>

          {/* Admin: Add Task */}
          {role === 'admin' && (
            <form onSubmit={(e) => handleTaskSubmit(e, project.id)} style={styles.form}>
              <input
                placeholder="New Task"
                style={styles.input}
                value={taskForms[project.id]?.title || ''}
                onChange={(e) =>
                  setTaskForms(prev => ({
                    ...prev,
                    [project.id]: {
                      ...prev[project.id],
                      title: e.target.value,
                      status: 'Pending'
                    }
                  }))
                }
                required
              />
              <select
                value={taskForms[project.id]?.assignedTo || ''}
                onChange={(e) =>
                  setTaskForms(prev => ({
                    ...prev,
                    [project.id]: {
                      ...prev[project.id],
                      assignedTo: e.target.value
                    }
                  }))
                }
                style={styles.input}
                required
              >
                <option value="">Assign To</option>
                {data.getUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.username}</option>
                ))}
              </select>
              <input
                type="datetime-local"
                value={taskForms[project.id]?.deadline || ''}
                onChange={(e) =>
                  setTaskForms(prev => ({
                    ...prev,
                    [project.id]: {
                      ...prev[project.id],
                      deadline: e.target.value
                    }
                  }))
                }
                style={styles.input}
                required
              />
              <button style={styles.button}>Add Task</button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}

// 🎨 Styles
const styles = {
  page: {
    padding: '30px',
    fontFamily: 'Poppins, sans-serif',
    background: 'linear-gradient(to top left, #fff5f5, #e6f7ff, #f3ffe2)',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '30px',
  },
  logout: {
    backgroundColor: '#ef476f',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px'
  },
  card: {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  form: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    minWidth: '160px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#5e60ce',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  delete: {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#ff5c5c',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  }
};

export default Dashboard;
