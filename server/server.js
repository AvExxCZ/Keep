// import .env souboru
require("dotenv").config()

// základní import express a funkce na připojení databáze
const express = require("express")
const connectDB = require("./database/db")

// import modelu/struktury Note v databázi
const Note = require("./models/Note")

// setup aplikace
const app = express()
const PORT = process.env.PORT || 6060

// připojíme databázi přes db.js
connectDB()

// json middleware
app.use(express.json())

// vytvoření express routeru
const router = express.Router()


// vytvoření jednotlivých routerů a controllerů

router.get("/get", async function(req, res){
  try {
    const allNotes = await Note.find()
    if(allNotes?.length > 0){
      res.status(200).json({
        success: true,
        message: "List of notes successfully fetched.",
        data: allNotes
      })
    } else {
      res.status(404).json({
        success: false,
        message: "No books found in collection!"
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong!"
    })
  }
})

router.get("/get/:id", async function(req, res){
  try {
    const noteDetails = await Note.findById(req.params.id)
    if(!noteDetails){
      res.status(404).json({
        success: false,
        message: "Something went wrong!"
      })
    }
    res.status(200).json({
      success: true,
      data: noteDetails
    })
  } catch (error) {
    console.error(error)
    res.status(404).json({
      success: false,
      message: "Couldn't find note with current id!"
  })
  }
})

router.post("/add", async function(req, res){
  try {
    const newNote = await Note.create(req.body)
    if(newNote){
      res.status(201).json({
        success: true,
        message: "Note successfully added.",
        data: newNote
      })
    }
  } catch (error) {
    console.error(error)
  }
})

router.put("/update/:id", async function(req, res){
  try {
    const updatedNoteData = req.body
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      updatedNoteData,
      { new: true }
    )
    if(!updatedNote){
      res.status(404).json({
        success: false,
        message: "Something went wrong!"
      })
    }
    res.status(200).json({
      success: true,
      message: "Note successfully updates."
    })
  } catch (error) {
    console.error(error)
    res.status(404).json({
      success: false,
      message: "Couldn't find note with current id!"
    })
  }
})

router.delete("/delete/:id", async function(req, res){
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id)
    if(!deletedNote){
      res.status(404).json({
        success: false,
        message: "Something went wrong!"
      })
    }
    res.status(200).json({
      success: true,
      message: "Note successfully deleted.",
      data: deletedNote
    })
  } catch (error) {
    console.error(error)
    res.status(404).json({
      success: false,
      message: "Couldn't find note with current id!"
    })
  }
})


// připojení routerů z note-routes.js
app.use("/api/notes", router)

// zapneme server na portu PORT
app.listen(PORT, function(){
  console.log(`Server is running on port ${PORT}`)
})



