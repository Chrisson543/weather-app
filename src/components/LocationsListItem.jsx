import React from 'react';

export default function LocationsListItem(props){
    return(
        <div className='locations-list-div'>
            <button onClick={props.onClick} className='locations-list-item'>{props.text}</button>
        </div>
    );
};