import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList,
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { taskTypesApi } from '../services/api';

const COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', 
  '#1abc9c', '#34495e', '#e67e22', '#16a085', '#d35400'
];

const ICONS = [
  'flag', 'check-square', 'list', 'bug', 'book', 
  'file', 'star', 'bell', 'alert', 'message'
];

const TaskTypesScreen = () => {
  const [taskTypes, setTaskTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingTaskType, setEditingTaskType] = useState(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTaskTypes();
  }, []);

  const fetchTaskTypes = async () => {
    setLoading(true);
    try {
      const data = await taskTypesApi.getAll();
      setTaskTypes(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching task types:', err);
      setError('Failed to load task types. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (taskType = null) => {
    if (taskType) {
      // Edit mode
      setEditingTaskType(taskType);
      setName(taskType.name);
      setDescription(taskType.description);
      setSelectedColor(taskType.color);
      setSelectedIcon(taskType.icon);
    } else {
      // Create mode
      setEditingTaskType(null);
      setName('');
      setDescription('');
      setSelectedColor(COLORS[0]);
      setSelectedIcon(ICONS[0]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTaskType(null);
  };

  const handleSaveTaskType = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Task type name is required');
      return;
    }
    
    setSaving(true);
    
    const taskTypeData = {
      name,
      description,
      color: selectedColor,
      icon: selectedIcon
    };
    
    try {
      if (editingTaskType) {
        await taskTypesApi.update(editingTaskType.id, taskTypeData);
        Alert.alert('Success', 'Task type updated successfully');
      } else {
        await taskTypesApi.create(taskTypeData);
        Alert.alert('Success', 'Task type created successfully');
      }
      
      fetchTaskTypes();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving task type:', err);
      Alert.alert('Error', 'Failed to save task type. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTaskType = (taskType) => {
    if (taskType.isDefault) {
      Alert.alert('Error', 'Cannot delete default task types');
      return;
    }
    
    Alert.alert(
      'Delete Task Type',
      `Are you sure you want to delete "${taskType.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await taskTypesApi.delete(taskType.id);
              Alert.alert('Success', 'Task type deleted successfully');
              fetchTaskTypes();
            } catch (err) {
              console.error('Error deleting task type:', err);
              Alert.alert('Error', 'Failed to delete task type. Please try again.');
            }
          }
        },
      ]
    );
  };

  const renderTaskTypeItem = ({ item }) => (
    <View style={styles.taskTypeItem}>
      <View style={styles.taskTypeHeader}>
        <View style={[styles.colorIcon, { backgroundColor: item.color }]} />
        <Text style={styles.taskTypeName}>{item.name}</Text>
      </View>
      
      <Text style={styles.taskTypeDescription} numberOfLines={2}>
        {item.description || 'No description'}
      </Text>
      
      <View style={styles.taskTypeActions}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleOpenModal(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.deleteButton, 
            item.isDefault && styles.disabledButton
          ]}
          onPress={() => handleDeleteTaskType(item)}
          disabled={item.isDefault}
        >
          <Text style={styles.deleteButtonText}>
            {item.isDefault ? 'Default' : 'Delete'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
    <View style={styles.container}>
      <FlatList
        data={taskTypes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTaskTypeItem}
        contentContainerStyle={styles.listContainer}
      />
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => handleOpenModal()}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      
      {/* Task Type Form Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTaskType ? 'Edit Task Type' : 'Create Task Type'}
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter task type name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter task type description"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Color</Text>
              <View style={styles.colorGrid}>
                {COLORS.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorItem,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColorItem
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Icon</Text>
              <Text style={styles.iconNote}>
                Note: Icons are represented by text in this demo
              </Text>
              <View style={styles.iconGrid}>
                {ICONS.map(icon => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconItem,
                      selectedIcon === icon && styles.selectedIconItem
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Text style={styles.iconText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={handleCloseModal}
                disabled={saving}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.saveModalButton, saving && styles.disabledButton]}
                onPress={handleSaveTaskType}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.saveModalButtonText}>
                    {editingTaskType ? 'Update' : 'Create'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  listContainer: {
    padding: 15,
  },
  taskTypeItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  taskTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  taskTypeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  taskTypeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  taskTypeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  editButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 10,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200ee',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  colorItem: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedColorItem: {
    borderWidth: 2,
    borderColor: '#333',
  },
  iconNote: {
    fontSize: 12,
    color: '#888',
    marginTop: -5,
    marginBottom: 5,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  iconItem: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  selectedIconItem: {
    borderWidth: 2,
    borderColor: '#6200ee',
    backgroundColor: '#f0e6ff',
  },
  iconText: {
    fontSize: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelModalButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelModalButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveModalButton: {
    flex: 1,
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TaskTypesScreen; 