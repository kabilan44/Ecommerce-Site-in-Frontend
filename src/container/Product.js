import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductList } from '../data/ProductList';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../redux/reducer/cart';

export default function Product() {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const item = ProductList.find(
    //     (element) => element.id === parseInt(params.id)
    // );
    const props = ProductList.find(
        (element) => element.id === parseInt(params.id)
    );

    const [alert, setAlert] = useState(false);

    const list = useSelector((state) => state.cart.list);
    const element = list.find((item) => item.id === props.id);

    const addToCart = () => {
        setAlert(true);
        setTimeout(() => setAlert(false), 3000)
        dispatch(addItem(props));
    }
    return (
        <div className='card m-2 '  >
            {alert && <span className='alert alert-success'>Item added to the cart</span>}
            <div className='mt-2'>
                <img src={props.thumbnail}
                    height={350}
                    width={400}
                    alt={props.title}
                    className='border-radius-9' />
            </div>
            <div className=' mt-3 card-body'>
                <h5 className='card-title'>{props.title}</h5>
                <h6 className='mt-2'>Price: ${props.price}</h6>
                <h6 className='mt-2'>Discount: {props.discountPercentage}%</h6>
                <h6 className='mt-2'>Rating: {props.rating}</h6>
                <div className='mt-4'>
                    {props.stock > 0 ? (
                        <>
                            <button className='btn btn-success' onClick={() => navigate(`/checkout/${props.id}`)}>Buy Now</button>
                            {element?.count > 0 ?
                                <button className='btn btn-outline-warning ms-3'
                                    onClick={() => navigate('/cart')}>
                                    Go to Cart
                                </button>

                                :

                                <button className='btn btn-success ms-3' onClick={addToCart}
                                >Add to Cart
                                </button>
                            }
                        </>
                    ) : (
                        <button className='btn btn-outline-danger'>Out of stock</button>)
                    }
                </div>
            </div>
        </div>
    )
}
