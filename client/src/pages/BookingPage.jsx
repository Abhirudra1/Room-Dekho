import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"


export default function BookingPage() {
    const {id} = useParams();
    const [booking, setBooking] = useState(null)

    useEffect(()=>{
        if(id){
            axios.get('/bookings').then(response =>{
                const foundBooking = response.data.find(({_id}) => _id===id)
                if(foundBooking) {
                    setBooking(foundBooking)
                }
            })
        }
    }, [id])

    if(!booking){
        return '';
    }
    
  return (
    <div className="w-80 justify-center content-center mt-5">
        <h1 className="text-3xl mb-3 text-center">{booking.place.title}</h1>
        <div className="bg-gray-200 rounded-2xl p-4 mb-4">
            <h2>Your booking information:</h2>
            <p>Check In: {format(new Date(booking.checkIn), 'dd-MM-yyyy')}</p>
            <p>Check In:  {format(new Date(booking.checkOut), 'dd-MM-yyyy')}</p>
        </div>
        <Link to={`/place/${booking.place._id}`} className="underline text-blue-500 text-2xl">
            View Place
        </Link>
    </div>
  )
}
