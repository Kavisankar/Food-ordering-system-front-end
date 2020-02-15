import React, { Component } from 'react';

export default class PlaceOrderModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
       quantity: 1,
       nameError: '',
       phoneNoError: '',
       addressError: ''
    }
    this.nameRef = React.createRef();
    this.phoneNoRef = React.createRef();
    this.addressRef = React.createRef();
  }

  _validateName = () => {
    const re = new RegExp('^[a-zA-Z\\s.]*[a-zA-Z]{3}[a-zA-Z\\s.]*$');
    if(re.test(this.nameRef.current.value)) {
      return '';
    }
    return 'Oops! Invalid name. please enter a valid name';
  }

  _validatePhoneNo = () => {
    const re = new RegExp('^(?:(?:\\+|0{0,2})91(\\s*[\\ -]\\s*)?|[0]?)?[789]\\d{9}|(\\d[ -]?){10}\\d$');
    if(re.test(this.phoneNoRef.current.value)) {
      return '';
    }
    return 'Oops! Invalid mobile number. please enter a valid mobile number';
  }

  _validateAddress = () => {
    const re = new RegExp('^[a-zA-Z0-9\\s,.\'-]*[a-zA-Z]{3}[a-zA-Z0-9\\s,.\'-]*$');
    if(re.test(this.addressRef.current.value)) {
      return '';
    }
    return 'Oops! Invalid address. please enter a valid address';
  }

  _placeOrder = () => {
    const nameError = this._validateName();
    const phoneNoError = this._validatePhoneNo();
    const addressError = this._validateAddress();
    if ( nameError !== '' || phoneNoError !== '' || addressError !== '' ) {
      this.setState( { nameError, phoneNoError, addressError });
    }
    else {
      this.props.placeOrder(this.nameRef.current.value.trim(), this.phoneNoRef.current.value.trim(), this.addressRef.current.value.trim());
    }
  }

  render() {
    const inputStyle = "text-myc-bold w-100 form-control input-border";
    return (
      <div className="my-model" >
        <div className="model-body rounded-lg">
          <header className="p-3 rounded-top bg-myc text-white">
            <i className="fas fa-cart-plus fa-lg p-2 text-white"></i>
            <strong>Place your order</strong>
          </header>
          <section className="p-3 pb-0 text-myc ">
            <strong>
              <label className="mb-1">Name</label>
              <input type="text" placeholder="Enter your name" ref={this.nameRef} className={inputStyle.concat(this.state.nameError === ''? " mb-3" : " border-danger")} autoFocus required/>
              <small className="d-block pl-1 mb-2 text-danger" >{this.state.nameError}</small>
              <label className="mb-1">Phone No</label>
              <input type="text" placeholder="Enter your mobile number" ref={this.phoneNoRef} className={inputStyle.concat(this.state.phoneNoError === ''? " mb-3" : " border-danger")} required/>
              <small className="d-block pl-1 mb-2 text-danger" >{this.state.phoneNoError}</small>
              <label className="mb-1">Address</label>
              <textarea placeholder="Enter your Address" ref={this.addressRef} className={inputStyle.concat(this.state.addressError === ''? " mb-3" : " border-danger")} required/>
              <small className="d-block pl-1 mb-2 text-danger" >{this.state.addressError}</small>
            </strong>
          </section>
          <footer className="p-3 pt-0">
            <hr className="my-hr text-myc"/>
            <div className="d-flex justify-content-end mr-3">
              <button type="button" className="btn my-btn px-3 mx-2" onClick={this._placeOrder}>
                <i className="fas fa-plus mr-1 fa-sm"></i>
                <span className="text-bold">Place order</span>
              </button>
              <button type="button" className="btn my-btn px-3 mx-2" onClick={this.props.onClose}>
                <i className="fas fa-times mr-1 fa-sm"></i>
                <span className="text-bold">Cancel</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
    )
  }
}
