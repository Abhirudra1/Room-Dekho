import { useState } from "react"
import Perks from "./Perks";
import AddedPhotos from "../AddedPhotos";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate} from "react-router-dom";

export default function PlacesFormPage() {

    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [addedPhotos, setAddedPhotos] = useState([])
    const [description, setDescription] = useState('')
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [maxGuests, setMaxGuests] = useState(1)
    const [redirect, setRedirect] = useState(false)

    async function addNewPlace(ev){
        ev.preventDefault();
        await axios.post('/places', {
          title, address, addedPhotos,
          description, perks, extraInfo,
          checkIn, checkOut, maxGuests
        })
        .then((response) => {
          alert("Successfull Saved")
          console.log('Place saved:', response.data);
          setRedirect(true);
        })
        .catch((error) => {
          console.error("Axios error:", error.response ? error.response.data : error.message);
        });
        // alert("clicked")
        setRedirect(true);
    }

    
    if(redirect){
      return <Navigate to={'/account/places'} />
    }

  

    
  return (

    <div>
      <AccountNav />
      <form onSubmit={addNewPlace}>
        <h2 className="text-2xl mt-4">Title</h2>
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="title, for example: My lovely apartment"
        />
        <h2 className="text-2xl mt-4">Address</h2>
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="Address, for example: Varanasi, Uttar Pradesh, India"
        />

        <AddedPhotos addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        <h3 className="text-2xl mt-4">Description</h3>
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        <h3 className="text-2xl mt-4">Perks</h3>
        <div>
          <Perks selected={perks} onChange={setPerks} />
        </div>
        <h3 className="text-2xl mt-4">Extra info</h3>
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
        <h3 className="text-2xl mt-4">Check in & out times</h3>
        <div className="grid sm:grid-cols-3 gap-2">
          <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input
              type="text"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              placeholder="14:00"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input
              type="text"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              placeholder="11:00"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
              placeholder="4"
            />
          </div>
        </div>
        <button className="primary mt-6 mb-8">Save</button>
      </form>
    </div>
  );
}
