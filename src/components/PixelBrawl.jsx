import React, {useEffect, useState} from 'react'
import "./PixelBrawl.css"

export default function PixelBrawl() {

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
      }, []);
  
    return (
        
        <div className={`pixelBrawl ${isVisible ? 'visible' : ''}`}>
          <h1>Pixel-Brawl</h1>
      </div>
    )
}
