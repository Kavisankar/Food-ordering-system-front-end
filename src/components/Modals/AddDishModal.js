import React, { Component } from 'react';
import rootContext from '../../context/rootContext';

export default class AddDishModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    };
    this.formRef = React.createRef();
  }

  static contextType = rootContext;

  _updateDish = async () => {
    const name = this.formRef.current.name.value;
    const cost = parseFloat(this.formRef.current.price.value);
    const isVeg = this.formRef.current.isVeg.value==="true"?true:false;
    const availability = this.formRef.current.availability.value==="true"?true:false;
    if(name!=='' && cost!=='' && cost>-1 && cost<1000){
      try {
        const requestBody = {
          query: `
            mutation AddDish($name:String!,$cost:Float!,$isVeg:Boolean,$availability:Boolean){
              addDish(dish: {name:$name,cost:$cost,isVeg:$isVeg,availability:$availability}){
                id
              }
            }
          `,
          variables: {
            name,
            cost,
            isVeg,
            availability
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
          const resJson = await res.json()
          const err = resJson.errors[0];
          if(err.message==="This dish is already exist!"){
            alert(err.message);
          }
          else{
            throw new Error('Failed!');
          }
        }
        this.props.reload();
      }
      catch(err) {
        throw err;
      }
      this.props.closeModal();
    }
    else{
      this.setState({error: "Oops! Please enter valid inputs."});
    }
  }

  render() {
    return (
      <div className="my-model" >
        <div className="model-body rounded-lg">
          <header className="p-3 rounded-top bg-myc text-white">
            <i className="fas fa-plus fa-lg p-2 text-white"></i>
            <strong>Add dish</strong>
          </header>
          <form ref={this.formRef} className="p-3 pb-0 text-myc ">
            <strong>
              <label className="mb-1">Name</label>
              <input name="name" type="text" className="text-myc-bold w-100 mb-3 form-control input-border" placeholder="Enter the dish name" required />
              <label className="mb-1">Cast(&#8377;)</label>
              <input name="price" type="number" min="1" max="10000" className="text-myc-bold w-100 mb-3 form-control input-border" placeholder="Enter the cost" required/>
              <label className="mb-1">Veg or Non-veg</label>
              <select name="isVeg" className="text-myc-bold w-100 mb-3 form-control input-border">
                <option value={true}>Veg</option>
                <option value={false}>Non-veg</option>
              </select>
              <label className="mb-1">Available</label>
              <select name="availability" className="text-myc-bold w-100 mb-3 form-control input-border">
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
              <small className="d-flex text-danger justify-content-center">{this.state.error}</small>
            </strong>
          </form>
          <footer className="p-3 pt-0">
            <hr className="my-hr text-myc"/>
            <div className="d-flex justify-content-end mr-3">
              <button type="button" className="btn my-btn px-3 mx-2" onClick={this._updateDish}>
                <i className="fas fa-plus mr-1 fa-sm"></i>
                <span className="text-bold">Add</span>
              </button>
              <button type="button" className="btn my-btn px-3 mx-2" onClick={this.props.closeModal}>
                <i className="fas fa-times mr-1 fa-sm"></i>
                <span className="text-bold">Cancel</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
    )
  }
}
