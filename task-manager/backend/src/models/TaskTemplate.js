const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskTemplate = sequelize.define('TaskTemplate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Store the template structure as JSON
  templateStructure: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const value = this.getDataValue('templateStructure');
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue('templateStructure', JSON.stringify(value));
    }
  },
  // Store available template variables
  variables: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('variables');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('variables', JSON.stringify(value));
    }
  },
  // Store default values for variables
  defaultValues: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('defaultValues');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('defaultValues', JSON.stringify(value));
    }
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = TaskTemplate; 