const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require("express-validator");


//Route 1: get all the notes using: GET "/api/auth/getuser", login required
router.get('/fetchallnotes',fetchuser, async(req, res)=>{
  try {
    
 
    const notes = await Note.find({user: req.user.id});
    res.json(notes)
  }catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
})
//Route 2: add a new notes using: post "/api/auth/addnote", login required
router.post('/addnote',fetchuser, 
[
    body("title", "Enter valid title").isLength({ min: 3 }),
    body("description", "description must be at least 5 characters").isLength({
      min: 5,
    }),
],
async(req, res)=>{
  try {
    const {title,description,tag} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note = new Note({
      title, description, tag, user: req.user.id
    })
    const saveNote = await note.save()
    res.json(note)
  }catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
})

//Route 3: update existing notes using: post "/api/auth/updatenote", login required
router.put('/updatenote/:id',fetchuser, 
async(req, res)=>{
  const {title,description,tag} = req.body;
  try {
    
// create new note object
const newNote = {};
if(title){newNote.title = title};
if(description){newNote.description = description};
if(tag){newNote.tag = tag};

//find the note to be updated and update id.
let note = await Note.findById(req.params.id)
if(!note){return res.status(404).send("not found")}

if(note.user.toString() !== req.user.id){
  return res.status(401).send("not allowed");
}

note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
res.json({note});
}catch (error) {
  console.error(error.message);
  res.status(500).send("internal server error");
}
})
//Route 4: delete existing notes using: delete "/api/auth/deletenote", login required
router.delete('/deletenote/:id',fetchuser, 
async(req, res)=>{
  try {
    
  //find the note to be updated and update id.
let note = await Note.findById(req.params.id)
if(!note){return res.status(404).send("not found")}

//Allow deletion onlu if user owns this note
if(note.user.toString() !== req.user.id){
  return res.status(401).send("not allowed");
}

note = await Note.findByIdAndDelete(req.params.id)
res.json({"success":"Note has been deleted", note:note});
} catch (error) {
  console.error(error.message);
  res.status(500).send("internal server error");
}
})
module.exports = router


