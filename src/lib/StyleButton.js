
import React, { Component } from 'react';
import IconButton from '../ui/IconButton';
import autobind from 'class-autobind';

export default class StyleButton extends Component {
  constructor() {
    super(...arguments);
    autobind(this);
  }

  render() {
    let { style, onToggle, ...otherProps } = this.props; // eslint-disable-line no-unused-vars
    let iconName = style.toLowerCase();
    // `focusOnClick` will prevent the editor from losing focus when a control
    // button is clicked.
    return (
      <IconButton
        {...otherProps}
        iconName={iconName}
        onClick={this._onClick}
        focusOnClick={false}
      />
    );
  }

  _onClick() {
    console.log('this.props.style: ', this.props.style);
    this.props.onToggle(this.props.style);
  }
}
