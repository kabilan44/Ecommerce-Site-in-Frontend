import React from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import ProductListItem from '../components/ProductListItem'
import { useDispatch } from 'react-redux';
import { modifyItem, removeItem } from '../redux/reducer/cart';
import { useNavigate } from 'react-router-dom';
export default function Cart() {
  const list = useSelector((state) => state.cart.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const incrementItem = (item) => {
    if (item.count < 10) {
      dispatch(modifyItem({ ...item, count: item.count + 1 }))
    }
  }
  const decrementItem = (item) => {
    if (item.count === 1) {
      dispatch(removeItem(item))
    }
    else {
      dispatch(modifyItem({ ...item, count: item.count - 1 }))
    }
  };
  const removeItemFromCart = (item) => {
    dispatch(removeItem(item));
  };

  const data = list.map((item) => {
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
      {list.length > 0 ? (
        <>
          {list.map((item) => (
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
          <h3><span className='text-center total-price'>Final Total Price: ${totalPrice.toFixed(2)}</span></h3>

          <button className='btn btn-success mt-4 mb-5' onClick={() => navigate('/checkout')}>Go to Checkout</button>

        </>
      ) : (
        <h3>No items in the cart</h3>)
      }
    </>
  );
}