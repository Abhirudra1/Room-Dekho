import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Navigate, useParams } from "react-router-dom"
import axios from "axios"
import PlacePage from "./PlacesPage"
import AccountNav from "../AccountNav"


export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null)
  const {ready,user, setUser} = useContext(UserContext)

  async function logout() {
    await axios.post('/logout')
    setRedirect('/')
    setUser(null)
  }

  let {subpage} = useParams();
  if(subpage === undefined){
    subpage = 'profile';
  }

  if(!ready){
    return 'Loading...';
  }

  if(ready && !user && !redirect){
    return <Navigate to={'/login'} />
  }

  
  if(redirect){
    return <Navigate to={redirect} />
  }

  

  return (
    <div>

      <AccountNav />

      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email}) <br />
          <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
        </div>
      )}


      {subpage === 'places' && (
        <div>
          <PlacePage />
        </div>
      )}
    </div>
  )
}
