const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskType = sequelize.define('TaskType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '#3498db'
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: true
});

// Function to ensure default task types exist
TaskType.ensureDefaults = async () => {
  const defaultTypes = [
    { name: 'Epic', description: 'A large body of work that can be broken down into smaller stories', color: '#9b59b6', icon: 'flag', isDefault: true },
    { name: 'Story', description: 'A user-centric feature or enhancement', color: '#2ecc71', icon: 'book', isDefault: true },
    { name: 'Task', description: 'A single unit of work', color: '#3498db', icon: 'check-square', isDefault: true },
    { name: 'Sub-Task', description: 'A smaller task that is part of a larger task', color: '#1abc9c', icon: 'list', isDefault: true },
    { name: 'Bug', description: 'A problem that needs to be fixed', color: '#e74c3c', icon: 'bug', isDefault: true }
  ];

  for (const type of defaultTypes) {
    await TaskType.findOrCreate({
      where: { name: type.name },
      defaults: type
    });
  }
};

module.exports = TaskType; 