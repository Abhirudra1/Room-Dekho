import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from 'axios'
import { UserContext } from "../UserContext";


export default function LoginPage() {
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUser} = useContext(UserContext)


  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try{
      const {data} = await axios.post('/login', {email, password}, {withCredentials: true});
      setUser(data);
      alert("Login successfull")
      setRedirect(true)
    // eslint-disable-next-line no-unused-vars
    } catch(e){
      alert("Login Failed")
    }
  }

  if(redirect){
    return <Navigate to={'/'} />
  }


  return (
    <div className="m-4 grow flex items-center justify-around login">
        <div className="mb-32">
            <h1 className="text-4xl text-center m-4">Login</h1>
            <form className="max-w-md mx-auto space-y-3" onSubmit={handleLoginSubmit}>
                <input type="email" placeholder="youremail@gmail.com" 
                value={email} 
                onChange={ev => setEmail(ev.target.value) } />
                <input type="password" placeholder="Enter Your Password"
                value={password}
                onChange={ev => setPassword(ev.target.value)} />

                <button className="primary">Login</button>

                <div className="text-center py-2 text-gray-500">
                    Don&apos;t have an account yet? <Link to={'/register'} className="underline text-black">Register Now</Link>
                </div>
            </form>
        </div> 
        
    </div>
  )
}
