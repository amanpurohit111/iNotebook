import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/NoteContext';

const AddNote = (props) => {
    const context = useContext(noteContext);
  const { addNote} = context;

  const [note, setNote] = useState({title:"",description:"",tag:""})
  const handleclick = (e) =>{
    e.preventDefault();
       addNote(note.title,note.description,note.tag);
      setNote({ title:"",description:"",tag:""})
      props.showAlert("Added Successfully","success")


  }
  const onchange = (e) =>{
   setNote({...note,[e.target.name]:e.target.value})
  }
  return (
    <div className="contanier my-3">
      <h1>Add a Note</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name='title'
            value={note.title}
            aria-describedby="emailHelp"
            onChange={onchange}
            minLength={5}
                    required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Desceiption
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            name='description'
            value={note.description}
            onChange={onchange}
            minLength={5}
                    required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name='tag'
            value={note.tag}
            onChange={onchange}
          />
        </div>
        <button type="submit" className="btn btn-primary" onClick={handleclick} disabled={note.title.length < 5 || note.description.length < 5}>
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNote;
