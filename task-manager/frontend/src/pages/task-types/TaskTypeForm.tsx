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
  FormControlLabel,
  Switch,
  CircularProgress,
  Stack,
  Alert,
  Divider
} from '@mui/material';
import { 
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useTaskTypes } from '../../hooks/useTaskTypes';
import { TaskTypeInput } from '../../types';
import { MuiColorInput } from 'mui-color-input';

const TaskTypeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const { getTaskTypeById, createTaskType, updateTaskType, loading, error } = useTaskTypes();
  
  const [formData, setFormData] = useState<TaskTypeInput>({
    name: '',
    description: '',
    color: '#3498db',
    icon: '',
    isDefault: false
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const fetchTaskType = async () => {
      if (isEditMode && id) {
        const taskType = await getTaskTypeById(parseInt(id));
        if (taskType) {
          setFormData({
            name: taskType.name,
            description: taskType.description || '',
            color: taskType.color,
            icon: taskType.icon || '',
            isDefault: taskType.isDefault
          });
        }
      }
    };
    
    fetchTaskType();
  }, [id, isEditMode, getTaskTypeById]);
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.color) {
      errors.color = 'Color is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (name === 'isDefault') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleColorChange = (newColor: string) => {
    setFormData(prev => ({ ...prev, color: newColor }));
    
    // Clear error
    if (formErrors.color) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.color;
        return newErrors;
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditMode && id) {
        await updateTaskType(parseInt(id), formData);
        navigate('/task-types');
      } else {
        const newTaskType = await createTaskType(formData);
        navigate('/task-types');
      }
    } catch (err) {
      console.error('Error saving task type:', err);
    }
  };
  
  if (isEditMode && loading) {
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
          to="/task-types"
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          Back to Task Types
        </Button>
        <Typography variant="h4">
          {isEditMode ? 'Edit Task Type' : 'Create New Task Type'}
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
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box mb={1}>
                <Typography variant="subtitle2">Color</Typography>
              </Box>
              <MuiColorInput
                value={formData.color}
                onChange={handleColorChange}
                format="hex"
                fullWidth
                error={!!formErrors.color}
                helperText={formErrors.color}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Icon (FontAwesome)"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="e.g. 'check', 'bug', 'flag'"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isDefault}
                    onChange={handleChange}
                    name="isDefault"
                    color="primary"
                  />
                }
                label="Set as Default Task Type"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box 
                sx={{ 
                  p: 2, 
                  backgroundColor: formData.color + '20',
                  borderRadius: 1,
                  border: `1px solid ${formData.color}`,
                  mb: 3
                }}
              >
                <Typography variant="subtitle1" gutterBottom>Preview</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  {formData.icon && (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: `${formData.color}30`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: formData.color
                      }}
                    >
                      {formData.icon}
                    </Box>
                  )}
                  <Typography variant="h6">
                    {formData.name || 'Task Type Name'}
                  </Typography>
                  {formData.isDefault && (
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: 'primary.light',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        ml: 1
                      }}
                    >
                      Default
                    </Typography>
                  )}
                </Box>
                {formData.description && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {formData.description}
                  </Typography>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  component={RouterLink}
                  to="/task-types"
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
                    isEditMode ? 'Update Task Type' : 'Create Task Type'
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

export default TaskTypeForm; 