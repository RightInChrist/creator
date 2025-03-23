import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stack,
  Alert,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';
import { 
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { useTasks } from '../../hooks/useTasks';
import { useTaskTypes } from '../../hooks/useTaskTypes';
import { TaskInput, TaskStatus, TaskPriority } from '../../types';

const TaskForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const { getTaskById, createTask, updateTask, loading, error } = useTasks();
  const { taskTypes, loading: loadingTypes } = useTaskTypes();
  
  const [formData, setFormData] = useState<TaskInput>({
    title: '',
    description: '',
    taskTypeId: 0,
    status: TaskStatus.TO_DO,
    priority: TaskPriority.MEDIUM,
    dueDate: '',
    estimatedHours: undefined,
    actualHours: undefined,
    assignedTo: '',
    createdBy: '',
    parentId: null
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [tasks, setTasks] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode && id) {
        const task = await getTaskById(parseInt(id));
        if (task) {
          setFormData({
            title: task.title,
            description: task.description || '',
            taskTypeId: task.taskTypeId,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate || '',
            estimatedHours: task.estimatedHours,
            actualHours: task.actualHours,
            assignedTo: task.assignedTo || '',
            createdBy: task.createdBy || '',
            parentId: task.parentId || null
          });
        }
      }
      
      // Fetch all tasks for parent selection (excluding the current task)
      const response = await fetch('/api/tasks');
      const allTasks = await response.json();
      if (id) {
        setTasks(allTasks.filter((task: any) => task.id !== parseInt(id)));
      } else {
        setTasks(allTasks);
      }
    };
    
    fetchData();
  }, [id, isEditMode, getTaskById]);
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.taskTypeId || formData.taskTypeId <= 0) {
      errors.taskTypeId = 'Task type is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Clear error when field is updated
      if (formErrors[name]) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };
  
  const handleSelectChange = (e: SelectChangeEvent<unknown>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Clear error when field is updated
      if (formErrors[name]) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = value === '' ? undefined : parseFloat(value);
    setFormData(prev => ({ ...prev, [name]: numberValue }));
  };
  
  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ 
      ...prev, 
      dueDate: date ? date.toISOString() : '' 
    }));
  };
  
  const handleParentChange = (e: SelectChangeEvent<unknown>) => {
    const value = e.target.value as number | '';
    setFormData(prev => ({ 
      ...prev, 
      parentId: value === '' ? null : value 
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditMode && id) {
        await updateTask(parseInt(id), formData);
        navigate(`/tasks/${id}`);
      } else {
        const newTask = await createTask(formData);
        if (newTask && newTask.id) {
          navigate(`/tasks/${newTask.id}`);
        }
      }
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };
  
  if ((isEditMode && loading) || loadingTypes) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box mb={3} display="flex" alignItems="center">
        <Button
          component={RouterLink}
          to={isEditMode && id ? `/tasks/${id}` : '/tasks'}
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          {isEditMode ? 'Back to Task' : 'Back to Tasks'}
        </Button>
        <Typography variant="h4">
          {isEditMode ? 'Edit Task' : 'Create New Task'}
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.taskTypeId}>
                <InputLabel>Task Type *</InputLabel>
                <Select
                  name="taskTypeId"
                  value={formData.taskTypeId || ''}
                  onChange={handleSelectChange}
                  label="Task Type *"
                  required
                >
                  <MenuItem value="">
                    <em>Select a task type</em>
                  </MenuItem>
                  {taskTypes.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.taskTypeId && (
                  <FormHelperText>{formErrors.taskTypeId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Parent Task</InputLabel>
                <Select
                  name="parentId"
                  value={formData.parentId ?? ''}
                  onChange={handleParentChange}
                  label="Parent Task"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {tasks.map(task => (
                    <MenuItem key={task.id} value={task.id}>
                      {task.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  {Object.values(TaskStatus).map(status => (
                    <MenuItem key={status} value={status}>
                      {status.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleSelectChange}
                  label="Priority"
                >
                  {Object.values(TaskPriority).map(priority => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Due Date"
                  value={formData.dueDate ? new Date(formData.dueDate) : null}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Estimated Hours"
                name="estimatedHours"
                type="number"
                inputProps={{ step: 0.5, min: 0 }}
                value={formData.estimatedHours ?? ''}
                onChange={handleNumberChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Actual Hours"
                name="actualHours"
                type="number"
                inputProps={{ step: 0.5, min: 0 }}
                value={formData.actualHours ?? ''}
                onChange={handleNumberChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Assigned To"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Created By"
                name="createdBy"
                value={formData.createdBy}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  component={RouterLink}
                  to={isEditMode && id ? `/tasks/${id}` : '/tasks'}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    isEditMode ? 'Update Task' : 'Create Task'
                  )}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default TaskForm; 