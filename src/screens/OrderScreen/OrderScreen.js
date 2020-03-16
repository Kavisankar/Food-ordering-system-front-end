import React, { Component } from 'react';
import Spinner from '../../components/Spinner';
import rootContext from '../../context/rootContext';

export default class OrderScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: null,
      onlyVeg: false,
      searchKey: "",
      editDish: "",
      addDish: false,
    };
    this.searchBar = React.createRef();
  }
  
  static contextType = rootContext;

  async _fetchOrders() {
    try {
      const requestBody = {
        query: `
          query{
            getOrderList{
              id
              customerName
              customerPhoneNo
              customerAddress
              dishes{
                id
                name
                cost
                availability
                isVeg
                quantity
              }
            }
          }
        `
      };


      const res = await fetch('http://localhost:8000/graphql',{
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.context.token
        }
      }); 
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      const resJson = await res.json();
      this._setOrders(resJson.data.getOrderList);
    }
    catch(err) {
      this.setState({error: err});
    }
  }
  
  async _removeOrder(id) {
    try {
      const requestBody = {
        query: `
          mutation RemoveOrder($id:String!) {
            removeOrder(id:$id){
              id
            }
          }
        `,
        variables: {
          id
        }
      };


      const res = await fetch('http://localhost:8000/graphql',{
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.context.token
        }
      }); 
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      this.context.removeOrder(id);
    }
    catch(err) {
      this.setState({error: err});
    }
  }

  componentDidMount() {
    this._fetchOrders();
  }

  _setOrders = rawOrders => {
    this.context.setOrders(rawOrders);
    this.setState({ isLoading: false});
  }

  render() {
    if(this.state.error) {
      throw this.state.error;
    }
    if (this.state.isLoading) {
      return <Spinner />;
    }
    return (
        <section className="d-block m-4 justify-content-center text-myc">
          <div className="d-flex flex-wrap">
          {
            Object.entries(this.context.orders).map(([id, order]) => {
              return (
                <div className="card w-100 d-flex my-3 border-myc rounded-lg shadow-sm"  key={id}>
                  <div className="card-body d-flex position-relative">
                    <button type="button" title="Remove the order" className="btn btn-link p-3 position-absolute float-right" onClick={this._removeOrder.bind(this,id)}>
                      <i className="fas fa-trash-alt text-myc fa-lg px-2"></i>
                    </button>
                    <strong className="w-100">
                      Name : {order.customerName}<br />
                      Phone No : {order.customerPhoneNo}<br />
                      Address : {order.customerAddress}<br />
                      Dishes :<br />
                      <table className="table table-hover">
                        <thead className="thead-light">
                          <tr>
                            <th>Name</th>
                            <th>Cost</th>
                            <th>Quantity</th>
                            <th>Veg/Non-veg</th>
                            <th>Availability</th>
                          </tr>
                        </thead>
                        {
                          Object.entries(order.dishes).map(([dishId, dish]) => {
                            return (
                              <tr>
                                <td>{dish.name}</td>
                                <td>{dish.cost}</td>
                                <td>{dish.quantity}</td>
                                <td>{dish.isVeg?'Veg':'Non-veg'}</td>
                                <td>{dish.availability?'Yes':'No'}</td>
                              </tr>
                            )
                          })
                        }
                      </table>
                    </strong>
                  </div>
                </div>
              )
            })
          }
          </div>
        </section>
    )
  }
}
