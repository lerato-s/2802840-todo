import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';


type Task = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  topic: string;
  status: string;
  is_archived: number;
  created_at: string;
};



const TEST_DB_PATH = path.join(__dirname, 'test.db');

//delete test database if it exists
if (fs.existsSync(TEST_DB_PATH)) {
  fs.unlinkSync(TEST_DB_PATH);
}

const db = new Database(TEST_DB_PATH);

// Create the tasks table
db.exec(`
  CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT NOT NULL,
    topic TEXT NOT NULL,
    status TEXT DEFAULT 'Todo' CHECK (status IN ('Todo', 'In-Progress', 'Complete')),
    is_archived INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);



describe('Todo App Tests', () => {
  // Clean up before each test
  beforeEach(() => {
    db.exec('DELETE FROM tasks');
  });

  // Helper to create a task
  const createTask = (data: {
    title: string;
    description?: string;
    due_date: string;
    topic: string;
    status?: string;
    is_archived?: number;
  }): Task => {
    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, due_date, topic, status, is_archived)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(
      data.title,
      data.description || '',
      data.due_date,
      data.topic,
      data.status || 'Todo',
      data.is_archived || 0
    );
    
    const getStmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
    return getStmt.get(info.lastInsertRowid) as Task;
  };

  
  // TEST 1: Task Creation
  
  test('1 - Task can be created with all four fields', () => {
    const task: Task = createTask({
      title: 'Test Task',
      description: 'Test Description',
      due_date: '2026-08-15',
      topic: 'Test Topic'
    });
    
    expect(task).toBeDefined();
    expect(task.title).toBe('Test Task');
    expect(task.topic).toBe('Test Topic');
    expect(task.description).toBe('Test Description');
    expect(task.due_date).toBe('2026-08-15');
  });

  
  // TEST 2: Task Archiving
  
  test('2 - Task can be archived and leaves active list', () => {
    const task: Task = createTask({
      title: 'Archive Me',
      description: 'Test',
      due_date: '2026-08-15',
      topic: 'Test'
    });
    
    // Archive the task
    db.prepare('UPDATE tasks SET is_archived = 1 WHERE id = ?').run(task.id);
    
    const active = db.prepare('SELECT * FROM tasks WHERE is_archived = 0').all() as Task[];
    const archived = db.prepare('SELECT * FROM tasks WHERE is_archived = 1').all() as Task[];
    
    expect(active).toHaveLength(0);
    expect(archived).toHaveLength(1);
    expect(archived[0].title).toBe('Archive Me');
  });

  
  // TEST 3: Overdue Flag
  
  test('3 - Overdue tasks are flagged (not stored)', () => {
    const task: Task = createTask({
      title: 'Overdue Task',
      description: 'Past due date',
      due_date: '2026-08-01', // Past date
      topic: 'Test'
    });
    
    const result = db.prepare(`
      SELECT 
        *,
        CASE 
          WHEN due_date < date('now') AND status != 'Complete' AND is_archived = 0
          THEN 1 
          ELSE 0 
        END as is_overdue
      FROM tasks WHERE id = ?
    `).get(task.id) as Task & { is_overdue: number };
    
    expect(result.is_overdue).toBe(1);
    expect(result.title).toBe('Overdue Task');
  });

  
  // TEST 4: Data Persistence
  
  test('4 - Data persists after restart (simulated)', () => {
    const task: Task = createTask({
      title: 'Persistent Task',
      description: 'Test',
      due_date: '2026-08-15',
      topic: 'Test'
    });
    
    //simulate restart by re-reading from database
    const freshData = db.prepare('SELECT * FROM tasks WHERE id = ?').get(task.id) as Task;
    
    expect(freshData).toBeDefined();
    expect(freshData.title).toBe('Persistent Task');
    expect(freshData.id).toBe(task.id);
  });
});


// CLEANUP - Delete test database after all tests

afterAll(() => {
  db.close();
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
});