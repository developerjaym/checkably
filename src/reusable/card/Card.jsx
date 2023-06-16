import "./Card.css"

export default function Card({children}) {
    return (<section className="card">
        {children}
    </section>)
}