import axios from 'axios';
import React, { useEffect, useState } from 'react';

function DhdataC() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);

useEffect(() => {
  axios.get('http://localhost:3000/dh_data/'
  )
    .then(response => {
      setTemperature(response.data.temperature);
      setHumidity(response.data.humidity);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}, []);

    return (
      <div className=' px-20 py-14'>
        <div className=" px-44">
        <h1 className="text-white text-3xl pt-7 pb-12">DHT11 DATA</h1>
            <div  className=" gap-5">
              <div className=' flex gap-5'>
              <h1 className=' text-white text-3xl'>Temperature:</h1>
              <h1 className=' text-white text-3xl'>{temperature}</h1>
              </div>
              <div className=" flex gap-24 mt-8">
                <h1 className=' text-white text-3xl mr-2'>Umbral:</h1>
                <div className=" flex gap-5">
                  <input type="number" className="border border-slate-300 rounded-md
                  py-2 px-4 w-28"></input>
                  <div className=' flex text-white text-xl bg-[#592CD8] justify-center
                  hover:bg-[#7048de] active:bg-violet-700 focus:outline-none
                    focus:ring focus:ring-indigo-300 cursor-pointer px-6 py-1
                    rounded-md'>
                    Send
                  </div>
                </div>
              </div>
            </div>

            <div  className=" gap-5 mt-20">
              <div className=' flex gap-16'>
              <h1 className=' text-white text-3xl mr-3'>Humidity:</h1>
              <h1 className=' text-white text-3xl'>{humidity}</h1>
              </div>
              <div className=" flex gap-24 mt-8">
                <h1 className=' text-white text-3xl mr-2'>Umbral:</h1>
                <div className=" flex gap-5">
                  <input type="number" className="border border-slate-300 rounded-md
                  py-2 px-4 w-28"></input>
                  <div className=' flex text-white text-xl bg-[#592CD8] justify-center
                  hover:bg-[#7048de] active:bg-violet-700 focus:outline-none
                    focus:ring focus:ring-indigo-300 cursor-pointer px-6 py-1
                    rounded-md'>
                    Send
                  </div>
                </div>
              </div>
            </div>
            </div>
      </div>
    )
  }
  
  export default DhdataC