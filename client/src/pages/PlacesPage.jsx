/* eslint-disable react/jsx-key */
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "./Perks";
import axios from 'axios'


export default function PlacePage() {
    const {action} = useParams();

    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [photoLink, setPhotoLink] = useState('')
    const [addeddPhotos, setAddedPhotos] = useState([])
    const [description, setDescription] = useState('')
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [maxGuests, setMaxGuests] = useState(1)

    // function inputHeader(text){
    //     return (
    //         <h2 className="text-2xl mt-4">{text}</h2>
    //     )
    // }
    
    async function addPhotoByLink(ev){
        ev.preventDefault();
        const {data: fileName} = await axios.post('/upload-by-link', {link: photoLink})
        setAddedPhotos(prev =>{
            return [...prev, fileName];
        })
        setPhotoLink('')
    }

    return (
        <div>
            {action !== 'new' && (
                <div className="text-center">
                    <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Add new places
                    </Link>
                </div>
            )}
            {action === 'new' && (
                <div>
                    <form action="">
                        <h2 className="text-2xl mt-4">Title</h2>
                        <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: My lovely apartment" />
                        <h2 className="text-2xl mt-4">Address</h2>
                        <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="Address, for example: Varanasi, Uttar Pradesh, India" />
                        <h3 className="text-2xl mt-4">Photos</h3>
                        <div className="flex gap-2">
                            <input type='text' value={photoLink} onChange={ev => setPhotoLink(ev.target.value)} placeholder={'Add using a link... jpg, jpeg, png'}></input>
                            <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photos&nbsp;</button>
                        </div>
                        <div className="mt-2 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {addeddPhotos.length > 0 && addeddPhotos.map(link =>(
                                <div>
                                    <img className="rounded-2xl" src={'http://localhost:4000/uploads/'+link} alt="" />
                                </div>
                            ))}
                            <button className="flex items-center justify-center gap-1 border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                                </svg>
                                Upload
                            </button>
                        </div>
                        <h3 className="text-2xl mt-4">Description</h3>
                        <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
                        <h3 className="text-2xl mt-4">Perks</h3>
                        <div className="gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            <Perks selected={perks} onChange={setPerks} />
                        </div>
                        <h3 className="text-2xl mt-4">Extra info</h3>
                        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
                        <h3 className="text-2xl mt-4">Check in & out times</h3>
                        <div className="grid sm:grid-cols-3 gap-2">
                            <div>
                                <h3 className="mt-2 -mb-1">Check in time</h3>
                                <input type="text" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} placeholder="14:00" />
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Check out time</h3>
                                <input type="text" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} placeholder="11:00" />
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Max number of guests</h3>
                                <input type="number" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)} placeholder="4" />
                            </div>
                        </div>
                        <button className="primary mt-6 mb-8">Save</button>
                    </form>
                </div>
            )}
            
        </div>
    )
}
