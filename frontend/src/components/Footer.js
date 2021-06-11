import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCity, faHome } from '@fortawesome/free-solid-svg-icons';


const Footer = () => {
    
    const toTopSmooth = ()=>{
        window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
    
    return(
        <section className="footer-section">
            <footer>
                <div className="foot-tools">
                        <div className="social-container">
                                <div className="social-text"> 
                                    <h2 className="foot-nav-text-title">Social Networks</h2>  
                                </div> 
                                <div className="social-images">
                                <div className="three-social">
                                    <img src="/icons/Facebook.png" alt="social-media"></img>
                                    <img src="/icons/Twitter.png" alt="social-media"></img>
                                </div>
                                <div className="three-social">
                                    <img src="/icons/tumblr.png" alt="social-media"></img>
                                    <img src="/icons/Instagram.png" alt="social-media"></img>
                                </div>
                            </div>
                        </div>
                        <nav className="foot-navbar">
                            <ul>
                                <li className="foot-nav-text-title">Navigate</li>
                                <li><Link to="/" onClick={toTopSmooth}> <FontAwesomeIcon icon={faHome} className="iconos-foot-nav"/> Home</Link></li>
                                <li><Link to="/cities" onClick={toTopSmooth}> <FontAwesomeIcon icon={faCity} className="iconos-foot-nav"/> Cities</Link></li>
                            </ul>
                        </nav>

                        <article className="foot-articles">
                            <ul>
                                <li className="foot-nav-text-title">Policies</li>
                                <li>Legal Warning</li>
                                <li>Privacy Policy</li>
                                <li>Cookies Policy</li>
                                <li>Quality Policy</li>
                            </ul>
                        </article>  
                </div>
                <div className="foot-copy"> Copyright &copy; - MYTINERARY All Rights Reserved. </div>
            </footer>
    </section>
    )
}

export default Footer