/* eslint-disable react/jsx-key */

import { Link} from "react-router-dom";
import AccountNav from "../AccountNav";


export default function PlacesPage() {


    // function inputHeader(text){
    //     return (
    //         <h2 className="text-2xl mt-4">{text}</h2>
    //     )
    // }
    
    

    return (
        <div>
            <AccountNav />
                <div className="text-center">
                    List of all added places
                    <br />
                    <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Add new places
                    </Link>
                </div>
        </div>
    )
}
