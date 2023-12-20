import React from 'react';
import './styles/main.css';
import Loading from './components/Loading';
import locationLogoWhite from './assets/location-white.png';
import ForecastDay from './components/ForecastDay';
import ChangeLocationPopup from './components/ChangeLocationPopup';

export default function App(){
    const [usersLocation, setUsersLocation] = React.useState('');
    const [location, setLocation] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [forecast, setForecast] = React.useState([
        {
        weatherCondition: '',
        icon: '',
        day: '',
        date: '',
        temperature: '',
        selected: false,
        precipitation: '',
        humidity: '',
        wind: ''
    }
    ]);
    const [selectedDay, setSelectedDay] = React.useState(forecast[0]);
    const [showChangeLocationPopup, setShowChangeLocationPopup] = React.useState(false);

    async function getUsersLocation(){
        try{
            const response = await fetch("https://api.geoapify.com/v1/ipinfo?&apiKey=4e61a3b6d3714094b1d7007b889ee178", {method: 'GET'})
            const data = await response.json();
            return (`${data.city.name}, ${data.country.name}`);
        }
        catch(error){
            console.log('Error fetching location data:', error)
        }
    };
    async function getForecastData(city){
        try{
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=1c0e7244338f41bcb5a153044231807&q=${city}&days=4&aqi=no&alerts=no`);
            const data = await response.json();
            return data;
        }
        catch(error){
            console.log('Error fetching forecast data:', error)
        }
    };
    React.useEffect(() => {
        if(location === ''){
            getUsersLocation().then(data => {
                setUsersLocation(data);
                setLocation(data);
            })
        }
        
                
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        getForecastData(location).then(data => {
            const newForecastData = data.forecast.forecastday.map(forecastday => {
                var date = new Date(forecastday.date)
                return(
                    {
                        weatherCondition: forecastday.day.condition.text,
                        icon: forecastday.day.condition.icon,
                        day: days[date.getDay()],
                        date: date.toUTCString().substring(5, 16),
                        temperature: Math.floor(forecastday.day.maxtemp_c),
                        selected: false,
                        precipitation: Math.floor(forecastday.day.totalprecip_mm),
                        humidity: forecastday.day.avghumidity,
                        wind: Math.floor(forecastday.day.maxwind_kph)
                    }
                )});
            newForecastData[0].selected = true;
            setForecast(newForecastData);
            setSelectedDay(newForecastData[0]);
    
        }).catch(error => console.log('Error calling forecast function:', error))
        setLoading(false)
    }, [location]);
    
    function changeSelectedDay(day){
        let newDay = day;
        newDay.selected = true;

        forecast.map(forecastDay => {
            if(forecastDay !== day){
                forecastDay.selected = false;
            }
        });

        setSelectedDay(newDay);
    };
    function togglePopup(){
        setShowChangeLocationPopup(prevState => !prevState);
    };
    function changeLocation(newLocation){
        setLocation(newLocation);
        togglePopup();
    };

    const forecastElements = forecast.map(day => {
        return <ForecastDay key={day.date} onClick={() => changeSelectedDay(day)} {...day}/>
    });

    return(
        <div className='app'>
            {
                loading ? 
                <Loading />
                :
                <div className='main'>
                    <div className='left-section'>
                        <div className='location-info'>
                            <p className='day-of-the-week'>{selectedDay.day}</p>
                            <p className='date'>{selectedDay.date}</p>
                            <p className='location'><img className='location-logo' src={locationLogoWhite} />{location}</p>
                        </div>
                        <div className='temperature'>
                            <div className='temperature-container'>
                                <img className='weather-logo' src={selectedDay.icon}/>
                                <p className='temperature-in-celcius'>{selectedDay.temperature}&#xb0;C</p>
                            </div>
                            <p className='weather-condition'>{selectedDay.weatherCondition}</p>
                        </div>
                    </div>
                    <div className='right-section'>
                        <div className='weather-info'>
                            <p>PRECIPITATION <span>{selectedDay.precipitation} mm</span></p>
                            <p>HUMIDITY <span>{selectedDay.humidity} %</span></p>
                            <p>WIND <span>{selectedDay.wind} km/h</span></p>
                        </div>
                        <div className='weather-forecast'>
                            {forecastElements}
                        </div>
                        <button className='change-location-button' onClick={togglePopup}>
                            <img src={locationLogoWhite}/>
                            Change location
                        </button>
                    </div>
                    {showChangeLocationPopup && <ChangeLocationPopup changeLocation={changeLocation} togglePopup={togglePopup} />}
                </div>
            }
        </div>
    );
};