import React, { Component } from 'react';
import Spinner from '../../components/Spinner';
import SearchBar from '../../components/SearchBar';
import rootContext from '../../context/rootContext';
import AddToCartModel from '../../components/Modals/AddToCartModal';

export default class MenuScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: null,
      onlyVeg: false,
      searchKey: "",
      addToCart: "",
    };
    this.searchBar = React.createRef();
  }
  
  static contextType = rootContext;

  async _fetchDishes() {
    try {
      const requestBody = {
        query: `
          query {
            getMenu{
              id,
              name,
              cost,
              isVeg
            }
          }
        `
      };

      const res = await fetch('http://localhost:8000/graphql',{
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      }); 
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      const resJson = await res.json();
      this._setMenu(resJson.data.getMenu)
    }
    catch(err) {
      this.setState({error: err});
    }
  }

  componentDidMount() {
    this._fetchDishes();
  }

  _setMenu = rawMenu => {
    this.context.setMenu(rawMenu);
    this.setState({ isLoading: false});
  }

  _search = () => {
    const searchKey = this.searchBar.current.value.toLowerCase();
    this.setState({searchKey});
  }

  _clearSearch = () => {
    this.searchBar.current.value = "";
    this.setState({searchKey: ""});
  }

  _handleCheck = event => {
    this.setState({onlyVeg: event.target.checked})
  }

  _openAddToCartModal = dishId => {
    this.setState({ addToCart: dishId });
  }

  _closeAddToCartModal = () => {
    this.setState({ addToCart: "" });
  }

  render() {
    if(this.state.error) {
      throw this.state.error;
    }
    if (this.state.isLoading) {
      return <Spinner />;
    }
    if (Object.keys(this.context.menu).length === 0) {
      return (
        <div className="d-flex flex-column w-100 align-items-center justify-content-center screen-center">
          <i className="fas fa-exclamation-triangle text-myc fa-5x d-block mb-3"></i>
          <span className="d-block text-myc text-center h4"> Oops! No dishes found. Please try again later. </span>
        </div>
      );
    }
    return (
      <>
        {this.state.addToCart !== "" && <AddToCartModel dishId={this.state.addToCart} closeModal={this._closeAddToCartModal}/>}
        <section className="d-block m-4 justify-content-center text-myc">
          <div className="d-flex flex-wrap">
            <SearchBar myRef={this.searchBar} searchKey={this.state.searchKey} onSearch={this._search} onClear={this._clearSearch} />
            <div className="custom-control custom-switch ml-1">
              <input type="checkbox" className="custom-control-input" id="vegetarianOnly" checked={this.state.onlyVeg} onChange={this._handleCheck}/>
              <label className="custom-control-label" htmlFor="vegetarianOnly"><strong>Vegetarian&nbsp;only</strong></label>
            </div>
          </div>
          {
            Object.entries(this.context.menu).map(([id, dish]) => {
              if ((!this.state.onlyVeg || (this.state.onlyVeg && dish.isVeg)) && dish.name.toLowerCase().includes(this.state.searchKey)) {
                return (
                  <div className="card d-flex my-3 border-myc rounded-lg shadow-sm"  key={id}>
                    <div className="card-body d-flex">
                      <div className="mr-auto" >
                        <strong>{dish.name} &nbsp;&nbsp;-&nbsp;&nbsp;&#8377;{dish.cost}</strong>
                      </div>
                      <button type="button" title="Add to cart" className="btn btn-link p-0" data-toggle="modal" data-target="#exampleModal" onClick={this._openAddToCartModal.bind(this,id)}>
                        <i className="fas fa-cart-plus text-myc fa-lg"></i>
                      </button>
                    </div>
                  </div>
                )
              }
              return null;
            })
          }
        </section>
      </>
    )
  }
}
