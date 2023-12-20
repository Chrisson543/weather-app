import React from 'react';
export default function ForecastDay(props){
    const [selected, setSelected] = React.useState(props.selected);
    function onHover(){
        if(selected !== true){
            setSelected(true);
        };
        
    };
    function onExit(){
        if(selected !== true){
            setSelected(false)
        };
        
    };
    
    return(
        <div onClick={props.onClick} onMouseOver={() => onHover()} onMouseLeave={() => onExit()} className={`forecast-day ${props.selected && 'selected'}`}>
            <img src={props.icon} />
            <p className='day'>{props.day.substr(0,3)}</p>
            <p className='temperature'>{props.temperature}&#xb0;c</p>
        </div>
    );
};