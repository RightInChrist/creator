import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { tasksApi, taskTypesApi } from '../services/api';

const STATUSES = ['To Do', 'In Progress', 'Done'];
const PRIORITIES = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' }
];

const NewTaskScreen = ({ route, navigation }) => {
  const { task, isEditing } = route.params || {};
  const isEditMode = isEditing && task;
  
  const [title, setTitle] = useState(isEditMode ? task.title : '');
  const [description, setDescription] = useState(isEditMode ? task.description : '');
  const [status, setStatus] = useState(isEditMode ? task.status : STATUSES[0]);
  const [priority, setPriority] = useState(isEditMode ? task.priority : 2);
  const [dueDate, setDueDate] = useState(isEditMode && task.dueDate ? new Date(task.dueDate) : new Date());
  const [taskTypeId, setTaskTypeId] = useState(isEditMode ? task.taskTypeId : null);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasDueDate, setHasDueDate] = useState(isEditMode ? !!task.dueDate : false);
  
  const [taskTypes, setTaskTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTaskTypes();
  }, []);

  const fetchTaskTypes = async () => {
    setLoading(true);
    try {
      const data = await taskTypesApi.getAll();
      setTaskTypes(data);
      
      // Set default task type if none is selected
      if (!taskTypeId && data.length > 0) {
        const defaultType = data.find(type => type.name === 'Task') || data[0];
        setTaskTypeId(defaultType.id);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching task types:', err);
      setError('Failed to load task types. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Task title is required');
      return;
    }
    
    if (!taskTypeId) {
      Alert.alert('Error', 'Please select a task type');
      return;
    }
    
    setSaving(true);
    
    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate: hasDueDate ? dueDate.toISOString() : null,
      taskTypeId
    };
    
    try {
      if (isEditMode) {
        await tasksApi.update(task.id, taskData);
        Alert.alert('Success', 'Task updated successfully');
      } else {
        await tasksApi.create(taskData);
        Alert.alert('Success', 'Task created successfully');
      }
      navigation.goBack();
    } catch (err) {
      console.error('Error saving task:', err);
      Alert.alert('Error', 'Failed to save task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTaskTypes}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            autoCapitalize="sentences"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter task description"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Task Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={taskTypeId}
              onValueChange={(value) => setTaskTypeId(value)}
              style={styles.picker}
            >
              {taskTypes.map(type => (
                <Picker.Item 
                  key={type.id} 
                  label={type.name} 
                  value={type.id} 
                />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={status}
              onValueChange={(value) => setStatus(value)}
              style={styles.picker}
            >
              {STATUSES.map(statusOption => (
                <Picker.Item 
                  key={statusOption} 
                  label={statusOption} 
                  value={statusOption} 
                />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={priority}
              onValueChange={(value) => setPriority(value)}
              style={styles.picker}
            >
              {PRIORITIES.map(priorityOption => (
                <Picker.Item 
                  key={priorityOption.value} 
                  label={priorityOption.label} 
                  value={priorityOption.value} 
                />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <View style={styles.dueDateContainer}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
              style={styles.dueDateToggle}
              onPress={() => setHasDueDate(!hasDueDate)}
            >
              <Text style={styles.dueDateToggleText}>
                {hasDueDate ? 'Remove' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {hasDueDate && (
            <View>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {dueDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={dueDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.disabledButton]}
            onPress={handleSaveTask}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.saveButtonText}>
                {isEditMode ? 'Update Task' : 'Create Task'}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  formContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  dueDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateToggle: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  dueDateToggleText: {
    color: 'white',
    fontWeight: '500',
  },
  datePickerButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default NewTaskScreen; 