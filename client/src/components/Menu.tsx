

function Menu() { 
    const Menus = [
        {title: "DHT11 DATA", link: "/"},
        {title: "DHT11 RECORD", link: "/dht11/record"},
        {title: "DHT11 LEDS", link: "/dht11/leds"},
        {title: "BMP180 DATA", link: "/bmp180/data"},
        {title: "BMP180 RECORD", link: "/bmp180/record"},
        {title: "BMP180 LEDS", link: "/bmp180/leds"},
    ];
    return (
        <div className={`"w-1/4" duration-300 h-screen p-5 pt-16 drop-shadow-2xl 
            rounded-r-md bg-[#13152B] relative`}>
            <ul className="p-6">
                {Menus.map((menu, index) =>(
                <h1 key={index} className = "text-white text-xl flex mb-9 cursor-pointer hover:text-[#c3c3c3]">
                    <a href={menu.link}>{menu.title}</a>
                </h1>
                ))}
            </ul>
        </div>
    );
};
  
export default Menu;
