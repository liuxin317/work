
import React, { Component } from 'react';

class Form extends Component {
  fromSubmit = (value) => {
    return false
  }

  render () {
    return (
      <form onSubmit={ this.fromSubmit } target="id_iframe">
        First name:<br />
        <input type="text" name="firstname" defaultValue="Mickey" />
        <br />
        Last name:<br />
        <input type="text" name="lastname" defaultValue="Mouse" />
        <br /><br />
        <input type="submit" defaultValue="Submit" />

        <iframe id="id_iframe" name="id_iframe" style={{ display:"none" }}></iframe> 
      </form>
    )
  }
}

export default Form;