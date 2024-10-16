import { Link } from "react-router-dom";


export default function LoginPage() {
  return (
    <div className="m-4 grow flex items-center justify-around login">
        <div className="mb-32">
            <h1 className="text-4xl text-center m-4">Login</h1>
            <form className="max-w-md mx-auto space-y-3">
                <input type="email" placeholder="youremail@gmail.com" />
                <input type="password" placeholder="Enter Your Password" />
                <button className="primary">Login</button>

                <div className="text-center py-2 text-gray-500">
                    Don&apos;t have an account yet? <Link to={'/register'} className="underline text-black">Register Now</Link>
                </div>
            </form>
        </div> 
        
    </div>
  )
}
