import "./CardHeader.css"

export default function CardHeader({title, icon}) {
    return (<header className="card__header">
        {icon ? <img className="header__img" src={icon.src} alt={icon.alt} width={32} height={32}/> : null}
        <h2>{title}</h2>
    </header>)
}