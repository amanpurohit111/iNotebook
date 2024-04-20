import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";
const Login = (props) => {
    const [credentials, setCredentials] = useState({email:"",password:""})
    let navigate = useNavigate();
    const handelSubmit = async(e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email: credentials.email,password: credentials.password})
            
          });
          
          const json = await response.json();
          console.log(json);
          if(json.success){
            //rediect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Login Successfully","success")

            navigate("/");

          }else{
            props.showAlert("Invalid Details","danger")
          }
    }
    const onChange = (e) =>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
       }
  return (
    <div className='contanier mt-3'>
      <h2>Login to Continue to iNotebook</h2>
      <form onSubmit={handelSubmit}>
  <div className="form-group my-2">
    <label htmlFor="exampleInputEmail1">Email address</label>
    <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name='email' aria-describedby="emailHelp" placeholder="Enter email"/>
  </div>
  <div className="form-group my-2">
    <label htmlFor="exampleInputPassword1">Password</label>
    <input type="password" className="form-control" value={credentials.password} id="password" onChange={onChange} name='password' placeholder="Password"/>
  </div>
  <button type="submit" className="btn btn-primary" >Login</button>
</form>
    </div>
  )
}

export default Login
