import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  IconButton,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTaskTypes } from '../../hooks/useTaskTypes';

const TaskTypeList: React.FC = () => {
  const { taskTypes, loading, error, deleteTaskType } = useTaskTypes();
  const navigate = useNavigate();
  
  const handleEdit = (id: number) => {
    navigate(`/task-types/${id}/edit`);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task type?')) {
      await deleteTaskType(id);
    }
  };
  
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
        <Typography variant="h4">Task Types</Typography>
        <Button
          component={RouterLink}
          to="/task-types/new"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Task Type
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {taskTypes.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">No task types found.</Typography>
            </Paper>
          </Grid>
        ) : (
          taskTypes.map(type => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={type.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    height: 8,
                    backgroundColor: type.color
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {type.icon && (
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: `${type.color}30`,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: type.color
                        }}
                      >
                        {type.icon}
                      </Box>
                    )}
                    <Typography variant="h6" component="div">
                      {type.name}
                    </Typography>
                    {type.isDefault && (
                      <Typography
                        variant="caption"
                        sx={{
                          backgroundColor: 'primary.light',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          ml: 'auto'
                        }}
                      >
                        Default
                      </Typography>
                    )}
                  </Box>
                  
                  {type.description && (
                    <Typography variant="body2" color="textSecondary">
                      {type.description}
                    </Typography>
                  )}
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(type.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(type.id)}
                      disabled={type.isDefault}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default TaskTypeList; 