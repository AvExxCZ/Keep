import { useEffect, useState } from "react"

const App = () => {

  const [notes, setNotes] = useState([])

  const [noteContent, setNoteContent] = useState([])
  

  useEffect(function(){
    const fetchNotes = async () => {
      const response = await fetch("http://localhost:6060/api/notes/get")
      const data = await response.json()
      setNotes(data.data)
    }

    fetchNotes()
  }, [])

  async function handleDelete(id){

  }


  // const NoteForm = function(){
  //   const [formData, setFormData] = useState({title: "", content: ""})
  // }

  return (
    <div>
      <form>
        <input type="text" placeholder="Title" />
        <input type="text" placeholder="Content" />
        <button type="submit">Submit</button>
      </form>
      <div className="w-screen flex flex-col gap-10">
        {
          notes.map(function(note, index){

            return (
              <div key={index} className="p-5 w-full bg-gray-100" >
                <h1 className="text-2xl">{note.title}</h1>
                <h1 className="text-2xl">{note._id}</h1>
                <input type="textarea" value={note.content} className="w-full h-fit" />
                <p>
                {
                  note.tags.map(function(tag, index){
                    return <span key={index} className="p-5">{tag}</span>
                  })
                }
                </p>
                <p>{note.color}</p>
                <p>{note.pin ? "true" : "false"}</p>
                <button onClick={
                  () => handleDelete(note._id)
                } >Delete</button>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default App