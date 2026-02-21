// PDF download for todos
export async function downloadTodoPDF(todos) {
  if (!todos || todos.length === 0) return false;

  try {
    const { jsPDF } = await import(
      'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'
    );

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const startX = 14;
    let currentY = 15;

    const columnWidths = [8, 50, 30, 18, 20, 20, 18];
    const headers = [
      '#',
      'Todo',
      'Due Date',
      'Completed',
      'Priority',
      'Category',
      'Highlighted',
    ];

    /* ---------- Title ---------- */
    doc.setFontSize(14);
    doc.text('Todo App – Tasks', startX, currentY);
    currentY += 8;

    doc.setFontSize(10);

    /* ---------- Header Row ---------- */
    doc.setFillColor(0, 121, 107);
    doc.setTextColor(255, 255, 255);
    doc.rect(startX, currentY, pageWidth - 28, 8, 'F');

    let x = startX;
    headers.forEach((header, i) => {
      doc.text(header, x + 2, currentY + 5.5);
      x += columnWidths[i];
    });

    currentY += 10;
    doc.setTextColor(0, 0, 0);

    /* ---------- Data Rows ---------- */
    todos.forEach((todo, index) => {
      if (currentY > 190) {
        doc.addPage('landscape');
        currentY = 15;
      }

      const rowData = [
        index + 1,
        (todo.todo || '').slice(0, 35),
        todo.dueDate ? new Date(todo.dueDate).toLocaleString() : '',
        todo.completed ? 'Yes' : 'No',
        todo.priority || 'mid',
        todo.category || 'other',
        todo.highlighted ? 'Yes' : 'No',
      ];

      x = startX;
      rowData.forEach((cell, i) => {
        doc.text(String(cell), x + 2, currentY + 5);
        x += columnWidths[i];
      });

      currentY += 7;
    });

    /* ---------- Summary ---------- */
    currentY += 10;

    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;

    doc.setFont(undefined, 'bold');
    doc.text(
      `Total Todos: ${total} | Completed: ${completed} | Active: ${active}`,
      startX,
      currentY
    );

    doc.save('todos_export.pdf');
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return false;
  }
}