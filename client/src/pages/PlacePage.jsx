
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import BookingWidget from '../BookingWidget';
import Image from '../Image';

export default function PlacePage() {
    const {id} = useParams();
    const [place, setPlace] = useState(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false)

    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data)
        })
    }, [id])

    if(!place) return '';

    if(showAllPhotos){
        return (
            <div className="absolute inset-0 bg-black text-white min-h-full">
                <div className='bg-black p-8 grid gap-4'>
                    <div>
                    <h2 className="text-3xl mr-48">Photos of {place.title}</h2>
                        <button onClick={()=> setShowAllPhotos(false)} className='fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-3xl bg-white text-black shadow shadow-gray-500 '>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            Close photos
                        </button>
                    </div>
                    {place?.photos?.length > 0 && place.photos.map((photo, index) =>(
                        <div key={index}>
                            <Image src={photo} alt="" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className='mt-8 bg-gray-100 -mx-8 px-9 pt-8'>
            <h1 className='text-3xl'>{place.title}</h1>
            <a className='flex gap-1 my-3 font-semibold underline' target='_blank' href={'https://maps.google.com/?q='+place.address}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {place.address}
            </a>
            <div className="relative">
                <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
                    <div>
                        {place.photos?.[0] && (
                            <div>
                                <Image onClick={() => setShowAllPhotos(true)} className='aspect-square object-cover cursor-pointer' src={place.photos[0]} alt="" />
                            </div>
                        )}
                    </div>
                    <div className='grid'>
                        {place.photos?.[1] && (
                            <Image onClick={() => setShowAllPhotos(true)} className='aspect-square object-cove cursor-pointerr' src={place.photos[1]} alt="" />
                        )}
                        <div className='overflow-hidden'>
                            {place.photos?.[2] && (
                                <Image onClick={() => setShowAllPhotos(true)} className='aspect-square object-cover cursor-pointer relative top-2' src={place.photos[2]} alt="" />
                            )}
                        </div>
                    </div>
                </div>
                {place.photos.length>2 && (
                    <button onClick={()=> setShowAllPhotos(true)} className='flex gap-1 absolute bg-white rounded-2xl opacity-70 bottom-2 right-2 py-2 px-4 shadow-gray-500'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        Show more photos
                    </button>
                )}
            </div>
            
            <div className='grid p-2 gap-8 mt-4 mb-8 grid-cols-1 md:grid-cols-[2fr_1fr]'>
                <div>
                    <div className='my-4'>
                        <h2 className='font-semibold text-2xl'>Description</h2>
                        {place.description}
                    </div>
                    Check-in: {place.checkIn} PM <br/>
                    Check-out: {place.checkOut} AM <br/>
                    Max number of guests: {place.maxGuests}
                </div>
                <div>
                    <BookingWidget place={place} />
                </div>
            </div>
            <div className='bg-white -mx-8 px-8 py-8 border-t'>
                <div>
                    <h2 className='font-semibold text-2xl'>Extra info</h2>
                </div>
                <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{place.extraInfo}</div>
            </div>
        </div>
    )
}
