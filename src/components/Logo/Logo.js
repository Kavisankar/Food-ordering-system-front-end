import React, { Component } from 'react'
import logo from './logo.png';

export default class Logo extends Component {
  render() {
    return (
      <div className="navbar-brand px-2 border rounded border-light" >
        <img src={logo} width="40" height="40" alt="" />
        <span> &nbsp; KC Restaurant</span>
      </div>
    )
  }
}
