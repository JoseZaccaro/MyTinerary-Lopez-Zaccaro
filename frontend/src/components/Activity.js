
const Activity = (props)=>{

    const {image, title} = props

    return (
        <div className="activity-exterior">
        <div className="activity" style={{backgroundImage:`url(${image})`}}> </div>
            <h2 className="activity-title">{title}</h2>
        </div>
        )
}


export default Activity