import React, { useEffect, useState } from "react";
import "./Icon.css";

function IconComponent({icon, className = "button__icon"}) {
    const [svg, setSVG] = useState("");
    const cleanupSVG = (svgData) => {
        if(!svgData.includes("width")) {
            svgData = svgData.replace("svg", `svg width="24" `)
        }
        if(!svgData.includes("height")) {
            svgData = svgData.replace("svg", `svg height="24" `)
        }
        return svgData
    }
    useEffect(() => {
        fetch(icon.src)
        .then(resp => resp.text())
        .then(svgData => setSVG(cleanupSVG(svgData)))
    }, [icon])
    return (<div aria-description={icon.alt} role="img" className={`icon ${className}`} dangerouslySetInnerHTML={{__html: svg}}/>)
}

const Icon =  React.memo(IconComponent);
export default Icon;