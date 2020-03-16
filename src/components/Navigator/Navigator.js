import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo';
import rootContext from '../../context/rootContext';

export default class Navigator extends Component {
  static contextType = rootContext;

  render() {
    return (
      <div className="bg-dark shadow" >
        <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-myc text-light">
          <Logo />
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collasde navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/home">Home</NavLink>
            </li>
            {
              (this.context.token === '') ? (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/menu">Menu</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/cart">Cart</NavLink>
                    </li>
                  </>
                ):(
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/dishes">Dishes</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/orders">Orders</NavLink>
                    </li>
                    <li className="nav-item">
                      <button type="button" className="btn nav-link" onClick={this.context.logout}>Logout</button>
                    </li>
                  </>
                )
            }
          </ul>
          </div>
        </nav>
      </div>
    )
  }
}
