const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TaskType = require('./TaskType');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('TO_DO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'),
    allowNull: false,
    defaultValue: 'TO_DO'
  },
  priority: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
    allowNull: false,
    defaultValue: 'MEDIUM'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estimatedHours: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  actualHours: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  assignedTo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Tasks',
      key: 'id'
    }
  },
  // New fields
  gitRepo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  product: {
    type: DataTypes.STRING,
    allowNull: true
  },
  feature: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Type-specific fields
  jobToBeDone: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userStory: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  stepsToReproduce: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  definitionOfDone: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Linked task relationships (in addition to parent-child)
  relatedTasks: {
    type: DataTypes.TEXT, // Store as JSON string of task IDs
    allowNull: true,
    get() {
      const value = this.getDataValue('relatedTasks');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('relatedTasks', value ? JSON.stringify(value) : null);
    }
  }
}, {
  timestamps: true
});

// Define relationships
Task.belongsTo(TaskType, { foreignKey: 'taskTypeId', as: 'taskType' });
Task.belongsTo(Task, { foreignKey: 'parentId', as: 'parent' });
Task.hasMany(Task, { foreignKey: 'parentId', as: 'subtasks' });

module.exports = Task; 