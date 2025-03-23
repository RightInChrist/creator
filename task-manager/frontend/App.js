import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import TasksScreen from './src/screens/TasksScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import NewTaskScreen from './src/screens/NewTaskScreen';
import TaskTypesScreen from './src/screens/TaskTypesScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6200ee',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Task Manager' }} 
          />
          <Stack.Screen 
            name="Tasks" 
            component={TasksScreen} 
            options={{ title: 'All Tasks' }} 
          />
          <Stack.Screen 
            name="TaskDetail" 
            component={TaskDetailScreen} 
            options={({ route }) => ({ title: route.params?.title || 'Task Details' })} 
          />
          <Stack.Screen 
            name="NewTask" 
            component={NewTaskScreen} 
            options={{ title: 'Create New Task' }} 
          />
          <Stack.Screen 
            name="TaskTypes" 
            component={TaskTypesScreen} 
            options={{ title: 'Task Types' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
} 