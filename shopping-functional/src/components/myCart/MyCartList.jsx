import React, { useState } from 'react'
import { useEffect } from 'react';
import Axios from 'axios';
import CartOrder from './CartOrder';


export default function MyCartList(props) {

    const [products, setProducts] = useState({ all: [] })
    const [accounts, setAccounts] = useState([])
    // const [quantity, setQuntity] = useState('')

    useEffect(() => {

        getAllAccounts();

    }, [])
    let comments = JSON.parse(localStorage.getItem('document'));

    const getAllAccounts = () => {
         const url = 'https://shopping-22a16.firebaseio.com/addcart.json'
        // const url = `https://shopping-22a16.firebaseio.com/addcart${comments.phoneNumber}.json`


        Axios.get(url).then((response) => {
            console.log("Response ", response)
            let userId = JSON.parse(localStorage.getItem('userid'));

            let fetchAccount = []
            for (let key in response.data) {
                let account = response.data[key]
                console.log("data userId ", response.data[key].userId)
                if(response.data[key].userId === userId){
                fetchAccount.push({
                    ...account,
                    id: key,
                    qun: null,
                    total: account.price

                }
                )
            }
                console.log("account ", account)
                console.log("Fetch account ", fetchAccount.qun)
                setProducts({
                    all: fetchAccount
                })
                console.log("account alllll ", products.all)
            }

        })
            .catch((err) => {
                console.log('Error ', err)
            })

    }

    const deleAccount = async (accToDelete) => {
        console.log("delete data", accToDelete)
        const id = accToDelete.id;
        console.log("my id ", id)
        const url = 'https://shopping-22a16.firebaseio.com/addcart/' + id + '/.json'
        // const url = `https://shopping-22a16.firebaseio.com/addcart${comments.phoneNumber}/${id}.json`


        try {
            const response = await Axios.delete(url)

            const myAccounts = [...products.all]           // In UI for deleting
            console.log("myaccounts ", myAccounts)

            const index = myAccounts.indexOf(accToDelete)
            myAccounts.splice(index, 1)
            setProducts({
                all: myAccounts
            })


            //Unless, until it is required to do make unnecessary calls to server  // for deleting
            //this.getAllAccount()

            console.log("Response ", response)
        } catch (error) {
            console.log('Error ', error)
        }
    }

 const   deleteCart = ()=>{
    products.all.map((val)=> {
        deleAccount(val)

    })

    props.history.push('./showproducts')
    }

    //Qunatity 

    let quntityChange = (Q, V) => {
        let allData = products.all
        allData.map((val) => {
            if (val.id === V.id) {
                return (
                    V.noq = Q,
                    V.total = Q * V.price)
            }
        })
        setProducts({ all: allData })
    }
    let totalAmount = 0;
    let ttl = 0;

    return (
        <div>
            <div className="container my-4">

                <h2 className="p-4  text-center">MyCart List</h2>
                <div className="row">

                    <div className="col-sm-6 col-md-6 ">
                        {products.all.map((val) => {
                            return (
                                <div className="card my-3" >
                                    <div className="row" key={val.id} >
                                        {/* <i class="fa fa-heart-o"></i> */}
                                        <div className="col-sm-12 col-md-6 card-header text-center"><img src={val.image} className="p" max-width="200px" height="170px" /></div>
                                        <div className="col-sm-12 col-md-6 card-body">
                                            <div>{val.productName}</div>
                                            <div className="">Brand: {val.brand}</div>
                                            <div className="">₹ {val.price}</div>
                                            {/* <div className="">Quantity: {val.quantity}</div> */}
                                            <div>Quantity:</div>
                                            <select name="select" onChange={(e) => {quntityChange(e.target.value, val)}} value={val.qun} className="my-1">
                                                {/* <option value="">--Select--</option> */}
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                            </select>
                                            <p className='card-text'><strong>Total Amount: {val.total}</strong></p>

                                            {/* <p style={{ display: "block" }}>  {total = Number(val.price) * Number(quantity)}</p> */}
                                            <p style={{ display: "none" }}>  {totalAmount = totalAmount + Number(val.total), ttl = ttl + Number(val.price)}</p>
                                            <div><button className="btn bg-danger" onClick={() => deleAccount(val)}>Remove</button></div>
                                        </div>
                                    </div>

                                </div>
                            )
                        })}
                    </div>
                    <div className="col-sm-6 col-md-6 ">
                        <CartOrder action={products.all.length} a={ttl} b={totalAmount}/>
                        {/* <button className="btn btn-warning my-4">Place order</button> */}

                        <button type="button" class="btn btn-warning my-4"  data-toggle="modal" data-target="#myModal"> Place order</button>


<div class="modal" id="myModal">
  <div class="modal-dialog">
    <div class="modal-content">

      
      <div class="modal-header">
        <h4 class="modal-title">Order successfully placed</h4>
        <button type="button" class="close" data-dismiss="modal">&times;</button>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal" onClick={deleteCart} >Close</button>
      </div>

    </div>
  </div>
</div>
                    </div>
                    {/* <button className="btn btn-success">Place order</button> */}
                </div>
            </div>
        </div>
    )
}
