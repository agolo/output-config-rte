import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modifier, EditorState } from 'draft-js';
import RichTextEditor, {
  createFromState,
  createValueFromString,
} from './RichTextEditor';
import autobind from 'class-autobind';

import ButtonGroup from './ui/ButtonGroup';
import Dropdown from './ui/Dropdown';

import styles from './editorDemo.css';

export default class EditorDemo extends Component {
  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      value: createValueFromString(this.props.htmlTemplate, 'html'),
      format: 'html',
      readOnly: false,
    };
  }

  componentDidMount() {
    this.focusEditor();
  }

  setEditor = (editor) => {
    this.editor = editor;
  };

  focusEditor = () => {
    if (this.editor) {
      this.editor.focusEditor();
    }
  };

  insertText = (text, editorState) => {
    const currentContent = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();

    const newContent = Modifier.replaceText(
      currentContent,
      currentSelection,
      text
    );

    const newEditorState = EditorState.push(
      editorState,
      newContent,
      'insert-characters'
    );
    return EditorState.forceSelection(
      newEditorState,
      newContent.getSelectionAfter()
    );
  };

  render() {
    let { value, format } = this.state;
    let { sampleStory, availableFields, onChangeCallback } = this.props;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around' }} className="editor-demo">
        <div className="row" style={{ maxWidth: '50%' }}>
          <RichTextEditor
            value={value}
            onChange={(newValue) => {
              this._onChange(newValue);
              onChangeCallback();
            }}
            className="react-rte-demo"
            toolbarClassName="demo-toolbar"
            editorClassName="demo-editor"
            readOnly={this.state.readOnly}
            customControls={[
              // eslint-disable-next-line no-unused-vars
              (setValue, getValue, editorState) => {
                let choices = new Map([
                  ['add', { label: 'Add New Field' }],
                  ...availableFields.map((field) => [field, { label: field }]),
                ]);
                return (
                  <ButtonGroup key={1}>
                    <Dropdown
                      choices={choices}
                      selectedKey={getValue('my-control-name')}
                      onChange={(value) => {
                        setValue('my-control-name', value);
                        this.setState({
                          value:
                            value === 'sourcesSection'
                              ? createFromState(
                                  this.insertText(
                                    '\nSources (articlesCount article)',
                                    editorState
                                  )
                                )
                              : createFromState(
                                  this.insertText(` ${value} `, editorState)
                                ),
                        });
                        this.focusEditor();
                      }}
                    />
                  </ButtonGroup>
                );
              },
            ]}
          />
        </div>
        <div className="row" style={{ maxWidth: '50%' }}>
          <div className={styles.root}>
            <p>
              Sample Output from a single{' '}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={this.props.sampleStoryUrl}
              >
                Story
              </a>
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: this.props.replaceFieldsWithSampleData(
                  value.toString(format),
                  sampleStory
                ),
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  _logState() {
    let editorState = this.state.value.getEditorState();
    let contentState = (window.contentState = editorState
      .getCurrentContent()
      .toJS());
    console.log('contentState: ', contentState);
  }

  _onChange(value) {
    this.setState({ value });
  }

  _onChangeSource(event) {
    let source = event.target.value;
    let oldValue = this.state.value;
    this.setState({
      value: oldValue.setContentFromString(source, this.state.format),
    });
  }

  _onChangeFormat(event) {
    this.setState({ format: event.target.value });
  }

  _onChangeReadOnly(event) {
    this.setState({ readOnly: event.target.checked });
  }
}

EditorDemo.propTypes = {
  sampleStory: PropTypes.object,
  availableFields: PropTypes.array,
  replaceFieldsWithSampleData: PropTypes.func,
  sampleStoryUrl: PropTypes.string,
  htmlTemplate: PropTypes.string,
  onChangeCallback: PropTypes.func,
};

EditorDemo.defaultProps = {
  sampleStory: {},
  availableFields: [],
  replaceFieldsWithSampleData: () => {},
  sampleStoryUrl: '',
  htmlTemplate: '',
  onChangeCallback: () => {},
};
