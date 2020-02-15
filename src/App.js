import React, { Component } from 'react'
import Navigator from './components/Navigator';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import './App.sass';
import './App.css';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import CartScreen from './screens/CartScreen/';
import rootContext from './context/rootContext';


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
       menu: {"5e3ec6bc5857dd0c3865d111": {name:"Boneless Chilli Chicken","cost": 65}},
       cart: {"5e3ec6bc5857dd0c3865d111": 5}
    }
  };
  
  _setMenu = (rawMenu) => {
    let menu = {};
    for(const dish of rawMenu) {
      menu[dish.id] = {
        name: dish.name,
        cost: dish.cost,
        isVeg: dish.isVeg
      }
    }
    this.setState({ menu });
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
            setMenu: this._setMenu,
            addToCart: this._addToCart,
            emptyCart: this._emptyCart,
            removeFromCart: this._removeFromCart,
            updateCartItem: this._updateCartItem,
          }} >
            <BrowserRouter>
              <Navigator />
              <Switch>
                <Redirect from="/" to="/home" exact />
                <Route path="/home" component={HomeScreen} exact />
                <Route path="/cart" render={props => <ErrorBoundary><CartScreen /></ErrorBoundary>} exact />
                <Route path="/menu" render={props => <ErrorBoundary><MenuScreen /></ErrorBoundary>} exact />
              </Switch>
            </BrowserRouter>
          </rootContext.Provider>
        </ErrorBoundary>
      </div>
    )
  }
};
