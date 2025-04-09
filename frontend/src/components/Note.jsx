import React, { useState } from "react";
import "../styles/Note.css";

function Note({ note, onDelete, onUpdate }) {
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-GB");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);

  // Get the current user's ID from localStorage
  const currentUserId = localStorage.getItem("user_id");
  // Check if the current user is the author of the note
  const isAuthor = note.author === parseInt(currentUserId);

  const handleUpdate = () => {
    onUpdate(note.id, { title: editedTitle, content: editedContent });
    setIsEditing(false);
  };

  return (
    <div className="note-container">
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="edit-input"
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="edit-textarea"
          />
          <div className="button-group">
            <button className="save-button" onClick={handleUpdate}>
              Save
            </button>
            <button
              className="cancel-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="note-title">{note.title}</p>
          <p className="note-content">{note.content}</p>
          <div className="note-meta">
            <p className="note-author">
              By: {note.author_username || "Unknown"}
            </p>
            <p className="note-date">{formattedDate}</p>
          </div>
          {isAuthor && (
            <div className="button-group">
              <button
                className="update-button"
                onClick={() => setIsEditing(true)}
              >
                Update
              </button>
              <button
                className="delete-button"
                onClick={() => onDelete(note.id)}
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Note;
