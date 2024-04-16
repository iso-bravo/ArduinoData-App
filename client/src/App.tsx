import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dhdata from './pages/Dhdata'
import Dhrecord from './pages/Dhrecord'
import Dhleds from './pages/Dhleds'
import Bmdata from './pages/Bmdata';
import Bmrecord from './pages/Bmrecord';
import Bmleds from './pages/Bmleds';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dhdata />} />
        <Route path="/dht11/record" element={<Dhrecord />} />
        <Route path="/dht11/leds" element={<Dhleds />}/>
        <Route path="/bmp180/data" element={<Bmdata />} />
        <Route path="/bmp180/record" element={<Bmrecord />} />
        <Route path="/bmp180/leds" element={<Bmleds />}/>
      </Routes>
    </Router>
  )
}

export default App
