import React, { Component } from 'react';
import Logo from '../Logo';
export default class ThanksModal extends Component {

  render() {
    return (
      <div className="my-model" >
        <div className="model-body rounded-lg">
          <header className="p-3 rounded-top bg-myc text-white">
            <Logo />
          </header>
          <section className="p-3 pb-0 text-myc d-flex flex-column w-100 align-items-center">
            <i className="fas fa-handshake fa-7x"></i>
            <strong className="d-block text-center">
              <span className="h1">Thank for your order!</span>
              <span className="h4 d-block">Your order will be deliverd within 1 hour</span>
              <span className="h6 d-block">(Order id is '{this.props.id}'')</span>
            </strong>
          </section>
          <footer className="p-3 pt-0">
            <hr className="my-hr text-myc"/>
            <div className="d-flex justify-content-center">
              <button type="button" className="btn my-btn px-3 mx-2" onClick={this.props.onClose}>
                <i className="fas fa-thumbs-up mr-1"></i>
                <span className="text-bold">Done</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
    )
  }
}
