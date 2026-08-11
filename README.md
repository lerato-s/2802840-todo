# My Todo App - Documentation

## Third-Party Code

-**better-sqlite3**- Easier to learn and write (Just normal SQL)
-**TypeScript**- Detects errors before the apllication, which prevents runtime crashes.
-**Tailwind CSS**- Allows one to design user interface dinside the HTML or Javascript components
-**React**- Used to build interactive user interface components.

## Database Design

### Table

#### `tasks` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier for each task |
| `title` | TEXT | NOT NULL | Task title |
| `description` | TEXT | - | Task description (optional) |
| `due_date` | TEXT | NOT NULL | Due date in YYYY-MM-DD format |
| `topic` | TEXT | NOT NULL | Task category (e.g., Work, Personal, Study) |
| `status` | TEXT | DEFAULT 'Todo' | Status: 'Todo', 'In-Progress', or 'Complete' |
| `is_archived` | INTEGER | DEFAULT 0 | 0 = no, 1 = yes |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### Relationships

- **Single-table design** - No relationships between tables
- **Archive**: Implemented using `is_archived` flag (tasks are never deleted)
- **Overdue**: Calculated at read time using:

```sql
CASE 
  WHEN due_date < date('now') AND status != 'Complete' AND is_archived = 0
  THEN 1 
  ELSE 0 
END as is_overdue
```

### Schema
```sql
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT NOT NULL,
  topic TEXT NOT NULL,
  status TEXT DEFAULT 'Todo' CHECK (status IN ('Todo', 'In-Progress', 'Complete')),
  is_archived INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Running It

- Node.js : v20.x or higher
- npm : v10.x or higher

### Installation & Setting up
1. Clone the repository
    ```bash
    git clone https://github.com/lerato-s/2802840-todo
    cd 2802840-todo
    ```

2. Install dependencies
    ```bash
    npm install
    ```

3. Start server
    ```bash
    npm run dev
    ```
    
4. Open your browser to http://localhost:3000

