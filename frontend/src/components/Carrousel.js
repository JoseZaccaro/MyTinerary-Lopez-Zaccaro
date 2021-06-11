import React, { useState } from 'react';

import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators
} from 'reactstrap';

import Slide from './Slide';

const items = [
    [
    {id: 1, altText: 'Tokyo', src:'Tokyo.jpg',caption: 'Japan'},
    {id: 2, altText: 'New York',src:'NewYork.jpg',caption: 'USA'},
    {id: 3, altText: 'Paris',src:'Paris.jpg',caption: 'France'},
    {id: 4, altText: 'Seoul',src:'Seoul.jpg',caption: 'South Korea'},0 ] ,

    [
    {id: 5, altText: 'London',src:'London.jpg',caption: 'United Kingdom'},
    {id: 6, altText: 'Osaka',src:'Osaka.jpg',caption: 'Japan'},
    {id: 7, altText: 'Shanghai',src:'Shanghai.jpg',caption: 'China'},
    {id: 8, altText: 'Moscow',src:'Moscow.jpg',caption: 'Russia'},1 ] ,

    [
    {id: 9, altText: 'Sao Paulo',src:'SaoPaulo.jpg',caption: 'Brazil'},
    {id: 10, altText: 'Córdoba',src:'opcionCordoba.jpg',caption: 'Argentina'},
    {id: 11, altText: 'Toronto',src:'Toronto.jpg',caption: 'Canada'},
    {id: 12, altText: 'Miami',src:'Miami.jpg',caption: 'USA'},2 ]

  ]

const Carrousel = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }
  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }
  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }
  const slides = items.map((array) => {
    return (
      <CarouselItem
      onExiting={() => setAnimating(true)}
      onExited={() => setAnimating(false)}
      key = {array[4]}
      >
        <div className="slide-exterior-container">
          <Slide array={array} />
        </div>
      </CarouselItem>
    );
  });

  return (
    <section className="carousel-section" style={{backgroundImage:"url('/assets/fondo.jpg')"}}>
      <div className="carrousel-h2">
        <h2 > Popular MYTINERARIES!</h2>
      </div>
      <Carousel
        className= "carrousel"
        activeIndex={activeIndex}
        next={next}
        previous={previous}
      >
        <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
        {slides}
        <CarouselControl  direction="next" directionText="Next" onClickHandler={next}/>
        <CarouselControl  direction="prev" directionText="Previous" onClickHandler={previous} />
      </Carousel>
    </section>
  );
}

export default Carrousel;

