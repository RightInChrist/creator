const sequelize = require('../config/database');
const TaskType = require('./TaskType');
const Task = require('./Task');

// Define associations
// (Already defined in each model file)

// Function to initialize models and database
const initDatabase = async () => {
  try {
    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
    
    // Ensure default task types exist
    await TaskType.ensureDefaults();
    console.log('Default task types created');
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  TaskType,
  Task,
  initDatabase
}; 