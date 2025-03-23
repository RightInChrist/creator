import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton,
  TextField,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon 
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useTasks } from '../../hooks/useTasks';
import { useTaskTypes } from '../../hooks/useTaskTypes';
import { Task, TaskStatus, TaskPriority } from '../../types';

const TaskList: React.FC = () => {
  const { tasks, loading, error, deleteTask } = useTasks();
  const { taskTypes } = useTaskTypes();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<number | string>('');
  
  const handleEdit = (id: number) => {
    navigate(`/tasks/${id}/edit`);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
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
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = search === '' || 
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description?.toLowerCase() || '').includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === '' || task.status === statusFilter;
    const matchesPriority = priorityFilter === '' || task.priority === priorityFilter;
    const matchesType = typeFilter === '' || task.taskTypeId === typeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">Error: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Tasks</Typography>
        <Button
          component={RouterLink}
          to="/tasks/new"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Task
        </Button>
      </Box>
      
      {/* Search and Filters */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField
                select
                label="Status"
                variant="outlined"
                size="small"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="">All</MenuItem>
                {Object.values(TaskStatus).map(status => (
                  <MenuItem key={status} value={status}>
                    {status.replace('_', ' ')}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                select
                label="Priority"
                variant="outlined"
                size="small"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="">All</MenuItem>
                {Object.values(TaskPriority).map(priority => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                select
                label="Type"
                variant="outlined"
                size="small"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="">All</MenuItem>
                {taskTypes.map(type => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Task List */}
      {isMobile ? (
        // Mobile view: Cards
        <Grid container spacing={2}>
          {filteredTasks.length === 0 ? (
            <Grid item xs={12}>
              <Typography align="center" color="textSecondary">
                No tasks found.
              </Typography>
            </Grid>
          ) : (
            filteredTasks.map(task => (
              <Grid item xs={12} key={task.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" component="div">
                        {task.title}
                      </Typography>
                      
                      <Chip 
                        label={task.status.replace('_', ' ')} 
                        color={getStatusColor(task.status)}
                        size="small"
                      />
                    </Box>
                    
                    <Box display="flex" gap={1} mt={1} mb={1}>
                      <Chip
                        label={task.priority}
                        size="small"
                        style={{ 
                          backgroundColor: getPriorityColor(task.priority),
                          color: '#fff' 
                        }}
                      />
                      
                      {task.taskType && (
                        <Chip
                          label={task.taskType.name}
                          size="small"
                          style={{ 
                            backgroundColor: `${task.taskType.color}40` 
                          }}
                        />
                      )}
                    </Box>
                    
                    {task.description && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {task.description.length > 100 
                          ? `${task.description.substring(0, 100)}...` 
                          : task.description}
                      </Typography>
                    )}
                    
                    {task.dueDate && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </Typography>
                    )}
                  </CardContent>
                  
                  <CardActions>
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/tasks/${task.id}`}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(task.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      ) : (
        // Desktop view: Table
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Type</TableCell>
                {!isMobile && <TableCell>Due Date</TableCell>}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No tasks found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <RouterLink to={`/tasks/${task.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {task.title}
                      </RouterLink>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={task.status.replace('_', ' ')} 
                        color={getStatusColor(task.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.priority}
                        size="small"
                        style={{ 
                          backgroundColor: getPriorityColor(task.priority),
                          color: '#fff' 
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {task.taskType && (
                        <Chip
                          label={task.taskType.name}
                          size="small"
                          style={{ 
                            backgroundColor: `${task.taskType.color}40` 
                          }}
                        />
                      )}
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '-'}
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(task.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(task.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TaskList; 