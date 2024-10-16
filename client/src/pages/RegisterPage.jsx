import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'


export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
   
  function registerUser(ev){
    ev.preventDefault();
    axios.get('http://localhost:4000/test')
  }

  return (
    <div className="m-4 grow flex items-center justify-around login">
        <div className="mb-32">
            <h1 className="text-4xl text-center m-4">Register</h1>
            <form className="max-w-md mx-auto space-y-3" onSubmit={registerUser}>
                <input type="text" placeholder="John Doe" 
                      value={name} onChange={ev => setName(ev.target.value)} />
                <input type="email" placeholder="youremail@gmail.com" 
                      value={email} onChange={ev => setEmail(ev.target.value)} />
                <input type="password" placeholder="Enter Your Password"
                      value={password} onChange={ev => setPassword(ev.target.value)} />
                <button className="primary">Submit</button>

                <div className="text-center py-2 text-gray-500">
                    Already have an account yet? <Link to={'/login'} className="underline text-black">Login Now</Link>
                </div>
            </form>
        </div> 
        
    </div>
  )
}
