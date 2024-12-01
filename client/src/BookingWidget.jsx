/* eslint-disable react/prop-types */

import { useState } from "react"
import {differenceInCalendarDays} from 'date-fns'
import axios from 'axios'
import { Navigate } from "react-router-dom";


export default function BookingWidget({place}) {
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState('')
    
    let numberOfNights = 0;
    if(checkIn && checkOut){
        numberOfNights = differenceInCalendarDays(new Date(checkOut),new Date(checkIn))
    }



    async function bookThisPlace() {
        const response = await axios.post('/bookings', {
          checkIn,checkOut,numberOfGuests,name,phone,
          place:place._id,
          price:numberOfNights * place.price,
        });
        const bookingId = response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
      }

    if(redirect){
        return <Navigate to={redirect} />
    }


  return (
    <>
        <div className='bg-white shadow p-4 rounded-2xl'>
                        <div className='text-2xl text-center'>
                            Price: {place.price} &#8377;/ per night
                        </div>
                        <div className='border rounded-2xl mt-4 '>
                            <div className="flex justify-evenly">
                                <div className='py-3 px-4'>
                                    <label htmlFor="checkIn">Check-in: </label>
                                    <input type="date" id='checkIn' 
                                            value={checkIn} 
                                            onChange={ev => setCheckIn(ev.target.value)} />
                                </div>
                                <div className='py-3 px-4 border-l'>
                                    <label htmlFor="checkOut">Check-out: </label>
                                    <input type="date" id='checkOut' 
                                            value={checkOut} 
                                            onChange={ev => setCheckOut(ev.target.value)} />
                                </div>
                            </div>
                            <div className='py-3 px-4 border-t'>
                                <label htmlFor="maxGuests">Number of guests: </label>
                                <input type="number" id='maxGuests' 
                                        value={numberOfGuests} 
                                        onChange={ev => setNumberOfGuests(ev.target.value)} />
                            </div>
                            {numberOfNights > 0 && (
                                <div className='py-3 px-4 border-t'>
                                    <label htmlFor="name">Your full name: </label>
                                    <input type="text" id='name' 
                                            value={name} 
                                            onChange={ev => setName(ev.target.value)} />
                                    <label htmlFor="phone">Phone no.: </label>
                                    <input type="tel" id='phone' 
                                            value={phone} 
                                            onChange={ev => setPhone(ev.target.value)} />
                                </div>
                            )}
                        </div>
                        <button onClick={bookThisPlace} className='primary mt-4'>
                            Book this place
                            {numberOfNights > 0 && (
                                <span> &#8377;{numberOfNights * place.price}</span>
                            )

                            }
                        </button>
                    </div>
    </>
  )
}
