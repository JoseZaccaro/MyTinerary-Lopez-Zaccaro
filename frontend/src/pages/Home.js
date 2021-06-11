import React from 'react'
import Carrousel from '../components/Carrousel'
import CallToAction from '../components/Calltoaction'
import Hero from '../components/Hero'


export default class Home extends React.Component{
      componentDidMount(){
        window.scroll({
          top: 0,
          left: 0,
        })        
      }

    render(){
      
        return(
          <div className="contenedor">
            <Hero />
            <CallToAction />
            <Carrousel />
          </div>

        )
    }
}

