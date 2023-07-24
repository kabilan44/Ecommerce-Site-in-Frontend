import React, { useState } from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import ProductListItem from '../components/ProductListItem'
import { useNavigate, useParams } from 'react-router-dom';
import { ProductList } from '../data/ProductList';
export default function Checkout() {

  const params = useParams();
  const list = useSelector((state) => state.cart.list);

  const [state, setState] = useState(
    params.id ?
      [{ ...ProductList.find(element => element.id === parseInt(params.id)), count: 1, }
      ]
      : list
  );
  const navigate = useNavigate();

  const incrementItem = (item) => {
    if (item.count < 10) {
      const index = state.findIndex(product => product.id === item.id);
      setState((state) => [
        ...state.slice(0, index),
        { ...item, count: item.count + 1 },
        ...state.slice(index + 1)
      ]);
    }
  }
  const decrementItem = (item) => {
    if (item.count === 1) {
      removeItemFromCart(item);
    }
    else {
      const index = state.findIndex(product => product.id === item.id);
      setState((state) => [
        ...state.slice(0, index),
        { ...item, count: item.count - 1 },
        ...state.slice(index + 1)
      ]);
    }
  };
  const removeItemFromCart = (item) => {
    const index = state.findIndex(product => product.id === item.id);
    setState((state) => [
      ...state.slice(0, index),
      ...state.slice(index + 1)
    ]);
  };

  const data = state.map((item) => {
    let discount = 0;
    if (item.count >= 3) {
      discount = 0.1;
    } else if (item.count === 2) {
      discount = 0.05;
    }
    let total = item.price * item.count * (1 - discount);
    return {
      name: item.title,
      price: item.price,
      count: item.count,
      discount: discount * 100,
      total: total
    };
  });

  const totalPrice = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <>
      {state.length > 0 ? (
        <>
          {state.map((item) => (
            <ProductListItem
              {...item}
              key={item.id}
              incrementItem={() => incrementItem(item)}
              decrementItem={() => decrementItem(item)}
              removeItem={() => removeItemFromCart(item)}
            />
          ))}
          <table className='table table-striped'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Number of Items</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>${row.price.toFixed(2)}</td>
                  <td>{row.count}</td>
                  <td>{row.discount}%</td>
                  <td><h6>${row.total.toFixed(2)}</h6></td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className='total-price'>Final Total Price: ${totalPrice.toFixed(2)}</h3>
          <button className='btn btn-success' onClick={() => navigate('/success')}>Place Order</button>
        </>
      ) : (
        <h3>No items in the Checkout</h3>)
      }
    </>
  );
}



