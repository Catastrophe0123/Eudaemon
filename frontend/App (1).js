import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

export default class App extends Component{
  constructor(props) {
    super(props);
    this.state={
      value:"",
      score:0
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    console.log(this.state.value)
    this.setState(state => ({
      score:10
    }));
    event.preventDefault();
  }

  reqEmoji = () =>{
    if(this.score > 0){
      return(<p>Good</p>);
    }
    return(<p>Bad</p>)
  }

  render(){
    let g;
    if(this.state.score > 0){
      g=<p style={{fontSize:"48px"}}>&#128512;</p>;
    }
    if(this.state.score < 0){
      g=<p style={{fontSize:"48px"}}>&#128577;</p>;
    }
    return(
      <div>
        <h1>Review System</h1>
        <form onSubmit={this.handleSubmit}>
          <textarea rows="20" cols="50" placeholder="Enter text here" value={this.state.value} onChange={this.handleChange} required/>
          <br />
          <input type="submit" value="Submit" />
        </form>
        <div>{g}</div>
      </div>
    )
  }
    
}


