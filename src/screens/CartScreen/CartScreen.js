import React, { Component } from 'react';
import rootContext from '../../context/rootContext';
import ThanksModal from '../../components/Modals/ThanksModal';
import PlaceOrderModal from '../../components/Modals/PlaceOrderModal';
import Spinner from '../../components/Spinner';

export default class CartScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      error: null,
      orderPlaced: false,
      processingOrder: false,
      orderId: ''
    }
  }
  
  static contextType = rootContext;

  async _asyncPlaceOrder(name, phoneNo, address) {
    try {
      let dishes = []
      Object.entries(this.context.cart).forEach(([dish, quantity]) => {
        dishes.push({
          dish,
          quantity
        })
      });
      const requestBody = {
        query: `
          mutation PlaceOrder($name: String!, $phoneNo: String!, $address: String!, $dishes: [DishIDWithQuantity!]!){
            placeOrder(order: {customerName: $name, customerPhoneNo: $phoneNo, customerAddress: $address, dishes:$dishes}){
              id
            }
          }
        `,
        variables: {
          name,
          phoneNo,
          address,
          dishes
        }
      };

      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      }); 
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      const resJson = await res.json();
      this.setState({ isLoading: false, orderPlaced: true, orderId: resJson.data.placeOrder.id });
    }
    catch(err) {
      this.setState({error: err});
    }
  }
  
  _increaseQuantity = (dishId, quantity) => {
    if(quantity !== 50) {
      this.context.updateCartItem(dishId, quantity+1);
    }
  };
  
  _decreaseQuantity = (dishId, quantity) => {
    if(quantity !== 1) {
      this.context.updateCartItem(dishId, quantity-1);
    }
  };

  _closeThanksModal = () => {
    this.setState({ orderPlaced: false });
    this.context.emptyCart();
  }

  _openOrderModel = () => {
    this.setState({ placingOrder: true });
  }

  _closeOrderModal = () => {
    this.setState({ placingOrder: false });
  }

  _placeOrder = ( name, phoneNo, address) => {
    this._asyncPlaceOrder(name, phoneNo, address);
    this.setState({ placingOrder: false, isLoading: true });
  }

  render() {
    if(this.state.error) {
      throw this.state.error;
    }
    if (this.state.isLoading) {
      return <Spinner />
    }
    if (Object.keys(this.context.cart).length === 0) {
      return (
        <div className="d-flex flex-column w-100 align-items-center justify-content-center screen-center position-relative">
          <i className="fas fa-exclamation text-white fa-2x d-block position-absolute ex-icon"></i>
          <i className="fas fa-shopping-cart text-myc fa-5x d-block mb-3"></i>
          <span className="d-block text-myc text-center h4"> Oops! Your cart is empty! </span>
        </div>
      );
    }
    let totalCost = 0;
    return (
      <section className="d-flex flex-column m-4 justify-content-center text-myc">
        { this.state.placingOrder && <PlaceOrderModal placeOrder={this._placeOrder} onClose={this._closeOrderModal}  /> }
        { this.state.orderPlaced && <ThanksModal id={this.state.orderId} onClose={this._closeThanksModal} /> }
        {
          Object.entries(this.context.cart).map(([id, quantity]) => {
            const dish = this.context.menu[id];
            totalCost += dish.cost * quantity;
            return (
              <div className="card my-3 border-myc rounded-lg shadow-sm"  key={id}>
                <div className="card-body d-flex flex-wrap">
                  <strong>{dish.name}&nbsp;&nbsp;</strong>
                  <div className="d-flex mr-auto" >
                    <div className="d-flex my-border">
                      <button type="button" className="d-inline btn bg-myc p-0 text-white rounded-0 box-sm border-0" onClick={this._increaseQuantity.bind(this, id, quantity)}>
                        <span>+</span>
                      </button>
                      <input type="number" min="1" max="50" className="text-myc-bold form-control form-control-sm border-0 p-0 box-sm rounded-0" value={quantity} disabled/>
                      <button type="button" className="btn bg-myc p-0 text-white rounded-0 box-sm border-0" onClick={this._decreaseQuantity.bind(this, id, quantity)}>
                        <span>-</span>
                      </button>
                    </div>
                    <strong>&nbsp;&nbsp;x&nbsp;&nbsp;&#8377;{dish.cost}&nbsp;&nbsp;=&nbsp;&nbsp;&#8377;{dish.cost*quantity}</strong>
                  </div>
                  <button type="button" title="Remove from cart" className="btn btn-link ml-3 p-0" onClick={this.context.removeFromCart.bind(this,id)}>
                    <i className="fas fa-trash-alt text-myc fa-lg"></i>
                  </button>
                </div>
              </div>
            )
          })
        }
        <strong className="px-3 align-self-center mt-4">Totol cost = &#8377;{totalCost}</strong>
        <button type="button" className="btn my-btn px-3 align-self-center mt-4" onClick={this._openOrderModel}>Place order</button>
      </section>
    )
  }
}