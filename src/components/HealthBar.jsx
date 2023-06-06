import React from "react";
import "./HealthBar.css"

function HealthBar ({ color, precentage, position }) {  
    return (
        <div className="healthBarContainer" style={position}>
            <div className="healthBarFiller" style={{width: `${precentage}%`, backgroundColor: precentage > 0 ? color : "inherit"}}>
                <span className="healthBarLabel" >{precentage > 0 ? `${precentage}%` : "DEAD"}</span>
            </div>
        </div>
    );
  };
  
  export default HealthBar;
  