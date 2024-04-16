import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Data {
    id: number;
    temperature: number;
    pressure: number;
    date_time: string;
}

const BmrecordC: React.FC = () => {
    const [data, setData] = useState<Data[]>([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get<Data[]>('http://127.0.0.1:3000/bm_record/');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };

        fetchData();
    }, []);

    return (
        <div className=" py-20 px-44">
        <h1 className="text-white text-3xl mb-4">BMP180 RECORD</h1>
        <table className="table-auto">
            <thead>
            <tr>
                <th className="text-white text-2xl px-4 py-2">ID</th>
                <th className="text-white text-2xl px-4 py-2">Temperature</th>
                <th className="text-white text-2xl px-4 py-2">Pressure</th>
                <th className="text-white text-2xl px-4 py-2">DateTime</th>
            </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                <tr key={item.id}>
                    <td className="text-white text-2xl border px-4 py-2">{item.id}</td>
                    <td className="text-white text-2xl border px-4 py-2">{item.temperature}</td>
                    <td className="text-white text-2xl border px-4 py-2">{item.pressure}</td>
                    <td className=" text-white text-2xl border px-4 py-2">{item.date_time}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
    );
};

export default BmrecordC;