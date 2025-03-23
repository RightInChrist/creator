// Task status enum
export enum TaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE'
}

// Task priority enum
export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// Task type interface
export interface TaskType {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Task interface
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  assignedTo?: string;
  createdBy?: string;
  parentId?: number;
  taskTypeId: number;
  createdAt: string;
  updatedAt: string;
  taskType?: TaskType;
  parent?: Task | null;
  subtasks?: Task[];
  gitRepo?: string;
  product?: string;
  feature?: string;
  jobToBeDone?: string;
  userStory?: string;
  stepsToReproduce?: string;
  definitionOfDone?: string;
  relatedTasks?: number[] | Task[];
  siblings?: Task[];
}

// Task input interface
export interface TaskInput {
  title: string;
  description?: string;
  taskTypeId: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  assignedTo?: string;
  createdBy?: string;
  parentId?: number | null;
  gitRepo?: string;
  product?: string;
  feature?: string;
  jobToBeDone?: string;
  userStory?: string;
  stepsToReproduce?: string;
  definitionOfDone?: string;
  relatedTasks?: number[];
}

// Task template interface
export interface TaskTemplate {
  id: number;
  name: string;
  description?: string;
  templateStructure: TaskTemplateItem[];
  variables: string[];
  defaultValues: Record<string, string>;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Task template item interface (represents a task in the template)
export interface TaskTemplateItem {
  id: number | string; // Local ID for reference within the template
  title: string;
  description?: string;
  taskTypeId: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  estimatedHours?: number;
  assignedTo?: string;
  gitRepo?: string;
  product?: string;
  feature?: string;
  jobToBeDone?: string;
  userStory?: string;
  stepsToReproduce?: string;
  definitionOfDone?: string;
  subtasks?: TaskTemplateItem[];
  relatedTasks?: (number | string)[]; // Array of template item IDs
}

// Task template input interface
export interface TaskTemplateInput {
  name: string;
  description?: string;
  templateStructure: TaskTemplateItem[];
  variables?: string[];
  defaultValues?: Record<string, string>;
  createdBy?: string;
}

// Task generation input interface
export interface TaskGenerationInput {
  variables: Record<string, string>;
}

// Task type input interface
export interface TaskTypeInput {
  name: string;
  description?: string;
  color: string;
  icon?: string;
  isDefault?: boolean;
}

// API error interface
export interface ApiError {
  message: string;
  error?: string;
} 