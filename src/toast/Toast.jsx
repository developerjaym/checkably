import { useEffect, useState } from "react";
import "./Toast.css";
import { toastManager } from "./ToastService";

function Toast() {
    const [toasts, setToasts] = useState([])
    useEffect(()=> {
        const id = toastManager.subscribe((toastList) => 
            setToasts(toastList))
        return () => toastManager.unsubscribe(id)
    }, [])
    const toastElements = toasts.map(toast => <div key={toast.id} className={`toast toast--${toast.mood}`}><p>{toast.message}</p><button onClick={() => toastManager.cancel(toast.id)} className="button button--icon toast__button">X</button></div>)
    return (<dialog open={toasts.length} className="toast__container">
        {toastElements}
    </dialog>)
}

export {Toast}