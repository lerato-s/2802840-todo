import db from '../../../../database/db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id} = await params;
  const body = await request.json();

  //checking if the task exists
  const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existingTask) {
    return Response.json({ error: 'Task not found' }, { status: 404 });
  }

  if (body.status !== undefined) {
    const validStatuses = ['Todo', 'In-Progress', 'Complete'];
    if (!validStatuses.includes(body.status)) {
      return Response.json(
        { error: 'Status must be Todo, In-Progress, or Complete' },
        { status: 400 }
      );
    }
  }

  
  const allowedFields = ['title', 'description', 'due_date', 'topic', 'status', 'is_archived'];

  const fieldsToUpdate = Object.keys(body).filter(key => allowedFields.includes(key));

  if (fieldsToUpdate.length === 0) {
    return Response.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');

  const values = fieldsToUpdate.map(field => body[field]);

  const stmt = db.prepare(`UPDATE tasks SET ${setClause} WHERE id = ?`);
  stmt.run(...values, id);

  const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  return Response.json(updatedTask);
}