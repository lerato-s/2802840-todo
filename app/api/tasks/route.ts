import db from '../../../database/db'; // database

// get tasks 
// insert task

export async function GET() {
    const tasks = db.prepare('SELECT * FROM tasks').all();
    return Response.json(tasks);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { title, description, topic, due_date} = body;

    const result = db.prepare(`
        INSERT INTO tasks (title, description, topic, due_date)
        VALUES (?, ?, ?, ?)`).run(title, description, topic, due_date);

    const newTask = db.prepare('SELECT * FROM tasks').get(result.lastInsertRowid);
    return Response.json(newTask);
}
