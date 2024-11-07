/* eslint-disable react/prop-types */


export default function BookingWidget({place}) {
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
                                    <input type="date" id='checkIn' />
                                </div>
                                <div className='py-3 px-4 border-l'>
                                    <label htmlFor="checkOut">Check-out: </label>
                                    <input type="date" id='checkOut' />
                                </div>
                            </div>
                            <div className='py-3 px-4 border-t'>
                                <label htmlFor="maxGuests">Number of guests: </label>
                                <input type="number" id='maxGuests' />
                            </div>
                        </div>
                        <button className='primary mt-4'>Book this place</button>
                    </div>
    </>
  )
}
