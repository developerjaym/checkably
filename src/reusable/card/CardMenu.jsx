import { NavLink } from "react-router-dom";
import "./CardMenu.css";

export default function CardMenu({children, links}) {
    if(links) {
        const linkComponents = links.map(link => (<NavLink key={link.href} className="button menu-item__action" to={link.href}>{link.text}</NavLink>));
        return (<menu className="card__menu">{children} {linkComponents}</menu>)
    }
    else {
        return (<menu className="card__menu">{children}</menu>)
    }
}