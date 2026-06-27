import { useState, useEffect } from "react";

const Main = () => {
  // Initialize notes state from localStorage with migration from legacy format
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("note");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => ({
            id: item.id,
            text: item.text !== undefined ? item.text : (item.note || ""),
            completed: item.completed !== undefined ? item.completed : false,
          }));
        }
      } catch (e) {
        console.error("Failed to parse notes from localStorage", e);
      }
    }
    return [];
  });

  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Handle adding a new todo
  function handleAddNote() {
    const trimmed = note.trim();
    if (!trimmed) {
      alert("Text Not Found");
      return;
    }

    const newNote = { id: Date.now(), text: trimmed, completed: false };
    setNotes([...notes, newNote]);
    setNote("");
  }

  // Handle deleting a todo
  const handleDelete = (id) => {
    const newNotes = notes.filter((obj) => obj.id !== id);
    setNotes(newNotes);
  };

  // Toggle todo completion status
  const handleToggleComplete = (id) => {
    const newNotes = notes.map((obj) => {
      if (obj.id === id) {
        return { ...obj, completed: !obj.completed };
      }
      return obj;
    });
    setNotes(newNotes);
  };

  // Enter edit mode for a specific todo
  const handleStartEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  // Save the edited todo text
  const handleSaveEdit = (id) => {
    const trimmed = editText.trim();
    if (!trimmed) {
      alert("Todo text cannot be empty");
      return;
    }
    const newNotes = notes.map((obj) => {
      if (obj.id === id) {
        return { ...obj, text: trimmed };
      }
      return obj;
    });
    setNotes(newNotes);
    setEditingId(null);
    setEditText("");
  };

  // Discard changes and exit edit mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // Persist notes list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("note", JSON.stringify(notes));
  }, [notes]);

  return (
    <div className="w-[100%] h-[88vh] flex justify-center flex-col items-center">
      <div className="w-[60%] h-[20%] gap-2 flex items-center">
        <input
          className="w-[80%] pl-[15px] h-[50px] rounded-md border-[#dadada] border-[2px] border-solid"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          type="text"
        />
        <button
          onClick={handleAddNote}
          className="w-[20%] h-[50px] bg-green-500 rounded-md text-[1.3rem] font-semibold text-white cursor-pointer"
        >
          Add
        </button>
      </div>

      <div className="w-[60%] h-[80%] overflow-y-scroll pr-1">
        {notes.map((obj) => {
          const isEditing = editingId === obj.id;
          return (
            <div
              key={obj.id}
              className="w-[100%] flex items-center p-[10px] mb-2 rounded-md bg-[#efefef] justify-between"
            >
              {/* Left Side: Checkbox & Text/Input */}
              <div className="w-[70%] flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={obj.completed || false}
                  onChange={() => handleToggleComplete(obj.id)}
                  disabled={editingId !== null}
                  className="w-5 h-5 cursor-pointer accent-green-600 rounded shrink-0"
                />

                {isEditing ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-[100%] pl-[10px] h-[40px] rounded-md border-[#dadada] border-[2px] border-solid bg-white text-[1.1rem] outline-none"
                    autoFocus
                  />
                ) : (
                  <span
                    className={`text-[1.1rem] truncate select-none ${
                      obj.completed ? "line-through opacity-60" : ""
                    }`}
                  >
                    {obj.text}
                  </span>
                )}
              </div>

              {/* Right Side: Action Buttons */}
              <div className="w-[28%] flex gap-2 justify-end">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(obj.id)}
                      className="w-[48%] h-[40px] rounded-md bg-green-500 text-white text-[1.1rem] font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="w-[48%] h-[40px] rounded-md bg-gray-500 text-white text-[1.1rem] font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStartEdit(obj.id, obj.text)}
                      disabled={editingId !== null}
                      className={`w-[48%] h-[40px] rounded-md bg-blue-500 text-white text-[1.1rem] font-semibold cursor-pointer hover:opacity-90 transition-opacity ${
                        editingId !== null ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(obj.id)}
                      disabled={editingId !== null}
                      className={`w-[48%] h-[40px] rounded-md bg-red-500 text-white text-[1.1rem] font-semibold cursor-pointer hover:opacity-90 transition-opacity ${
                        editingId !== null ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Main;