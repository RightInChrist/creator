import React from 'react';
import { Typography, Box, Grid, Paper, CircularProgress } from '@mui/material';
import { useTasks } from '../hooks/useTasks';
import { useTaskTypes } from '../hooks/useTaskTypes';
import { TaskPriority, TaskStatus } from '../types';

const Dashboard: React.FC = () => {
  const { tasks, loading: tasksLoading } = useTasks();
  const { taskTypes, loading: typesLoading } = useTaskTypes();

  const countByStatus = tasks.reduce<Record<TaskStatus, number>>((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {
    [TaskStatus.TO_DO]: 0,
    [TaskStatus.IN_PROGRESS]: 0,
    [TaskStatus.IN_REVIEW]: 0,
    [TaskStatus.DONE]: 0
  });

  const countByPriority = tasks.reduce<Record<TaskPriority, number>>((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {
    [TaskPriority.LOW]: 0,
    [TaskPriority.MEDIUM]: 0,
    [TaskPriority.HIGH]: 0,
    [TaskPriority.URGENT]: 0
  });

  const countByType = tasks.reduce<Record<number, number>>((acc, task) => {
    const typeId = task.taskTypeId;
    acc[typeId] = (acc[typeId] || 0) + 1;
    return acc;
  }, {});

  if (tasksLoading || typesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Tasks by Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tasks by Status
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(countByStatus).map(([status, count]) => (
                <Grid item xs={6} sm={3} key={status}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      bgcolor: status === 'TO_DO' ? '#f5f5f5' :
                              status === 'IN_PROGRESS' ? '#e3f2fd' :
                              status === 'IN_REVIEW' ? '#fff8e1' :
                              '#e0f2f1'
                    }}
                  >
                    <Typography variant="h5">{count}</Typography>
                    <Typography variant="body2">{status.replace('_', ' ')}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Tasks by Priority */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tasks by Priority
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(countByPriority).map(([priority, count]) => (
                <Grid item xs={6} sm={3} key={priority}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      bgcolor: priority === 'LOW' ? '#e0f2f1' :
                              priority === 'MEDIUM' ? '#e8f5e9' :
                              priority === 'HIGH' ? '#fff8e1' :
                              '#ffebee'
                    }}
                  >
                    <Typography variant="h5">{count}</Typography>
                    <Typography variant="body2">{priority}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Tasks by Type */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tasks by Type
            </Typography>
            <Grid container spacing={2}>
              {taskTypes.map(type => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={type.id}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      bgcolor: type.color ? `${type.color}20` : '#f5f5f5'
                    }}
                  >
                    <Typography variant="h5">{countByType[type.id] || 0}</Typography>
                    <Typography variant="body2">{type.name}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 