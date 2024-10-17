import { Link, useParams } from "react-router-dom";


export default function PlacePage() {
    const {action} = useParams();

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
                        <input type="text" placeholder="title, for example: My lovely apartment" />
                        <h2 className="text-2xl mt-4">Address</h2>
                        <input type="text" placeholder="Address, for example: Varanasi, Uttar Pradesh, India" />
                        <h3 className="text-2xl mt-4">Photos</h3>
                        <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            <button className="border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">+</button>
                        </div>
                    </form>
                </div>
            )}
            
        </div>
    )
}
