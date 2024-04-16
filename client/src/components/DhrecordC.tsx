import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Data {
    id: number;
    temperatura: number;
    humedad: number;
    fechahora: string;
}

const DhrecordC: React.FC = () => {
    const [data, setData] = useState<Data[]>([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get<Data[]>('http://localhost:3000/dh_record');
            setData(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };

        fetchData();
    }, []);

    return (
        <div className=" py-20 px-44">
        <h1 className="text-white text-3xl mb-4">DHT11 RECORD</h1>
        <table className="table-auto">
            <thead>
            <tr>
                <th className="text-white text-2xl px-4 py-2">ID</th>
                <th className="text-white text-2xl px-4 py-2">Temperature</th>
                <th className="text-white text-2xl px-4 py-2">Humidity</th>
                <th className="text-white text-2xl px-4 py-2">DateTime</th>
            </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                <tr key={item.id}>
                    <td className="text-white text-2xl border px-4 py-2">{item.id}</td>
                    <td className="text-white text-2xl border px-4 py-2">{item.temperatura}</td>
                    <td className="text-white text-2xl border px-4 py-2">{item.humedad}</td>
                    <td className=" text-white text-2xl border px-4 py-2">{item.fechahora}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
    );
};

export default DhrecordC;