import React from 'react'
import { Link } from 'react-router-dom'

const ParkingCard2 = ({parking}) => {
    const options={
        edit:false,
        color:"gray",
        activeColor:"red",
        size:window.innerWidth<600?20:25,
        value:parking.rating,
        isHalf:true
    }
    console.log(parking)
  return (
    <Link  to={`/parking/${parking._id}`}>
        <div  className="h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
    <div className="container mx-auto px-4 py-8">
        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <img src={parking.images[0].url}
                    alt="Headless UI" className="w-full h-64 object-cover" />
                <div className="p-4 md:p-6">
                    <h3 className="text-xl font-semibold text-indigo-500 dark:text-indigo-300 mb-2">{parking.name}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 two-lines">
                        Address: {parking.street}, {parking.city}, {parking.state}, {parking.postal_code}
                    </p>
                    <p><span className='font-bold text-4xl'>{`₹${parking.price}`}</span></p>
                    <a href="##"
                        className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full">Learn
                        More</a>
                </div>
            </div>

            

           

          

        </div>
    </div>
</div>
    </Link>
  )
}

export default ParkingCard2