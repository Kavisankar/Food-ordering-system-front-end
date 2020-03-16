import React, { Component } from 'react'
import Navigator from './components/Navigator';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import './App.sass';
import './App.css';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import CartScreen from './screens/CartScreen';
import AuthScreen from './screens/AuthScreen';
import DishScreen from './screens/DishScreen';
import rootContext from './context/rootContext';
import OrderScreen from './screens/OrderScreen/OrderScreen';


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
       menu: {},
       cart: {},
       orders: {},
       token: ''
    }
  };
  
  _login = (token) => {
    this.setState({token});
  }

  _logout = () => {
    this.setState({token: ''})
  };

  _setMenu = (rawMenu) => {
    let menu = {};
    for(const dish of rawMenu) {
      menu[dish.id] = {
        id: dish.id,
        name: dish.name,
        cost: dish.cost,
        isVeg: dish.isVeg,
        availability: dish.availability
      }
    }
    this.setState({ menu });
  };

  _setOrders = (rawOrders) => {
    let orders = {};
    for(const order of rawOrders) {
      orders[order.id] = {
        customerName: order.customerName,
        customerPhoneNo: order.customerPhoneNo,
        customerAddress: order.customerAddress,
        dishes: {}
      }
      for(const dish of order.dishes){
        orders[order.id].dishes[dish.id] = {
          id: dish.id,
          name: dish.name,
          cost: dish.cost,
          isVeg: dish.isVeg,
          availability: dish.availability,
          quantity: dish.quantity,
        }
      }
    }
    this.setState({ orders });
  };

  _updateDish = (dish) => {
    let menu = this.state.menu;
    menu[dish.id] = {
      id: dish.id,
      name: dish.name,
      cost: dish.cost,
      isVeg: dish.isVeg,
      availability: dish.availability
    }
    this.setState({ menu });
  };

  _removeDish = (dishId) => {
    let menu = this.state.menu;
    delete menu[dishId]
    this.setState({ menu });
  };

  _removeOrder = (id) => {
    let orders = this.state.orders;
    delete orders[id]
    this.setState({ orders });
  };

  _addToCart = (dishId, quantity) => {
    const cart = this.state.cart;
    cart[dishId] = quantity;
    this.setState({ cart });
  };
  
  _removeFromCart = dishId => {
    const cart = this.state.cart;
    delete cart[dishId];
    this.setState({ cart });
  };

  _updateCartItem = (dishId, quantity) => {
    const cart = this.state.cart;
    cart[dishId] = quantity;
    this.setState({ cart });
  };

  _emptyCart = () => {
    this.setState({cart: {}});
  };

  render() {
    return (
      <div className="app d-flex flex-column">
        <ErrorBoundary>
          <rootContext.Provider value={{
            menu: this.state.menu,
            cart: this.state.cart,
            orders: this.state.orders,
            token: this.state.token,
            login: this._login,
            logout: this._logout,
            setMenu: this._setMenu,
            addToCart: this._addToCart,
            emptyCart: this._emptyCart,
            removeFromCart: this._removeFromCart,
            updateCartItem: this._updateCartItem,
            updateDish: this._updateDish,
            removeDish: this._removeDish,
            setOrders: this._setOrders,
            removeOrder: this._removeOrder
          }} >
            <BrowserRouter>
              <Navigator />
              <Switch>
                <Redirect from="/" to="/home" exact />
                <Route path="/home" component={HomeScreen} exact />
                { this.state.token !== '' && <Redirect from='/login' to='/home' />}
                { this.state.token !== '' && <Route path="/dishes" render={props => <ErrorBoundary><DishScreen /></ErrorBoundary>} exact />}
                { this.state.token !== '' && <Route path="/orders" render={props => <ErrorBoundary><OrderScreen /></ErrorBoundary>} exact />}
                { this.state.token === '' && <Redirect from='/orders' to='/home' />}
                { this.state.token === '' && <Redirect from='/dishes' to='/home' />}
                <Route path="/cart" render={props => <ErrorBoundary><CartScreen /></ErrorBoundary>} exact />
                <Route path="/menu" render={props => <ErrorBoundary><MenuScreen /></ErrorBoundary>} exact />
                <Route path="/login" render={props => <ErrorBoundary><AuthScreen /></ErrorBoundary>} exact />
              </Switch>
            </BrowserRouter>
          </rootContext.Provider>
        </ErrorBoundary>
      </div>
    )
  }
};
