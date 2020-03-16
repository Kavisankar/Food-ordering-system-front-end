import React, { Component } from 'react';
import rootContext from '../../context/rootContext';

export default class AddToCartModel extends Component {
  constructor(props) {
    super(props)
    this.state = {
       quantity: 1,
    }
  }

  static contextType = rootContext;
  
  _increaseQuantity = () => {
    var quantity = this.state.quantity;
    if(quantity !== 50) {
      this.setState({ quantity: quantity+1 })
    }
  }
  
  _decreaseQuantity = () => {
    var quantity = this.state.quantity;
    if(quantity !== 1) {
      this.setState({ quantity: quantity-1 })
    }
  }

  _addToCart = () => {
    this.context.addToCart(this.props.dishId, this.state.quantity);
    this.props.closeModal();
  }

  render() {
    const dish = this.context.menu[this.props.dishId];
    return (
      <div className="my-model" >
        <div className="model-body rounded-lg">
          <header className="p-3 rounded-top bg-myc text-white">
            <i className="fas fa-cart-plus fa-lg p-2 text-white"></i>
            <strong>Add to cart</strong>
          </header>
          <section className="p-3 pb-0 text-myc ">
            <strong>
              <label className="mb-1">Name</label>
              <input type="text" className="text-myc-bold w-100 mb-3 form-control input-border" value={dish.name} disabled />
              <label className="mb-1">Cast(&#8377;)</label>
              <input type="text" className="text-myc-bold w-100 mb-3 form-control input-border" value={dish.cost} disabled />
              <label className="mb-1">Quantity</label>
              <div className="d-flex my-border mb-3 rounded-lg">
                <input type="number" min="1" max="50" className="text-myc-bold form-control border-0 mr-auto flex-input" value={this.state.quantity} disabled/>
                <button type="button" className="btn bg-myc text-white rounded-0 border-right" onClick={this._increaseQuantity}>
                  <i className="fas fa-plus"></i>
                </button>
                <button type="button" className="btn bg-myc text-white rounded-0" onClick={this._decreaseQuantity}>
                  <i className="fas fa-minus"></i>
                </button>
              </div>
              <label className="mb-1">Total Cast(&#8377;)</label>
              <input type="text" className="text-myc-bold w-100 mb-3 form-control input-border" value={dish.cost * this.state.quantity} disabled />
            </strong>
          </section>
          <footer className="p-3 pt-0">
            <hr className="my-hr text-myc"/>
            <div className="d-flex justify-content-end mr-3">
              <button type="button" className="btn my-btn px-3 mx-2" onClick={this._addToCart}>
                <i className="fas fa-plus mr-1 fa-sm"></i>
                <span className="text-bold">Add</span>
              </button>
              <button type="button" className="btn my-btn px-3 mx-2" onClick={this.props.closeModal}>
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
