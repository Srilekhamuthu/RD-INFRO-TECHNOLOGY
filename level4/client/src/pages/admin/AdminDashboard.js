// src/pages/admin/AdminDashboard.js

import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import KanbanBoard from '../../components/KanbanBoard'; // ✅ adjust path if needed

const GET_USERS = gql`
  query {
    getUsers {
      id
      username
      role
    }
  }
`;

const GET_PROJECTS = gql`
  query {
    getProjects {
      id
      title
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
    }
  }
`;

const CREATE_PROJECT = gql`
  mutation CreateProject($title: String!, $description: String!, $userId: ID!) {
    createProject(title: $title, description: $description, userId: $userId) {
      id
      title
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask(
    $title: String!
    $status: String!
    $projectId: ID!
    $assignedTo: ID!
  ) {
    createTask(
      title: $title
      status: $status
      projectId: $projectId
      assignedTo: $assignedTo
    ) {
      id
      title
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

function AdminDashboard() {
  const { data: usersData } = useQuery(GET_USERS);
  const { data: projectsData, refetch: refetchProjects } = useQuery(GET_PROJECTS);
  const { data: tasksData, refetch: refetchTasks } = useQuery(GET_TASKS);
  const [createProject] = useMutation(CREATE_PROJECT);
  const [createTask] = useMutation(CREATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    userId: '',
  });
  const [taskForm, setTaskForm] = useState({
    title: '',
    status: 'Pending',
    projectId: '',
    assignedTo: '',
  });

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    await createProject({ variables: projectForm });
    alert('✅ Project Created');
    setProjectForm({ title: '', description: '', userId: '' });
    refetchProjects();
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    await createTask({ variables: taskForm });
    alert('✅ Task Created');
    setTaskForm({ title: '', status: 'Pending', projectId: '', assignedTo: '' });
    refetchTasks();
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask({ variables: { id } });
      refetchTasks();
    }
  };

  const filteredTasks = tasksData?.getTasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>👋 Welcome Admin</h1>
      <p style={styles.sub}>Manage projects and tasks efficiently.</p>

      {/* Create Project */}
      <div style={styles.section}>
        <h2>📁 Create Project</h2>
        <form onSubmit={handleProjectSubmit} style={styles.form}>
          <input
            placeholder="Title"
            value={projectForm.title}
            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
            required
            style={styles.input}
          />
          <input
            placeholder="Description"
            value={projectForm.description}
            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
            required
            style={styles.input}
          />
          <select
            value={projectForm.userId}
            onChange={(e) => setProjectForm({ ...projectForm, userId: e.target.value })}
            required
            style={styles.input}
          >
            <option value="">Select Owner</option>
            {usersData?.getUsers
              .filter((u) => u.role === 'admin')
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
          </select>
          <button type="submit" style={styles.button}>
            ➕ Create Project
          </button>
        </form>
      </div>

      {/* Create Task */}
      <div style={styles.section}>
        <h2>📝 Create Task</h2>
        <form onSubmit={handleTaskSubmit} style={styles.form}>
          <input
            placeholder="Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
            style={styles.input}
          />
          <select
            value={taskForm.projectId}
            onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
            required
            style={styles.input}
          >
            <option value="">Select Project</option>
            {projectsData?.getProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
          <select
            value={taskForm.assignedTo}
            onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
            required
            style={styles.input}
          >
            <option value="">Assign to Member</option>
            {usersData?.getUsers
              .filter((u) => u.role === 'member')
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
          </select>
          <select
            value={taskForm.status}
            onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
            style={styles.input}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <button type="submit" style={styles.button}>
            ➕ Create Task
          </button>
        </form>
      </div>

      {/* Task List */}
      <div style={styles.section}>
        <h2>📋 Task List</h2>
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>❌</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks?.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.status}</td>
                <td>{task.assignedTo?.username}</td>
                <td>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={styles.deleteButton}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kanban Board */}
      <div style={styles.section}>
        <h2>📊 Kanban Task Board</h2>
        <KanbanBoard tasks={tasksData?.getTasks || []} refetchTasks={refetchTasks} />
      </div>

      {/* Navigation */}
      <div style={{ marginTop: '2rem' }}>
        <button style={styles.panelButton} onClick={() => navigate('/admin-panel')}>
          Go to Admin Panel
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Poppins, sans-serif',
    background: 'linear-gradient(to right, #fde2e4, #e4c1f9, #a0c4ff, #caffbf, #ffc6ff)',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '2.2rem',
    color: '#333',
  },
  sub: {
    fontStyle: 'italic',
    color: '#555',
  },
  section: {
    marginTop: '2rem',
    padding: '1.5rem',
    borderRadius: '12px',
    backgroundColor: '#ffffffcc',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    marginTop: '1rem',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
  },
  deleteButton: {
    padding: '0.4rem',
    fontSize: '1rem',
    background: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  panelButton: {
    padding: '1rem',
    background: '#4a148c',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default AdminDashboard;
