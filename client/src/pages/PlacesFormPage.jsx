import axios from "axios";
import {  useEffect, useState } from "react";
import { Navigate, useParams} from "react-router-dom";
import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import AccountNav from "../AccountNav";

export default function PlacesFormPage() {
    const {id} = useParams();
    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    
    const [addedPhotos, setAddedPhotos] = useState([])
    const [description, setDescription] = useState('')
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [maxGuests, setMaxGuests] = useState(1)

    const [redirect, setRedirect] = useState(false);

    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get('/places/'+id)
    }, [id])


    async function addNewPlace(ev) {
        ev.preventDefault();
        try {
            const response = await axios.post('/places', {
                title, address, addedPhotos,
                description, perks, extraInfo,
                checkIn, checkOut, maxGuests,
            });
            if (response.status === 200) {
                setRedirect(true);
            } else if (response.status === 401) {
                alert('Invalid token or unauthorized');
            } else if (response.status === 422) {
                alert('Failed to create place');
            } else {
                console.error('Failed to create place:', response);
            }
        } catch (error) {
            console.error('Error creating place:', error);
        }
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

                <h3 className="text-2xl mt-4">Photos</h3>
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

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
