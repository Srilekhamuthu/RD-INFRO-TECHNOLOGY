import React, { useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { toast } from 'react-toastify';

const GET_TASKS = gql`
  query {
    getTasks {
      id
      title
      status
      project {
        title
      }
      assignedTo {
        id
        username
      }
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

function getUserFromToken() {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return {
        id: decoded.id || decoded._id || null,
        username: decoded.username || 'User',
      };
    }
  } catch {
    toast.error('Invalid token. Please log in again.');
  }
  return { id: null, username: '' };
}

function MemberDashboard() {
  const { id: userId, username } = getUserFromToken();
  const { data, loading, error, refetch } = useQuery(GET_TASKS);
  const [updateStatus] = useMutation(UPDATE_TASK_STATUS);

  useEffect(() => {
    if (data) {
      console.log('Fetched tasks:', data.getTasks);
      console.log('Logged-in userId:', userId);
    }
  }, [data]);

  if (!userId) return <p style={styles.message}>Please log in to view tasks.</p>;
  if (loading) return <p style={styles.message}>Loading tasks...</p>;
  if (error) return <p style={styles.message}>Error loading tasks: {error.message}</p>;

  const myTasks = data?.getTasks?.filter(task => String(task.assignedTo?.id) === String(userId)) || [];

  const groupedTasks = {
    Pending: [],
    'In Progress': [],
    Done: [],
  };

  myTasks.forEach(task => groupedTasks[task.status]?.push(task));

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateStatus({ variables: { id: taskId, status } });
      await refetch();
      toast.success(`✅ Task moved to "${status}"`);
    } catch {
      toast.error('⚠️ Failed to update task status');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👋 Welcome, {username}</h2>
      <p style={styles.subtext}>Manage your tasks below:</p>

      <div style={styles.kanbanBoard}>
        {Object.keys(groupedTasks).map(status => (
          <div key={status} style={styles.column}>
            <h3 style={styles.columnTitle}>{status}</h3>
            {groupedTasks[status].length === 0 ? (
              <p style={styles.noTasks}>No tasks</p>
            ) : (
              groupedTasks[status].map(task => (
                <div key={task.id} style={styles.card}>
                  <h4>{task.title}</h4>
                  <p><strong>Project:</strong> {task.project?.title || 'N/A'}</p>
                  <label style={{ display: 'block', marginTop: '8px' }}>
                    <strong>Status:</strong>
                    <select
                      value={task.status}
                      onChange={e => handleStatusChange(task.id, e.target.value)}
                      style={styles.select}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </label>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '2.2rem',
    color: '#333',
  },
  subtext: {
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
    color: '#555',
  },
  kanbanBoard: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1.5rem',
  },
  column: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '1rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    minHeight: '300px',
  },
  columnTitle: {
    fontSize: '1.3rem',
    marginBottom: '1rem',
    borderBottom: '2px solid #eee',
    paddingBottom: '0.5rem',
  },
  noTasks: {
    color: '#999',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '0.8rem',
    marginBottom: '1rem',
  },
  select: {
    width: '100%',
    marginTop: '0.5rem',
    padding: '0.4rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  message: {
    padding: '2rem',
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666',
  },
};

export default MemberDashboard;
