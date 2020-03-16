import React, { Component } from 'react';
import slide1 from './slide1.jpg';
import slide2 from './slide2.jpg';
import slide3 from './slide3.jpg';
import slide4 from './slide4.jpg';

export default class HomeScreen extends Component {
  render() {
    return (
      <>
        <div id="carouselIndicators" className="carousel slide" data-ride="carousel">
          <ol className="carousel-indicators">
            <li data-target="#carouselIndicators" data-slide-to="0" className="active"></li>
            <li data-target="#carouselIndicators" data-slide-to="1"></li>
            <li data-target="#carouselIndicators" data-slide-to="2"></li>
            <li data-target="#carouselIndicators" data-slide-to="3"></li>
          </ol>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={slide1} className="d-block w-100" alt="..." />
            </div>
            <div className="carousel-item">
              <img src={slide2} className="d-block w-100" alt="..." />
            </div>
            <div className="carousel-item">
              <img src={slide3} className="d-block w-100" alt="..." />
            </div>
            <div className="carousel-item">
              <img src={slide4} className="d-block w-100" alt="..." />
            </div>
          </div>
          <a className="carousel-control-prev" href="#carouselIndicators" role="button" data-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="carousel-control-next" href="#carouselIndicators" role="button" data-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      </>
    )
  }
}
