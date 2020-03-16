import React, { Component } from 'react';
import rootContext from '../../context/rootContext';

export default class AuthScreen extends Component {
    constructor(props) {
      super(props)
      this.state = {
        error: ''
      }
      this.nameRef = React.createRef();
      this.pswdRef = React.createRef();
    }

    static contextType = rootContext;

    _login = async () => {
        const name = this.nameRef.current.value.trim();
        const pswd = this.pswdRef.current.value.trim();
        if (name !== '' && pswd !== '') {
            try {
                const requestBody = {
                  query: `
                    mutation Login($name:String!, $pswd:String!) {
                        login(name:$name, pswd:$pswd) {
                        token
                        }
                    }
                  `,
                  variables: {
                      name,
                      pswd
                  }
                };
          
                const res = await fetch('http://localhost:8000/graphql',{
                  method: 'POST',
                  body: JSON.stringify(requestBody),
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }); 
                const resJson = await res.json();
                if (res.status !== 200 && res.status !== 201) {
                  this.setState({ error: resJson.errors[0].message });
                }
                else{
                    this.context.login(resJson.data.login.token);
                }
              }
              catch(err) {
                console.log(err);
              }
        }
        else {
            this.setState({ error: 'Oops! Name and passward must required.'})
        }
    }

    render() {
        return (
            <div className="d-flex flex-column bg-myc h-100 justify-content-center align-items-center">
                <div className="model-body rounded-lg ">
                    <header className="p-3 d-flex align-items-center justify-content-center flex-wrap rounded-top text-myc">
                        <i className="fas fa-user-cog fa-2x mr-2 d-inline-block"></i>
                        <strong className="my-text-lg">Admin login</strong>
                    </header>
                    <hr className="text-myc m-0"/>
                    <section className="p-3 pb-0 text-myc">
                        <strong className="d-block">
                            <label className="mb-1">Name</label>
                            <input type="text" placeholder="Enter your name" ref={this.nameRef} className="text-myc-bold w-100 form-control input-border mb-3" autoFocus required/>
                            <label className="mb-1">Password</label>
                            <input type="password" placeholder="Enter your password" ref={this.pswdRef} className="text-myc-bold w-100 form-control input-border mb-3" required/>
                        </strong>
                        <small className="d-flex text-danger justify-content-center" >{this.state.error}</small>
                    </section>
                    <hr className="text-myc m-0"/>
                    <footer className="p-3">
                        <div className="d-flex justify-content-center">
                            <button type="button" className="btn my-btn px-3 mx-2" onClick={this._login}>
                                <i className="fas fa-sign-in-alt mr-1"></i>
                                <span className="text-bold">Login</span>
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        )
    }
}
