export function TodoItemAttachmentsView({ attachments }) {
  if (!attachments?.length) return null;

  const openAttachment = async (attachment) => {
    try {
      const res  = await fetch(attachment.data);
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      const a = document.createElement("a");
      a.href = attachment.data;
      a.download = attachment.name;
      a.click();
    }
  };

  return (
    <div className="card-attachments">
      <div className="card-attach-label">
        Attachments ({attachments.length})
      </div>
      <div className="card-attach-grid">
        {attachments.map((a, i) => (
          <div
            key={i}
            className="card-attach-item"
            onClick={() => openAttachment(a)}
            title={a.name}
          >
            {a.isImage ? (
              <img src={a.data} alt={a.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            ) : (
              <div className="card-attach-file">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                  <polyline points="13 2 13 9 20 9"/>
                </svg>
                <span className="card-attach-fname">{a.name}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TodoItemAttachmentsEdit({
  attachments,
  isDark,
  maxAttachments,
  imageInputRef,
  fileInputRef,
  onFileSelect,
  onRemoveAttachment,
}) {
  const canAdd = attachments.length < maxAttachments;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
      {/* Controls */}
      <div style={{ display:"flex", alignItems:"center", gap:"0.375rem", flexWrap:"wrap" }}>
        <label
          style={{ cursor: canAdd ? "pointer" : "not-allowed", opacity: canAdd ? 1 : 0.4 }}
          className="card-ctrl-btn"
          title="Add image"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          Image
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={!canAdd}
            onChange={onFileSelect}
          />
        </label>

        <label
          style={{ cursor: canAdd ? "pointer" : "not-allowed", opacity: canAdd ? 1 : 0.4 }}
          className="card-ctrl-btn"
          title="Add file"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
          File
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            disabled={!canAdd}
            onChange={onFileSelect}
          />
        </label>

        {attachments.length > 0 && (
          <span style={{ fontSize:"0.7rem", color:"var(--text-muted)" }}>
            {attachments.length}/{maxAttachments}
          </span>
        )}
      </div>

      {/* Thumbs */}
      {attachments.length > 0 && (
        <div className="card-attach-grid">
          {attachments.map((a, i) => (
            <div key={i} className="card-attach-item" style={{ position:"relative" }}>
              {a.isImage ? (
                <img src={a.data} alt={a.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              ) : (
                <div className="card-attach-file">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                    <polyline points="13 2 13 9 20 9"/>
                  </svg>
                  <span className="card-attach-fname">{a.name}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => onRemoveAttachment(i)}
                className="attachment-remove"
                style={{ opacity: 1 }}
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
