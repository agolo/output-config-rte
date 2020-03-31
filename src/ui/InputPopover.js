
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import IconButton from './IconButton';
import ButtonGroup from './ButtonGroup';
import autobind from 'class-autobind';
import cx from 'classnames';

import styles from './InputPopover.css';
import { Button } from '../RichTextEditor';

export default class InputPopover extends Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      value: this.props.defaultValue || ''
    };
  }

  componentDidMount() {
    document.addEventListener('click', this._onDocumentClick);
    document.addEventListener('keydown', this._onDocumentKeydown);
    if (this._inputRef) {
      this._inputRef.focus();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._onDocumentClick);
    document.removeEventListener('keydown', this._onDocumentKeydown);
  }

  render() {
    let { props } = this;
    let className = cx(props.className, styles.root);
    return (
      <div className={className}>
        <div className={styles.inner}>
          <input
            defaultValue={props.defaultValue}
            value={this.state.value}
            type="text"
            placeholder="https://example.com/"
            className={styles.input}
            onKeyPress={this._onInputKeyPress}
            onChange={e => {
              this.setState({ value: e.target.value });
            }}
          />
          <Button
            style={{ marginLeft: '4px', marginRight: '0' }}
            onClick={() => {
              this.setState({ value: 'articleUrl' });
              this._onSubmit('articleUrl');
            }}
          >
            Article Url
          </Button>
          <ButtonGroup className={styles.buttonGroup}>
            <IconButton
              label="Cancel"
              iconName="cancel"
              onClick={props.onCancel}
            />
            <IconButton
              label="Submit"
              iconName="accept"
              onClick={() => {
                this._onSubmit(this.state.value);
              }}
            />
          </ButtonGroup>
        </div>
      </div>
    );
  }

  _onInputKeyPress(event) {
    if (event.which === 13) {
      // Avoid submitting a <form> somewhere up the element tree.
      event.preventDefault();
      this._onSubmit();
    }
  }

  _onSubmit(value) {
    // let value = this._inputRef ? this._inputRef.value : '';
    this.props.onSubmit(value);
  }

  _onDocumentClick(event) {
    let rootNode = ReactDOM.findDOMNode(this);
    if (!rootNode.contains(event.target)) {
      // Here we pass the event so the parent can manage focus.
      this.props.onCancel(event);
    }
  }

  _onDocumentKeydown(event) {
    if (event.keyCode === 27) {
      this.props.onCancel();
    }
  }
}
