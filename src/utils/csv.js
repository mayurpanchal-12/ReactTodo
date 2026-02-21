/**
 * Build CSV string from todos
 */
export function buildTodoCSV(todos) {
  if (!todos || todos.length === 0) return null;

  let csv =
    'Todo,Due Date,Completed,Priority,Category,Highlighted\n';

  todos.forEach((todo) => {
    csv += `"${todo.todo || ''}",${todo.dueDate || ''},${
      todo.completed ? 'Yes' : 'No'
    },${todo.priority || 'mid'},${todo.category || 'other'},${
      todo.highlighted ? 'Yes' : 'No'
    }\n`;
  });

  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;

  csv += `\nTotal Todos,${total}\nCompleted,${completed}\nActive,${active}\n`;

  return csv;
}

/**
 * Download CSV file for todos
 */
export function downloadTodoCSV(todos) {
  const csv = buildTodoCSV(todos);
  if (!csv) return false;

  const blob = new Blob([csv], { type: 'text/csv' });
  const downloadUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'todos_export.csv';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(downloadUrl);
  return true;
}