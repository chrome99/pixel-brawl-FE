import React, {useEffect, useState} from "react";
import "./HealthBar.css"

function HealthBar ({  precentage, position, username, score}) {

    const [color, setColor] = useState('green')

    useEffect(()=>{
        barColor(precentage)
    }, [precentage])

    const bar = () => {
       if (Object.keys(position).includes('right')) return 'right'
       if (Object.keys(position).includes('left')) return 'left'       
    }

    const barColor = (precentage) => {
        if(precentage > 50) setColor('green')
        if(precentage < 50) setColor('red')
        if(precentage === 0) setColor('inherit')
    }

    return (
        <div className="healthBarContainer" style={position}>
        <p className={bar()}>{username}</p>
        <div className="healthBarWrapper" >
            <div className="healthBarFiller" style={{width: `${precentage}%`, backgroundColor: color}}>
                <span className="healthBarLabel" >{precentage > 0 ? `${precentage}%` : "DEAD"}</span>
            </div>
        </div>
        <p className={bar()}>{score}</p>
        </div>
    );
  };
  
  export default HealthBar;
  