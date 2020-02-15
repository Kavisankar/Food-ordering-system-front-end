import React from 'react';

export default React.createContext({
  menu: {},
  cart: {},
  setMenu: rawMenu => {},
  addToCart: (dishId, quantity) => {},
  emptyCart: () => {},
  removeFromCart: dishId => {},
  updateCartItem: (dishId, quantity) => {},
});
