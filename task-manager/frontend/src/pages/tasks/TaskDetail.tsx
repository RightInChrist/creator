import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  Button, 
  Grid, 
  CircularProgress,
  Divider,
  Stack,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useTasks } from '../../hooks/useTasks';
import { TaskStatus, TaskPriority } from '../../types';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { getTaskById, deleteTask, loading } = useTasks();
  const [task, setTask] = useState<any>(null);
  
  useEffect(() => {
    const fetchTask = async () => {
      if (id) {
        const fetchedTask = await getTaskById(parseInt(id));
        setTask(fetchedTask);
      }
    };
    
    fetchTask();
  }, [id, getTaskById]);
  
  const handleDelete = async () => {
    if (id && window.confirm('Are you sure you want to delete this task?')) {
      const success = await deleteTask(parseInt(id));
      if (success) {
        navigate('/tasks');
      }
    }
  };
  
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TO_DO: return 'default';
      case TaskStatus.IN_PROGRESS: return 'primary';
      case TaskStatus.IN_REVIEW: return 'warning';
      case TaskStatus.DONE: return 'success';
      default: return 'default';
    }
  };
  
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW: return '#81c784';
      case TaskPriority.MEDIUM: return '#64b5f6';
      case TaskPriority.HIGH: return '#ffa726';
      case TaskPriority.URGENT: return '#e57373';
      default: return '#64b5f6';
    }
  };
  
  if (loading || !task) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Button
          component={RouterLink}
          to="/tasks"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: isMobile ? 2 : 0 }}
        >
          Back to Tasks
        </Button>
        
        <Box>
          <Button
            component={RouterLink}
            to={`/tasks/${id}/edit`}
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
          <Typography variant="h4" component="h1" gutterBottom>
            {task.title}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: isMobile ? 2 : 0 }}>
            <Chip 
              label={task.status.replace('_', ' ')} 
              color={getStatusColor(task.status)}
            />
            
            <Chip
              label={task.priority}
              style={{ 
                backgroundColor: getPriorityColor(task.priority),
                color: '#fff' 
              }}
            />
            
            {task.taskType && (
              <Chip
                label={task.taskType.name}
                style={{ 
                  backgroundColor: `${task.taskType.color}40` 
                }}
              />
            )}
          </Box>
        </Box>
        
        {task.description && (
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
            <Typography variant="body1" whiteSpace="pre-wrap">
              {task.description}
            </Typography>
          </Box>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              {task.dueDate && (
                <Box display="flex" alignItems="center" gap={1}>
                  <ScheduleIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">Due Date</Typography>
                    <Typography variant="body1">
                      {format(new Date(task.dueDate), 'MMMM d, yyyy')}
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {(task.estimatedHours || task.actualHours) && (
                <Box display="flex" alignItems="center" gap={1}>
                  <AccessTimeIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">Hours</Typography>
                    <Typography variant="body1">
                      {task.estimatedHours && `Estimated: ${task.estimatedHours}`}
                      {task.estimatedHours && task.actualHours && ', '}
                      {task.actualHours && `Actual: ${task.actualHours}`}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              {task.assignedTo && (
                <Box display="flex" alignItems="center" gap={1}>
                  <PersonIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">Assigned To</Typography>
                    <Typography variant="body1">{task.assignedTo}</Typography>
                  </Box>
                </Box>
              )}
              
              {task.createdBy && (
                <Box display="flex" alignItems="center" gap={1}>
                  <PersonIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">Created By</Typography>
                    <Typography variant="body1">{task.createdBy}</Typography>
                  </Box>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
      
      {task.parent && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Parent Task</Typography>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Typography variant="subtitle1" component={RouterLink} to={`/tasks/${task.parent.id}`} sx={{ textDecoration: 'none', color: 'primary.main' }}>
                  {task.parent.title}
                </Typography>
                <Chip 
                  label={task.parent.status.replace('_', ' ')} 
                  color={getStatusColor(task.parent.status)}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Paper>
      )}
      
      {task.subtasks && task.subtasks.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Subtasks ({task.subtasks.length})</Typography>
          <Stack spacing={2}>
            {task.subtasks.map((subtask: any) => (
              <Card key={subtask.id} variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="subtitle1" component={RouterLink} to={`/tasks/${subtask.id}`} sx={{ textDecoration: 'none', color: 'primary.main' }}>
                      {subtask.title}
                    </Typography>
                    <Chip 
                      label={subtask.status.replace('_', ' ')} 
                      color={getStatusColor(subtask.status)}
                      size="small"
                    />
                  </Box>
                  {subtask.description && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {subtask.description.length > 100 
                        ? `${subtask.description.substring(0, 100)}...` 
                        : subtask.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default TaskDetail; 