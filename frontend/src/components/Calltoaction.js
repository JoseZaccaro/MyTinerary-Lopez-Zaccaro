import Button from "./Button"

const CallToAction = ({toTop})=>{
    return(

        <section className="calltoaction-section" style={{backgroundImage:"url('/assets/fondo2.jpg')"}}>
            <div className="callToAction-modal" style={{backgroundImage:"url('/assets/CallToAction.jpg')"}}>
                <div className="callToAction-text">
                    <h2>EXPLORE </h2>
                    <h2>THE DREAM DESTINATION!</h2>
                    <h4>Offering comprehensive travel solutions</h4>
                    <h4> to individuals and groups</h4>
                </div>
                <div className="callToAction-button">   
                    <Button toTop={toTop} />
                </div>
            </div>
        </section>

    )
}

export default CallToAction