import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "../Image";


function IndexPage() {
    const [places, setPlaces] = useState([]);

    useEffect(()=>{
        axios.get('/places').then(response =>{
            setPlaces(response.data)
        })
    },[])

    return ( 
        <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {places.length > 0 && places.map((place, index) => (
                <Link to={'/place/'+place._id} key={index} >
                    <div className="bg-gray-500 mb-2 rounded-2xl flex">
                        {place.photos?.[0] && (
                            <Image className="rounded-2xl object-cover aspect-sqaure" src={place.photos?.[0]} alt="" />
                        )}
                    </div>
                    <h2 className="font-bold te">{place.address}</h2>
                    <h3 className="text-md xt-gray-500">{place.title}</h3>        
                    <div className="mt-2">
                        <span className="font-bold">&#8377;{place.price}</span> per night
                    </div>
                </Link>
            ))}
        </div>
     );
}

export default IndexPage;