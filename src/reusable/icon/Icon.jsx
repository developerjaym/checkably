import React, { useEffect, useState } from "react";
import "./Icon.css";

function IconComponent({icon, className = "button__icon"}) {
    const [svg, setSVG] = useState("");
    useEffect(() => {
        fetch(icon.src)
        .then(resp => resp.text())
        .then(svgData => setSVG(svgData))
    }, [icon])
    return (<div aria-description={icon.alt} role="img" className={`icon ${className}`} dangerouslySetInnerHTML={{__html: svg}}/>)
}

const Icon =  React.memo(IconComponent);
export default Icon;