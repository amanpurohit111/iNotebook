import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name:"", email:"",password:"", cpassword:""})
    const {name, email, password} = credentials;
    let navigate = useNavigate();
    const handelSubmit = async(e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({name, email,password})
            
          });
          
          const json = await response.json();
          console.log(json);
          if(json.success){
            //rediect
            localStorage.setItem('token', json.authtoken);
            navigate("/");
            props.showAlert("Account Create Successfully","success")
            
          }else{
            props.showAlert("Invalid Credentials","danger")
          }
    }
    const onChange = (e) =>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
       }
  return (
    <div className='contanier mt-3'>
      <h2>Create an account to use iNotebook</h2>

      <form onSubmit={handelSubmit}>
  <div className="form-group my-2">
    <label htmlFor="name">Name</label>
    <input type="text" className="form-control" id="name" name='name' aria-describedby="emailHelp" onChange={onChange} placeholder="Enter Name"/>
</div>
<div className="form-group my-2">
    <label htmlFor="email">Email address</label>
    <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange} placeholder="Enter email"/>
</div>
  <div className="form-group my-2">
    <label htmlFor="password">Password</label>
    <input type="password" className="form-control" id="password" name='password' onChange={onChange} placeholder="Password" minLength={5} required/>
  </div>
  <div className="form-group my-2">
    <label htmlFor="cpassword">Confirm Password</label>
    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} placeholder="Password" minLength={5} required/>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default Signup
