import React, { Component } from 'react';
import Spinner from '../../components/Spinner';
import SearchBar from '../../components/SearchBar';
import rootContext from '../../context/rootContext';
import EditDishModal from '../../components/Modals/EditDishModal';
import AddDishModal from '../../components/Modals/AddDishModal';

export default class DishScreen extends Component {
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

  async _fetchDishes() {
    try {
      const requestBody = {
        query: `
          query {
            getDishes{
              id,
              name,
              cost,
              isVeg,
              availability
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
      this._setMenu(resJson.data.getDishes);
    }
    catch(err) {
      this.setState({error: err});
    }
  }
  
  async _removeDish(id) {
    try {
      const requestBody = {
        query: `
          mutation RemoveDish($id:String!) {
            removeDish(id:$id){
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
      this.context.removeDish(id);
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

  _openEditDishModal = dishId => {
    this.setState({ editDish: dishId });
  }

  _closeEditDishModal = () => {
    this.setState({ editDish: "" });
  }

  _openAddDishModal = dishId => {
    this.setState({ addDish: true });
  }

  _closeAddDishModal = () => {
    this.setState({ addDish: false });
  }

  _reload = () => {
    this._fetchDishes();
  }

  render() {
    if(this.state.error) {
      throw this.state.error;
    }
    if (this.state.isLoading) {
      return <Spinner />;
    }
    return (
      <>
        {this.state.editDish !== "" && <EditDishModal dishId={this.state.editDish} closeModal={this._closeEditDishModal}/>}
        {this.state.addDish && <AddDishModal dishId={this.state.addDish} closeModal={this._closeAddDishModal} reload={this._reload.bind(this)}/>}
        <section className="d-block m-4 justify-content-center text-myc">
          <div className="d-flex flex-wrap">
            <SearchBar myRef={this.searchBar} searchKey={this.state.searchKey} onSearch={this._search} onClear={this._clearSearch} />
            <div className="custom-control custom-switch ml-1">
              <input type="checkbox" className="custom-control-input" id="vegetarianOnly" checked={this.state.onlyVeg} onChange={this._handleCheck}/>
              <label className="custom-control-label" htmlFor="vegetarianOnly"><strong>Vegetarian&nbsp;only</strong></label>
            </div>
          </div>
          <center>
            <i className="fas fa-plus btn my-btn py-2 px-4" onClick={this._openAddDishModal}><strong> Add dish</strong></i>
          </center>
          {
            Object.entries(this.context.menu).map(([id, dish]) => {
              if ((!this.state.onlyVeg || (this.state.onlyVeg && dish.isVeg)) && dish.name.toLowerCase().includes(this.state.searchKey)) {
                return (
                  <div className="card d-flex my-3 border-myc rounded-lg shadow-sm"  key={id}>
                    <div className="card-body d-flex">
                      <div className="mr-auto" >
                        <strong>{dish.name} &nbsp;&nbsp;-&nbsp;&nbsp;&#8377;{dish.cost}</strong>
                      </div>
                      <button type="button" title="Add to cart" className="btn btn-link p-0" onClick={this._openEditDishModal.bind(this,id)}>
                        <i className="fas fa-pencil-alt text-myc fa-lg px-2"></i>
                      </button>
                      <button type="button" title="Delete to cart" className="btn btn-link p-0" onClick={this._removeDish.bind(this,id)}>
                        <i className="fas fa-trash-alt text-myc fa-lg px-2"></i>
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
