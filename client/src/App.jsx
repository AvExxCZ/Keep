import { useEffect, useState } from "react";
import useDebounce from "./utils/UseDebounce";

const App = () => {
  const [notes, setNotes] = useState([]);

  // Fetch notes při načtení aplikace
  useEffect(() => {
    const fetchNotes = async () => {
      const response = await fetch("http://localhost:6060/api/notes/get");
      const data = await response.json();
      setNotes(data.data);
    };
    fetchNotes();
  }, []);

  // Aktualizace poznámek lokálně (pouze v paměti)
  const updateNoteLocally = (id, key, value) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === id ? { ...note, [key]: value } : note
      )
    );
  };

  // Funkce pro zápis do databáze
  const updateNoteInDB = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:6060/api/notes/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();

      if (!result.success) {
        console.error("Error from server:", result.message);
      } else {
        console.log("Note successfully updated in DB:", result.message);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`http://localhost:6060/api/notes/delete/${id}`, {
        method: "DELETE",
      });
      console.log(`Note with id "${id}" successfully deleted.`)
    } catch (error) {
      console.error("Error updating note:", error);
    }
  }
  

  // Funkce pro debounce zápisu do databáze
  const debouncedUpdate = useDebounce(updateNoteInDB, 1000); // 1 sekunda zpoždění

  return (
    <div>
      <div className="w-screen flex flex-col gap-10">
        {notes.map((note) => (
          <div key={note._id} className="p-5 w-full bg-gray-100">
            {/* Input pro title */}
            <input
              type="text"
              value={note.title}
              className="text-2xl w-full h-fit"
              onChange={(e) => {
                updateNoteLocally(note._id, "title", e.target.value);
                debouncedUpdate(note._id, { title: e.target.value });
              }}
            />
            {/* Note ID */}
            <h1 className="text-2xl">{note._id}</h1>
            {/* Textarea pro content */}
            <textarea
              value={note.content}
              className="w-full h-fit"
              onChange={(e) => {
                updateNoteLocally(note._id, "content", e.target.value);
                debouncedUpdate(note._id, { content: e.target.value });
              }}
            />
            {/* Tags */}
            <p>
              {note.tags.map((tag, index) => (
                <span key={index} className="p-5">
                  {tag}
                </span>
              ))}
            </p>

            <button 
              className="p-2 bg-red-500 text-white font-bold rounded-md"
              onClick={ () => deleteNote(note._id) }
            >DELETE</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;