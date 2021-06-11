
const Slide = ({array})=>{

    return(<>{array.map(item => {
            if(item.src){
                return(
                    <div className="slide-interior-container" key={item.id} >
                    <div className="inner-slide" style = {{backgroundImage:`url('./assets/cities/${item.src}') `} }>
                        <div className="slide-text">
                    <h2>{item.altText}</h2>
                    <p>{item.caption}</p>
                        </div>
                    </div>
                    </div>
                )
            }else{
                return null
                }
            })}
        </>)
}

export default Slide