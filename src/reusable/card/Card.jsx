import "./Card.css"

export default function Card({className, children}) {
    return (<section className={`card ${className}`}>
        {children}
    </section>)
}