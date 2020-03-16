import React, { Component } from 'react'

export default class SearchBar extends Component {
  _onKeyDown(event) {
    if(event.keyCode === 13) {
      this.props.onSearch();
    }
  }
  render() {
    const {myRef, ...props} = this.props;
    return (
      <div className="mr-auto my-border rounded-pill border-myc mb-3">
        <div className="input-group">
          <input type="text" ref={myRef} defaultValue={this.props.searchKey} onKeyDown={this._onKeyDown.bind(this)} className="border-0 rounded-pill pl-3 text-myc" placeholder="Search dishes" />
          {
            this.props.searchKey !== "" &&
            <div className="input-group-append rounded-pill"> 
              <button type="button" title="cancel" className="btn btn-link text-myc px-0" onClick={props.onClear}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          }
          <div className="input-group-append rounded-pill"> 
            <button type="button" title="search" className="btn btn-link text-myc" onClick={props.onSearch}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>
    )
  }
}
