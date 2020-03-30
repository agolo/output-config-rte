/* @flow */

import React, { Component } from 'react';
import IconButton from './IconButton';
import InputPopover from './InputPopover';
import autobind from 'class-autobind';

export default class PopoverIconButton extends Component {
  constructor() {
    super(...arguments);
    autobind(this);
  }

  render() {
    let { onTogglePopover, showPopover, ...props } = this.props; // eslint-disable-line no-unused-vars
    return (
      <IconButton {...props} onClick={onTogglePopover}>
        {this._renderPopover()}
      </IconButton>
    );
  }

  _renderPopover() {
    if (!this.props.showPopover) {
      return null;
    }
    return (
      <InputPopover
        defaultValue={this.props.defaultValue}
        onSubmit={this._onSubmit}
        onCancel={this._resetState}
      />
    );
  }

  _onSubmit() {
    this.props.onSubmit(...arguments);
  }

  _resetState(ev) {
    if (ev.target.className.includes('icon-cancel')) {
      this._onSubmit('');
    }
    this._hidePopover();
  }

  _hidePopover() {
    if (this.props.showPopover) {
      this.props.onTogglePopover(...arguments);
    }
  }
}
