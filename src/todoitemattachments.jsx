
export function TodoItemAttachmentsView({ attachments, isDark }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className={`pl-7 space-y-2`}>
      <div
        className={`text-xs font-semibold ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Attachments ({attachments.length})
      </div>
      <div
        className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 p-2 rounded border ${
          isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
        }`}
      >
        {attachments.map((attachment, index) => (
          <div
            key={index}
            className={`relative group rounded overflow-hidden border cursor-pointer ${
              isDark ? "border-white/20 bg-white/5" : "border-gray-200 bg-white"
            }`}
            onClick={async () => {
              try {
                const res = await fetch(attachment.data);
                const blob = await res.blob();
                const fileURL = URL.createObjectURL(blob);
                window.open(fileURL, "_blank");
              } catch (e) {
                console.error("Error opening attachment:", e);
                // Fallback to downloading
                const link = document.createElement("a");
                link.href = attachment.data;
                link.download = attachment.name;
                link.click();
              }
            }}
          >
            {attachment.isImage ? (
              <div className="aspect-square">
                <img
                  src={attachment.data}
                  alt={attachment.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className={`aspect-square flex flex-col items-center justify-center p-1 ${
                  isDark ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <span className="text-2xl mb-0.5">📄</span>
                <span
                  className={`text-[10px] text-center truncate w-full px-0.5 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                  title={attachment.name}
                >
                  {attachment.name}
                </span>
              </div>
            )}
            <div
              className={`absolute bottom-0 left-0 right-0 p-1 text-[10px] ${
                isDark ? "bg-black/70 text-white" : "bg-black/70 text-white"
              }`}
            >
              <div className="truncate" title={attachment.name}>
                {attachment.name}
              </div>
            </div>
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
  return (
    <div className="space-y-2 pl-7">
      <div className="flex items-center gap-2 flex-wrap">
        <label
          className={`px-2 py-1 rounded text-xs font-medium transition-all duration-300 cursor-pointer ${
            attachments.length >= maxAttachments
              ? isDark
                ? "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
              : isDark
              ? "bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300"
          }`}
        >
          <span className="flex items-center gap-1">
            <span>📷</span>
            <span>Image</span>
          </span>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={attachments.length >= maxAttachments}
            onChange={(e) => onFileSelect(e, true)}
            className="hidden"
          />
        </label>

        <label
          className={`px-2 py-1 rounded text-xs font-medium transition-all duration-300 cursor-pointer ${
            attachments.length >= maxAttachments
              ? isDark
                ? "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
              : isDark
              ? "bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30"
              : "bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300"
          }`}
        >
          <span className="flex items-center gap-1">
            <span>📎</span>
            <span>File</span>
          </span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            disabled={attachments.length >= maxAttachments}
            onChange={(e) => onFileSelect(e, false)}
            className="hidden"
          />
        </label>

        {attachments.length > 0 && (
          <span
            className={`text-xs px-2 py-1 rounded ${
              isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"
            }`}
          >
            {attachments.length}/{maxAttachments}
          </span>
        )}
      </div>

      {attachments.length > 0 && (
        <div
          className={`p-2 rounded border ${
            isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="grid grid-cols-3 gap-2">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className={`relative group rounded overflow-hidden border ${
                  isDark ? "border-white/20 bg-white/5" : "border-gray-200 bg-white"
                }`}
              >
                {attachment.isImage ? (
                  <div className="aspect-square">
                    <img
                      src={attachment.data}
                      alt={attachment.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`aspect-square flex flex-col items-center justify-center p-1 ${
                      isDark ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <span className="text-2xl mb-0.5">📄</span>
                    <span
                      className={`text-[10px] text-center truncate w-full px-0.5 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                      title={attachment.name}
                    >
                      {attachment.name}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(index)}
                  className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 text-xs"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
