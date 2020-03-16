import React from 'react';

export default React.createContext({
  menu: {},
  cart: {},
  orders: {},
  token: '',
  login: (token) => {},
  logout: () => {},
  setMenu: rawMenu => {},
  addToCart: (dishId, quantity) => {},
  emptyCart: () => {},
  removeFromCart: dishId => {},
  updateCartItem: (dishId, quantity) => {},
  updateDish: (dish) => {},
  removeDish: (dishId) => {},
  setOrders: rawOrders => {},
  removeOrder: id => {}
});
