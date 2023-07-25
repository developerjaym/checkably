import { useEffect, useState } from "react";
import "./Decoration.css";
import { decorationManager } from "./DecorationService";

export default function Decoration() {
    const [decorations, setDecorations] = useState([])
    useEffect(()=> {
        const id = decorationManager.subscribe((decorationList) => 
            setDecorations(decorationList))
        return () => decorationManager.unsubscribe(id)
    }, [])
    const decorationElements = decorations.map(decoration => <div key={decoration.id} className={`decoration decoration--${decoration.type}`}></div>)
    return (<dialog open={decorations.length} className="decoration__dialog">
    <div className="decoration__container">

        {decorationElements}
    </div>
    </dialog>)
}