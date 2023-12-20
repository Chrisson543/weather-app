import React from 'react';
import '../styles/changeLocationPopup.css';
import searchIcon from '../assets/search.png';
import LocationsListItem from './LocationsListItem';
import closeIcon from '../assets/close.png';

export default function ChangeLocationPopup(props){

    async function search(text){
        const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=1c0e7244338f41bcb5a153044231807&q=${text}`);
        const data = await response.json();
        return data;
    };

    const [inputText, setInputText] = React.useState('');
    const [searchItems, setSearchItems] = React.useState([]);
    const popupRef = React.useRef(null);

    function updateInputText(text){
        setInputText(text);
        if(text !== ''){
            showSearchResults(text);
        };
        
    };

    function showSearchResults(text){
        search(text).then(data => {
            setSearchItems(
                data.map(obj => {
                    return({
                        id: obj.id,
                        name: obj.name,
                        region: obj.region,
                        country: obj.country
                    })
                })
            );
            
        });
    };

    function getName(itemToCheck){
        if(itemToCheck.region === itemToCheck.name){
            return(`${itemToCheck.name}, ${itemToCheck.country}`)
        }
        else{
            return(`${itemToCheck.name}, ${itemToCheck.region}, ${itemToCheck.country}`)
        }
    };
    const searchElements = searchItems.map(item => {
        let itemName = getName(item)
        return(
            <LocationsListItem key={item.id} text={itemName} onClick={() => props.changeLocation(itemName)}/>
        );
    });

    const handleClick = (event) => {
        if(popupRef.current && !popupRef.current.contains(event.target)){
            props.togglePopup();
        }
    };

    React.useEffect(() => {
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, []);

    return(
        <div className='popup-screen'>
            <div className='popup' ref={popupRef}>
                <button onClick={props.togglePopup} className='close-icon'><img src={closeIcon}/></button>
                <h1>Enter location to search:</h1>
                <div className='body'>
                    <div className='search-bar'>
                        <input autoFocus onChange={(event) => updateInputText(event.target.value)} type='text' value={inputText}></input>
                    </div>
                    
                    <div className='locations-list'>
                        {searchElements}
                    </div>
                </div>
            </div>
        </div>
    );
};