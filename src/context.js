import { type } from '@testing-library/user-event/dist/type';
import React, { useState, useContext, useReducer, useEffect } from 'react';
import cartItems from './data';
import reducer from './reducer';
// ATTENTION!!!!!!!!!!
// I SWITCHED TO PERMANENT DOMAIN
const url = 'https://course-api.com/react-useReducer-cart-project';
const AppContext = React.createContext();

const initialState = {
  loading: false,
  cart: cartItems,
  total: 0,
  amount: 0,
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // clear cart function
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // remove item from arry of items
  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  // increase and decrease  items in the cart
  const increase = (id) => {
    dispatch({ type: 'INCREASE', payload: id });
  };
  const decrease = (id) => {
    dispatch({ type: 'DECREASE', payload: id });
  };

  // fetch data from an Api
  const fetchData = async () => {
    dispatch({ type: 'LOADING' });
    const response = await fetch(url);
    const cart = await response.json();
    // console.log(cart);
    dispatch({ type: 'DISPLAY_ITEMS', payload: cart });
  };

  const toggleAmount = (id, type) => {
    dispatch({ type: 'TOGGLE_AMOUNT', payload: { id, type } });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // get number of items and total price
  useEffect(() => {
    dispatch({ type: 'GET_TOTALS' });
  }, [state.cart]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        clearCart,
        removeItem,
        increase,
        decrease,
        toggleAmount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
