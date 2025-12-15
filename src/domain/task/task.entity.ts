export interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId?: number;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface CreateTaskRequest {
  title: string;
  userId?: number;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  completed?: boolean;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface TaskFilters {
  completed?: boolean;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}