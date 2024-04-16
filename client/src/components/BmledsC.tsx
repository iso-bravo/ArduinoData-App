import React, { useState } from 'react';
import axios from 'axios';

function BmledsC() {

    const [num, setNum] = useState('');

    const sendPostRequestAmarillo= async (state: number) => {
        try {
            const response = await axios.post(`http://92.168.115.26:3000/B?val=${state}`);
            console.log(response.data);
        } catch (error) {
            console.error('Error al enviar solicitud POST:', error);
        }
    };

    const sendPostRequestAzul = async (state: number) => {
        try {
            const response = await axios.post(`http://92.168.115.26:3000/B?val=${state}`);
            console.log(response.data);
        } catch (error) {
            console.error('Error al enviar solicitud POST:', error);
        }
    };

    const sendPostRequestRojo = async (state: number) => {
        try {
            const response = await axios.post(`http://92.168.115.26:3000/B?val=${state}`);
            console.log(response.data);
        } catch (error) {
            console.error('Error al enviar solicitud POST:', error);
        }
    };
    

    return (
        <div className=" px-44 py-20">
            <h1 className="text-white text-4xl pt-7 pb-14">BMP180 LEDS</h1>
            <div>
                <div className="flex gap-20">
                    <h1 className=' text-white text-4xl mr-2'>LED Amarillo</h1>
                    <div className=" flex gap-5">
                    <button className=' flex text-white text-md items-center bg-[#592CD8] justify-center
                    hover:bg-[#7048de] active:bg-violet-700 focus:outline-none
                        focus:ring focus:ring-indigo-300 cursor-pointer px-8 py-1
                        rounded-md'
                        onClick={() => sendPostRequestAmarillo(255)}>
                        ON
                    </button>
                    <button className=' flex text-white text-md items-center bg-[#592CD8] justify-center
                    hover:bg-[#7048de] active:bg-violet-700 focus:outline-none
                        focus:ring focus:ring-indigo-300 cursor-pointer px-7 py-1
                        rounded-md'
                        onClick={() => sendPostRequestAmarillo(0)}>
                        OFF
                    </button>
                    </div>
                </div>
                <div className="flex gap-28 mt-8">
                    <h1 className=' text-white text-4xl mr-4'>LED Azul</h1>
                    <div className=" flex gap-5">
                    <button className=' flex text-white text-md items-center bg-[#592CD8] justify-center
                    hover:bg-[#7048de] active:bg-violet-700 focus:outline-none
                        focus:ring focus:ring-indigo-300 cursor-pointer px-8 py-1
                        rounded-md'
                        onClick={() => sendPostRequestAzul(255)}>
                        ON
                    </button>
                    <button className=' flex text-white text-md items-center bg-[#592CD8] justify-center
                    hover:bg-[#7048de] active:bg-violet-700 focus:outline-none
                        focus:ring focus:ring-indigo-300 cursor-pointer px-7 py-1
                        rounded-md'
                        onClick={() => sendPostRequestAzul(0)}>
                        OFF
                    </button>
                    </div>
                </div>
                <div className="flex gap-32 mt-8">
                    <h1 className=' text-white text-4xl mr-5'>LED Rojo</h1>
                    <div className=" flex gap-5">
                    <button className=' flex text-white text-md items-center bg-[#592CD8] justify-center
                    hover:bg-[#7048de] active:bg-violet-700 focus:outline-none
                        focus:ring focus:ring-indigo-300 cursor-pointer px-8 py-1
                        rounded-md'
                        onClick={() => sendPostRequestRojo(255)}>
                        ON
                    </button>
                    <button className=' flex text-white text-md items-center bg-[#592CD8] justify-center
                    hover:bg-[#7048de] active:bg-violet-700 focus:outline-none
                        focus:ring focus:ring-indigo-300 cursor-pointer px-7 py-1
                        rounded-md'
                        onClick={() => sendPostRequestRojo(0)}>
                        OFF
                    </button>
                    <input type="number" className="border border-slate-300 rounded-md
                    py-2 px-4 w-28"
                    value={num}
                    onChange={(e) => setNum(e.target.value)}></input>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BmledsC;