import React, { Component } from 'react'

export default class ErrorBoundary extends Component {
constructor(props) {
  super(props);
  this.state = {
    hasError: false,
  }
}

static getDerivedStateFromError(error) {
  return { hasError: true };
}

componentDidCatch(error, errorInfo) {
  console.log(error, errorInfo);
}

render() {
  if (this.state.hasError) {
    return (
      <div className="d-flex flex-column w-100 align-items-center justify-content-center screen-center">
        <i className="fas fa-exclamation-triangle text-myc fa-5x d-block mb-3"></i>
        <span className="d-block text-myc text-center h4"> Oops! Something went wrong. Please try again later. </span>
      </div>
    )
  }
  return this.props.children;
}
}
