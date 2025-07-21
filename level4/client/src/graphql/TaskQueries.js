import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks {
    getTasks {
      id
      title
      status
      deadline
      project {
        title
      }
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: ID!, $status: String!) {
    updateTaskStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;
