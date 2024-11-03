/* eslint-disable react/jsx-key */

import { Link} from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";


export default function PlacesPage() {
    const [places, setPlaces] = useState('');

    useEffect(()=>{
        axios.get('/places').then(({data})=>{
            setPlaces(data)
        })
    },[])

    return (
        <div>
            <AccountNav />
                <div className="text-center">
                    <br />
                    <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Add new places
                    </Link>
                </div>
                <div className="mt-4">
                    {places.length>0 && places.map(place => (
                        <Link to={'/account/places/'+place._id} className="flex gap-4 bg-gray-200 p-4 rounded-2xl mb-3">
                            <div className="w-32 h-32 bg-gray-300 grow-0 shrink-0">
                                {place.photos.length > 0 && (
                                    <img src={place.photos[0]} alt="" />
                                )}
                            </div>
                            <div className="grow-0 shrink">
                                <h2 className="text-2xl">{place.title}</h2>
                                <p className="text-sm mt-2">{place.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
        </div>
    )
}
