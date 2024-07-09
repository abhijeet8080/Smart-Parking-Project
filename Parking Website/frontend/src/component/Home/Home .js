import React, { useEffect } from 'react';
import { CgScrollV } from "react-icons/cg";
import "./Home.css"
import bg from "../../video/bg.mp4"
import ParkingCard from './ParkingCard';
import { useDispatch, useSelector } from "react-redux"
import { getAllParkings } from '../../store/reducers/parkingSlice';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import ParkingCard2 from './ParkingCard2';
const Home = () => {
  const dispatch = useDispatch();
  const { parkings,loading,error } = useSelector(state => state.parkings);

 
  useEffect(() => {
    if(error){
      toast.error(error)
    }
    dispatch(getAllParkings({}))
  }, [dispatch,error]);
  return (
    <><ToastContainer />
    <MetaData title={"Park Safe"}/>
      {loading?<Loader />:<>
      <div className={`relative bg-[${bg}] rounded-xl home`}>
       {/* <video className='inset-0 w-full h-full object-cover filter blur-sm absolute rounded-xl ' autoPlay muted loop  src={bg}></video> */}
        <div className="hero min-h-screen backdrop-blur-sm">
          <div className="hero-content text-center flex items-center justify-center">
            <div className="max-w-md">
              <h1 className="text-9xl font-bold text-white flex items-center">Park <span className='headertext text-9xl'>Safe</span></h1>
              <p className="py-6 text-white text-xl text-center">FIND BEST PARKING FOR YOUR VEHICLE</p>
              <a className='btn' href="#container">
                <button className='flex'>
                  Scroll <CgScrollV />
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div>
      <h2 class="text-3xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-8" id='container'>
            Featured Parkings
        </h2>
        <div className="container  items-center justify-center mb-10 max-w-[1320px] mx-auto grid lg:grid-cols-4 md:grid-cols-4 gap-4 ">
          {parkings && parkings.map((parking) => (
            <>
            <ParkingCard key={parking.id} parking={parking} />
            {/* <ParkingCard2 key={parking.id} parking={parking}/> */}
            </>
          ))}
        </div>
        
      </div>
      </>}
    </>
  );
}

export default Home;
