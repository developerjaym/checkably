import icons from "../../icons/Icons";
import "./Logo.css";


export default function Logo() {
    return (<div className="logo">
        <img className="logo__img" src={icons.logo.src} alt={icons.logo.alt} height={48} width={48} />
        <h1 className="logo__text">Checkably</h1>
    </div>)
}