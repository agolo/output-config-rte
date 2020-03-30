import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _Map from 'babel-runtime/core-js/map';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import RichTextEditor, { createFromState, createValueFromString } from './RichTextEditor';
import autobind from 'class-autobind';

import ButtonGroup from './ui/ButtonGroup';
import Dropdown from './ui/Dropdown';
import { Modifier, EditorState } from 'draft-js';

import styles from './editorDemo.css';

var EditorDemo = function (_Component) {
  _inherits(EditorDemo, _Component);

  function EditorDemo() {
    _classCallCheck(this, EditorDemo);

    var _this = _possibleConstructorReturn(this, (EditorDemo.__proto__ || _Object$getPrototypeOf(EditorDemo)).apply(this, arguments));

    _this.setEditor = function (editor) {
      _this.editor = editor;
    };

    _this.focusEditor = function () {
      if (_this.editor) {
        _this.editor.focusEditor();
      }
    };

    _this.insertText = function (text, editorState) {
      var currentContent = editorState.getCurrentContent();
      var currentSelection = editorState.getSelection();

      var newContent = Modifier.replaceText(currentContent, currentSelection, text);

      var newEditorState = EditorState.push(editorState, newContent, 'insert-characters');
      return EditorState.forceSelection(newEditorState, newContent.getSelectionAfter());
    };

    autobind(_this);
    _this.state = {
      value: createValueFromString(_this.props.htmlTemplate, 'html'),
      format: 'html',
      readOnly: false
    };
    return _this;
  }

  _createClass(EditorDemo, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.focusEditor();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          value = _state.value,
          format = _state.format;
      var _props = this.props,
          sampleStory = _props.sampleStory,
          availableFields = _props.availableFields;

      return React.createElement(
        'div',
        { style: { display: 'flex' }, className: 'editor-demo' },
        React.createElement(
          'div',
          { className: 'row', style: { width: '50%' } },
          React.createElement(RichTextEditor, {
            value: value,
            onChange: this._onChange,
            className: 'react-rte-demo',
            toolbarClassName: 'demo-toolbar',
            editorClassName: 'demo-editor',
            readOnly: this.state.readOnly,
            customControls: [
            // eslint-disable-next-line no-unused-vars
            function (setValue, getValue, editorState) {
              var choices = new _Map([['add', { label: 'Add New Field' }]].concat(_toConsumableArray(availableFields.map(function (field) {
                return [field, { label: field }];
              }))));
              return React.createElement(
                ButtonGroup,
                { key: 1 },
                React.createElement(Dropdown, {
                  choices: choices,
                  selectedKey: getValue('my-control-name'),
                  onChange: function onChange(value) {
                    setValue('my-control-name', value);
                    _this2.setState({
                      value: value === 'sourcesSection' ? createFromState(_this2.insertText('\nSources (articlesCount article)', editorState)) : createFromState(_this2.insertText(' ' + value + ' ', editorState))
                    });
                    _this2.focusEditor();
                  }
                })
              );
            }]
          })
        ),
        React.createElement(
          'div',
          { className: 'row', style: { width: '50%' } },
          React.createElement(
            'div',
            { className: styles.root },
            React.createElement(
              'p',
              null,
              'Sample Output from a single',
              ' ',
              React.createElement(
                'a',
                {
                  rel: 'noopener noreferrer',
                  target: '_blank',
                  href: this.props.sampleStoryUrl
                },
                'Story'
              )
            ),
            React.createElement('div', {
              dangerouslySetInnerHTML: {
                __html: this.props.replaceFieldsWithSampleData(value.toString(format), sampleStory)
              }
            })
          )
        )
      );
    }
  }, {
    key: '_logState',
    value: function _logState() {
      var editorState = this.state.value.getEditorState();
      var contentState = window.contentState = editorState.getCurrentContent().toJS();
      console.log('contentState: ', contentState);
    }
  }, {
    key: '_onChange',
    value: function _onChange(value) {
      this.setState({ value: value });
    }
  }, {
    key: '_onChangeSource',
    value: function _onChangeSource(event) {
      var source = event.target.value;
      var oldValue = this.state.value;
      this.setState({
        value: oldValue.setContentFromString(source, this.state.format)
      });
    }
  }, {
    key: '_onChangeFormat',
    value: function _onChangeFormat(event) {
      this.setState({ format: event.target.value });
    }
  }, {
    key: '_onChangeReadOnly',
    value: function _onChangeReadOnly(event) {
      this.setState({ readOnly: event.target.checked });
    }
  }]);

  return EditorDemo;
}(Component);

export default EditorDemo;
import _Object$assign from 'babel-runtime/core-js/object/assign';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import { CompositeDecorator, Editor, EditorState, Modifier, RichUtils } from 'draft-js';
import getDefaultKeyBinding from 'draft-js/lib/getDefaultKeyBinding';
import changeBlockDepth from './lib/changeBlockDepth';
import changeBlockType from './lib/changeBlockType';
import insertBlockAfter from './lib/insertBlockAfter';
import isListItem from './lib/isListItem';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';
import EditorToolbar from './lib/EditorToolbar';
import EditorValue from './lib/EditorValue';
import LinkDecorator from './lib/LinkDecorator';
import composite from './lib/composite';
import cx from 'classnames';
import autobind from 'class-autobind';
import EventEmitter from 'events';
import { BLOCK_TYPE } from 'draft-js-utils';

import './Draft.global.css';
import styles from './RichTextEditor.css';

import ButtonGroup from './ui/ButtonGroup';
import Button from './ui/Button';
import Dropdown from './ui/Dropdown';

var MAX_LIST_DEPTH = 2;

// Custom overrides for "code" style.
var styleMap = {
  CODE: {
    backgroundColor: '#f3f3f3',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2
  }
};

var RichTextEditor = function (_Component) {
  _inherits(RichTextEditor, _Component);

  function RichTextEditor() {
    _classCallCheck(this, RichTextEditor);

    var _this = _possibleConstructorReturn(this, (RichTextEditor.__proto__ || _Object$getPrototypeOf(RichTextEditor)).apply(this, arguments));

    _this._keyEmitter = new EventEmitter();
    autobind(_this);
    return _this;
  }

  _createClass(RichTextEditor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var autoFocus = this.props.autoFocus;


      if (!autoFocus) {
        return;
      }

      this._focus();
    }
  }, {
    key: 'render',
    value: function render() {
      var _cx,
          _this2 = this;

      var _props = this.props,
          value = _props.value,
          className = _props.className,
          toolbarClassName = _props.toolbarClassName,
          editorClassName = _props.editorClassName,
          placeholder = _props.placeholder,
          customStyleMap = _props.customStyleMap,
          readOnly = _props.readOnly,
          disabled = _props.disabled,
          toolbarConfig = _props.toolbarConfig,
          toolbarOnBottom = _props.toolbarOnBottom,
          blockStyleFn = _props.blockStyleFn,
          customControls = _props.customControls,
          keyBindingFn = _props.keyBindingFn,
          rootStyle = _props.rootStyle,
          toolbarStyle = _props.toolbarStyle,
          editorStyle = _props.editorStyle,
          otherProps = _objectWithoutProperties(_props, ['value', 'className', 'toolbarClassName', 'editorClassName', 'placeholder', 'customStyleMap', 'readOnly', 'disabled', 'toolbarConfig', 'toolbarOnBottom', 'blockStyleFn', 'customControls', 'keyBindingFn', 'rootStyle', 'toolbarStyle', 'editorStyle']);

      var editorState = value.getEditorState();
      customStyleMap = customStyleMap ? _extends({}, styleMap, customStyleMap) : styleMap;

      // If the user changes block type before entering any text, we can either
      // style the placeholder or hide it. Let's just hide it for now.
      var combinedEditorClassName = cx((_cx = {}, _defineProperty(_cx, styles.editor, true), _defineProperty(_cx, styles.hidePlaceholder, this._shouldHidePlaceholder()), _cx), editorClassName);
      if (readOnly == null) {
        readOnly = disabled;
      }
      var editorToolbar = void 0;
      if (!readOnly) {
        editorToolbar = React.createElement(EditorToolbar, {
          rootStyle: toolbarStyle,
          isOnBottom: toolbarOnBottom,
          className: toolbarClassName,
          keyEmitter: this._keyEmitter,
          editorState: editorState,
          onChange: this._onChange,
          focusEditor: this._focus,
          toolbarConfig: toolbarConfig,
          customControls: customControls
        });
      }
      return React.createElement(
        'div',
        { className: cx(styles.root, className), style: rootStyle },
        !toolbarOnBottom && editorToolbar,
        React.createElement(
          'div',
          { className: combinedEditorClassName, style: editorStyle },
          React.createElement(Editor, _extends({}, otherProps, {
            blockStyleFn: composite(defaultBlockStyleFn, blockStyleFn),
            customStyleMap: customStyleMap,
            editorState: editorState,
            handleReturn: this._handleReturn,
            keyBindingFn: keyBindingFn || this._customKeyHandler,
            handleKeyCommand: this._handleKeyCommand,
            onTab: this._onTab,
            onChange: this._onChange,
            placeholder: placeholder,
            ref: function ref(el) {
              _this2.editor = el;
            },
            spellCheck: true,
            readOnly: readOnly
          }))
        ),
        toolbarOnBottom && editorToolbar
      );
    }
  }, {
    key: '_shouldHidePlaceholder',
    value: function _shouldHidePlaceholder() {
      var editorState = this.props.value.getEditorState();
      var contentState = editorState.getCurrentContent();
      if (!contentState.hasText()) {
        if (contentState.getBlockMap().first().getType() !== 'unstyled') {
          return true;
        }
      }
      return false;
    }
  }, {
    key: '_handleReturn',
    value: function _handleReturn(event) {
      var handleReturn = this.props.handleReturn;

      if (handleReturn != null && handleReturn(event)) {
        return true;
      }
      if (this._handleReturnSoftNewline(event)) {
        return true;
      }
      if (this._handleReturnEmptyListItem()) {
        return true;
      }
      if (this._handleReturnSpecialBlock()) {
        return true;
      }
      return false;
    }

    // `shift + return` should insert a soft newline.

  }, {
    key: '_handleReturnSoftNewline',
    value: function _handleReturnSoftNewline(event) {
      var editorState = this.props.value.getEditorState();
      if (isSoftNewlineEvent(event)) {
        var selection = editorState.getSelection();
        if (selection.isCollapsed()) {
          this._onChange(RichUtils.insertSoftNewline(editorState));
        } else {
          var content = editorState.getCurrentContent();
          var newContent = Modifier.removeRange(content, selection, 'forward');
          var newSelection = newContent.getSelectionAfter();
          var block = newContent.getBlockForKey(newSelection.getStartKey());
          newContent = Modifier.insertText(newContent, newSelection, '\n', block.getInlineStyleAt(newSelection.getStartOffset()), null);
          this._onChange(EditorState.push(editorState, newContent, 'insert-fragment'));
        }
        return true;
      }
      return false;
    }

    // If the cursor is in an empty list item when return is pressed, then the
    // block type should change to normal (end the list).

  }, {
    key: '_handleReturnEmptyListItem',
    value: function _handleReturnEmptyListItem() {
      var editorState = this.props.value.getEditorState();
      var selection = editorState.getSelection();
      if (selection.isCollapsed()) {
        var contentState = editorState.getCurrentContent();
        var blockKey = selection.getStartKey();
        var block = contentState.getBlockForKey(blockKey);
        if (isListItem(block) && block.getLength() === 0) {
          var depth = block.getDepth();
          var newState = depth === 0 ? changeBlockType(editorState, blockKey, BLOCK_TYPE.UNSTYLED) : changeBlockDepth(editorState, blockKey, depth - 1);
          this._onChange(newState);
          return true;
        }
      }
      return false;
    }

    // If the cursor is at the end of a special block (any block type other than
    // normal or list item) when return is pressed, new block should be normal.

  }, {
    key: '_handleReturnSpecialBlock',
    value: function _handleReturnSpecialBlock() {
      var editorState = this.props.value.getEditorState();
      var selection = editorState.getSelection();
      if (selection.isCollapsed()) {
        var contentState = editorState.getCurrentContent();
        var blockKey = selection.getStartKey();
        var block = contentState.getBlockForKey(blockKey);
        if (!isListItem(block) && block.getType() !== BLOCK_TYPE.UNSTYLED) {
          // If cursor is at end.
          if (block.getLength() === selection.getStartOffset()) {
            var newEditorState = insertBlockAfter(editorState, blockKey, BLOCK_TYPE.UNSTYLED);
            this._onChange(newEditorState);
            return true;
          }
        }
      }
      return false;
    }
  }, {
    key: '_onTab',
    value: function _onTab(event) {
      var editorState = this.props.value.getEditorState();
      var newEditorState = RichUtils.onTab(event, editorState, MAX_LIST_DEPTH);
      if (newEditorState !== editorState) {
        this._onChange(newEditorState);
      }
    }
  }, {
    key: '_customKeyHandler',
    value: function _customKeyHandler(event) {
      // Allow toolbar to catch key combinations.
      var eventFlags = {};
      this._keyEmitter.emit('keypress', event, eventFlags);
      if (eventFlags.wasHandled) {
        return null;
      } else {
        return getDefaultKeyBinding(event);
      }
    }
  }, {
    key: '_handleKeyCommand',
    value: function _handleKeyCommand(command) {
      var editorState = this.props.value.getEditorState();
      var newEditorState = RichUtils.handleKeyCommand(editorState, command);
      if (newEditorState) {
        this._onChange(newEditorState);
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: '_onChange',
    value: function _onChange(editorState) {
      var _props2 = this.props,
          onChange = _props2.onChange,
          value = _props2.value;


      if (onChange == null) {
        return;
      }
      var newValue = value.setEditorState(editorState);

      onChange(newValue);
    }
  }, {
    key: '_focus',
    value: function _focus() {
      this.editor.focus();
    }
  }]);

  return RichTextEditor;
}(Component);

export default RichTextEditor;


function defaultBlockStyleFn(block) {
  var result = styles.block;
  switch (block.getType()) {
    case 'unstyled':
      return cx(result, styles.paragraph);
    case 'blockquote':
      return cx(result, styles.blockquote);
    case 'code-block':
      return cx(result, styles.codeBlock);
    default:
      return result;
  }
}

var decorator = new CompositeDecorator([LinkDecorator]);

function createEmptyValue() {
  return EditorValue.createEmpty(decorator);
}

function createFromState(editorState) {
  return EditorValue.createFromState(editorState);
}

function createValueFromString(markup, format, options) {
  return EditorValue.createFromString(markup, format, decorator, options);
}

// $FlowIssue - This should probably not be done this way.
_Object$assign(RichTextEditor, {
  EditorValue: EditorValue,
  decorator: decorator,
  createEmptyValue: createEmptyValue,
  createFromState: createFromState,
  createValueFromString: createValueFromString,
  ButtonGroup: ButtonGroup,
  Button: Button,
  Dropdown: Dropdown
});

export { EditorValue, decorator, createEmptyValue, createFromState, createValueFromString, ButtonGroup, Button, Dropdown };
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import RichTextEditor, { createEmptyValue } from './RichTextEditor';
import autobind from 'class-autobind';

var SimpleRichTextEditor = function (_Component) {
  _inherits(SimpleRichTextEditor, _Component);

  function SimpleRichTextEditor() {
    _classCallCheck(this, SimpleRichTextEditor);

    var _this = _possibleConstructorReturn(this, (SimpleRichTextEditor.__proto__ || _Object$getPrototypeOf(SimpleRichTextEditor)).apply(this, arguments));

    autobind(_this);
    _this.state = {
      editorValue: createEmptyValue()
    };
    return _this;
  }
  // The [format, value] of what's currently displayed in the <RichTextEditor />


  _createClass(SimpleRichTextEditor, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this._updateStateFromProps(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      this._updateStateFromProps(newProps);
    }
  }, {
    key: '_updateStateFromProps',
    value: function _updateStateFromProps(newProps) {
      var value = newProps.value,
          format = newProps.format;

      if (this._currentValue != null) {
        var _currentValue = _slicedToArray(this._currentValue, 2),
            currentFormat = _currentValue[0],
            currentValue = _currentValue[1];

        if (format === currentFormat && value === currentValue) {
          return;
        }
      }
      var editorValue = this.state.editorValue;

      this.setState({
        editorValue: editorValue.setContentFromString(value, format)
      });
      this._currentValue = [format, value];
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          value = _props.value,
          format = _props.format,
          onChange = _props.onChange,
          otherProps = _objectWithoutProperties(_props, ['value', 'format', 'onChange']); // eslint-disable-line no-unused-vars


      return React.createElement(RichTextEditor, _extends({}, otherProps, {
        value: this.state.editorValue,
        onChange: this._onChange
      }));
    }
  }, {
    key: '_onChange',
    value: function _onChange(editorValue) {
      var _props2 = this.props,
          format = _props2.format,
          onChange = _props2.onChange;

      var oldEditorValue = this.state.editorValue;
      this.setState({ editorValue: editorValue });
      var oldContentState = oldEditorValue ? oldEditorValue.getEditorState().getCurrentContent() : null;
      var newContentState = editorValue.getEditorState().getCurrentContent();
      if (oldContentState !== newContentState) {
        var stringValue = editorValue.toString(format);
        // Optimization so if we receive new props we don't need
        // to parse anything unnecessarily.
        this._currentValue = [format, stringValue];
        if (onChange && stringValue !== this.props.value) {
          onChange(stringValue);
        }
      }
    }
  }]);

  return SimpleRichTextEditor;
}(Component);

export default SimpleRichTextEditor;
var _global = global,
    describe = _global.describe,
    it = _global.it;

import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import expect from 'expect';
import RichTextEditor, { createEmptyValue } from '../RichTextEditor';

describe('RichTextEditor', function () {
  it('should render', function () {
    var renderer = new ShallowRenderer();
    var value = createEmptyValue();
    renderer.render(React.createElement(RichTextEditor, { value: value }));
    var output = renderer.getRenderOutput();
    expect(output.type).toEqual('div');
    expect(output.props.className).toBeA('string');
    expect(output.props.className).toInclude('RichTextEditor__root');
  });
});
export var sampleStory = {
  feedName: 'Google',
  feedStartDate: 'March 14, 2020',
  feedendDate: 'March 16, 2020',
  storyTitle: 'Legislative Tracker Sounds Alarm on Anti-Transparency Bills',
  storyDate: 'March 15, 2020',
  summaryBullets: ["To open government advocates, the effort to hide Louisville's bid was an outrage that soon got worse: A House committee approved the bill with an amendment barring residents outside Kentucky from obtaining public records on any subject.", "Advocates like her in all 50 states are getting a new tool to help identify legislation like the Amazon bill that affect the public’s right to know — and give a glimpse of what's happening across the country.", 'The National Freedom of Information Coalition is launching a bill tracker that aims to find, in real-time, all pieces of legislation that affect government transparency in state legislatures.', 'Daniel Bevarly, the coalition’s executive director, said tracking such bills is challenging because only a few states, such as Florida and Maine, require such legislation to state up-front that they would affect government transparency.', 'The program uses software from Quorum, a Washington D. C.-based technology company, that scrapes the raw text of bills from all 50 state legislative websites once or more a day.'],
  articles: [{
    articleTitle: 'Legislative Tracker Sounds Alarm on Anti-Transparency Bills',
    articleUrl: 'https://www.ksat.com/news/politics/2020/03/10/legislative-tracker-sounds-alarm-on-anti-transparency-bills/',
    articleDate: 'March 15, 2020',
    articleSource: 'KSAT'
  }, {
    articleTitle: '2 Legislative Tracker Sounds Alarm on Anti-Transparency Bills',
    articleUrl: 'https://www.ksat.com/news/politics/2020/03/10/legislative-tracker-sounds-alarm-on-anti-transparency-bills/',
    articleDate: '2March 15, 2020',
    articleSource: 'KSAT2'
  }]
};

export var availableFields = ['feedName', 'feedStartDate', 'feedEndDate', 'storyTitle', 'storyDate', 'summaryBullets', 'articleTitle', 'articleUrl', 'articleDate', 'articleSource', 'articlesCount', 'sourcesSection'];

export var replaceFieldsWithSampleData = function replaceFieldsWithSampleData() {
  var htmlTemplate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var sampleStory = arguments[1];

  var output = htmlTemplate.replace(/(\s{2,}|\n|\t)/g, ' ');
  var possibleSourcesTitles = ['Sources', 'Sources (articlesCount article)'];
  var sourcesTemplate = '';
  possibleSourcesTitles.map(function (title) {
    if (htmlTemplate.indexOf(title) > 0) {
      sourcesTemplate = htmlTemplate.replace(/(\s{2,}|\n|\t)/g, ' ').split(title)[1];
    }
  });
  var containUlListForSummaryBullets = output.match(/\<ul\> \<li\>summaryBullets\<\/li\> <\/ul\>/);
  var containOlListForSummaryBullets = output.match(/\<ol\> \<li\>summaryBullets\<\/li\> <\/ol\>/);
  output = output.replace(/\bfeedName\b/g, sampleStory.feedName).replace(/\bfeedStartDate\b/g, sampleStory.feedStartDate).replace(/\bfeedEndDate\b/g, sampleStory.feedendDate).replace(/\bstoryTitle\b/g, sampleStory.storyTitle).replace(/\bstoryDate\b/g, sampleStory.storyDate);
  if (containUlListForSummaryBullets) {
    output = output.replace(/\<ul\> \<li\>summaryBullets\<\/li\> <\/ul\>/, '<ul>' + sampleStory.summaryBullets.map(function (bullet) {
      return '<li>' + bullet + '</li>';
    }).join('\n') + '</ul>');
  } else if (containOlListForSummaryBullets) {
    output = output.replace(/\<ol\> \<li\>summaryBullets\<\/li\> <\/ol\>/, '<ol>' + sampleStory.summaryBullets.map(function (bullet) {
      return '<li>' + bullet + '</li>';
    }).join('\n') + '</ol>');
  } else {
    output = output.replace(/\bsummaryBullets\b/, '<ul>' + sampleStory.summaryBullets.map(function (bullet) {
      return '<li>' + bullet + '</li>';
    }).join('\n') + '</ul>');
  }
  output = output.replace(/\b(articlesCount article)\b/g, sampleStory.articles.length > 0 ? sampleStory.articles.length + ' articles' : sampleStory.articles.length + ' article');
  output = output.replace(/(<a href=)/g, "<a ref='noopener noreferer' target='_blank' href=");

  if (sourcesTemplate) {
    sampleStory.articles.map(function (article) {
      var articleOutput = replaceSourceFieldsWithArticleData(sourcesTemplate, article);
      output += articleOutput;
      return article;
    });
    output = output.replace(sourcesTemplate, '');
  }
  return output;
};

var replaceSourceFieldsWithArticleData = function replaceSourceFieldsWithArticleData(sourcesTemplate, article) {
  var output = sourcesTemplate;
  output = output.replace(/\b(articleUrl)\b/g, article.articleUrl);
  output = output.replace(/\b(articleTitle)\b/g, article.articleTitle);
  output = output.replace(/\b(articleDate)\b/g, article.articleDate);
  output = output.replace(/\b(articleSource)\b/g, article.articleSource);
  output = output.replace(/\b(sourcesCount)\b/g, '1');

  return output;
};

export var htmlTemplate = '\n  <p>Feed: feedName</p>\n  <p><br></p>\n  <p>feedStartDate - feedEndDate</p>\n  <p><br></p>\n  <p>storyTitle</p>\n  <p>storyDate</p>\n  <p><br></p>\n  <p>Summary:</p>\n  <p>summaryBullets</p>\n  <p><br></p>\n  <p>Sources (articlesCount article)</p>\n  <p><strong>articleTitle</strong></p>\n  <p>articleDate</p>\n  <p><a ref="noopener noreferer" target="_blank" href="articleUrl">articleUrl</a></p>\n  <p>articleDate | [sourcesCount] articleSource</p>\n';

export var sampleStoryUrl = 'https://app.acuity.agolo.com/feed/5e6dfdfb48ea10000191e397/summary/5e6dfe146b08de149041cea9?collapseSider=false';
import React from 'react';
import ReactDOM from 'react-dom';
import EditorDemo from './EditorDemo';
import { sampleStory, availableFields, replaceFieldsWithSampleData, sampleStoryUrl, htmlTemplate } from './constants';

document.addEventListener('DOMContentLoaded', function () {
  var rootNode = document.createElement('div');
  document.body.appendChild(rootNode);
  ReactDOM.render(React.createElement(EditorDemo, {
    sampleStory: sampleStory,
    availableFields: availableFields,
    htmlTemplate: htmlTemplate,
    sampleStoryUrl: sampleStoryUrl,
    replaceFieldsWithSampleData: replaceFieldsWithSampleData
  }), rootNode);
});
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import EditorDemo from './EditorDemo';

var EditorDemoExample = function (_Component) {
  _inherits(EditorDemoExample, _Component);

  function EditorDemoExample() {
    _classCallCheck(this, EditorDemoExample);

    return _possibleConstructorReturn(this, (EditorDemoExample.__proto__ || _Object$getPrototypeOf(EditorDemoExample)).apply(this, arguments));
  }

  _createClass(EditorDemoExample, [{
    key: 'render',
    value: function render() {
      return React.createElement(EditorDemo, {
        sampleStory: this.props.sampleStory,
        availableFields: this.props.availableFields,
        replaceFieldsWithSampleData: this.props.replaceFieldsWithSampleData,
        htmlTemplate: this.props.htmlTemplate,
        sampleStoryUrl: this.props.sampleStoryUrl
      });
    }
  }]);

  return EditorDemoExample;
}(Component);

export default EditorDemoExample;
import _Array$from from 'babel-runtime/core-js/array/from';
import _Map from 'babel-runtime/core-js/map';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import { hasCommandModifier } from 'draft-js/lib/KeyBindingUtil';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { EditorState, RichUtils } from 'draft-js';
import { ENTITY_TYPE } from 'draft-js-utils';
import DefaultToolbarConfig from './EditorToolbarConfig';
import StyleButton from './StyleButton';
import PopoverIconButton from '../ui/PopoverIconButton';
import ButtonGroup from '../ui/ButtonGroup';
import Dropdown from '../ui/Dropdown';
import IconButton from '../ui/IconButton';
import getEntityAtCursor from './getEntityAtCursor';
import clearEntityForRange from './clearEntityForRange';
import autobind from 'class-autobind';
import cx from 'classnames';

import styles from './EditorToolbar.css';

var EditorToolbar = function (_Component) {
  _inherits(EditorToolbar, _Component);

  function EditorToolbar() {
    _classCallCheck(this, EditorToolbar);

    var _this = _possibleConstructorReturn(this, (EditorToolbar.__proto__ || _Object$getPrototypeOf(EditorToolbar)).apply(this, arguments));

    autobind(_this);
    _this.state = {
      showLinkInput: false,
      customControlState: {}
    };
    return _this;
  }

  _createClass(EditorToolbar, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      // Technically, we should also attach/detach event listeners when the
      // `keyEmitter` prop changes.
      this.props.keyEmitter.on('keypress', this._onKeypress);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.keyEmitter.removeListener('keypress', this._onKeypress);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          className = _props.className,
          toolbarConfig = _props.toolbarConfig,
          rootStyle = _props.rootStyle,
          isOnBottom = _props.isOnBottom;

      if (toolbarConfig == null) {
        toolbarConfig = DefaultToolbarConfig;
      }
      var display = toolbarConfig.display || DefaultToolbarConfig.display;
      var buttonGroups = display.map(function (groupName) {
        switch (groupName) {
          case 'INLINE_STYLE_BUTTONS':
            {
              return _this2._renderInlineStyleButtons(groupName, toolbarConfig);
            }
          case 'BLOCK_TYPE_DROPDOWN':
            {
              return _this2._renderBlockTypeDropdown(groupName, toolbarConfig);
            }
          case 'LINK_BUTTONS':
            {
              return _this2._renderLinkButtons(groupName, toolbarConfig);
            }
          case 'BLOCK_TYPE_BUTTONS':
            {
              return _this2._renderBlockTypeButtons(groupName, toolbarConfig);
            }
          case 'HISTORY_BUTTONS':
            {
              return _this2._renderUndoRedo(groupName, toolbarConfig);
            }
        }
      });
      return React.createElement(
        'div',
        {
          className: cx(styles.root, isOnBottom && styles.onBottom, className),
          style: rootStyle
        },
        this._renderCustomControls(),
        buttonGroups
      );
    }
  }, {
    key: '_renderCustomControls',
    value: function _renderCustomControls() {
      var _this3 = this;

      var _props2 = this.props,
          customControls = _props2.customControls,
          editorState = _props2.editorState;

      if (customControls == null) {
        return;
      }
      return customControls.map(function (f) {
        switch (typeof f === 'undefined' ? 'undefined' : _typeof(f)) {
          case 'function':
            {
              return f(_this3._setCustomControlState, _this3._getCustomControlState, editorState);
            }
          default:
            {
              return f;
            }
        }
      });
    }
  }, {
    key: '_setCustomControlState',
    value: function _setCustomControlState(key, value) {
      this.setState(function (_ref) {
        var customControlState = _ref.customControlState;
        return {
          customControlState: _extends({}, customControlState, _defineProperty({}, key, value))
        };
      });
    }
  }, {
    key: '_getCustomControlState',
    value: function _getCustomControlState(key) {
      return this.state.customControlState[key];
    }
  }, {
    key: '_renderBlockTypeDropdown',
    value: function _renderBlockTypeDropdown(name, toolbarConfig) {
      var blockType = this._getCurrentBlockType();
      var choices = new _Map((toolbarConfig.BLOCK_TYPE_DROPDOWN || []).map(function (type) {
        return [type.style, { label: type.label, className: type.className }];
      }));
      if (!choices.has(blockType)) {
        blockType = _Array$from(choices.keys())[0];
      }
      return React.createElement(
        ButtonGroup,
        { key: name },
        React.createElement(Dropdown, _extends({}, toolbarConfig.extraProps, {
          choices: choices,
          selectedKey: blockType,
          onChange: this._selectBlockType
        }))
      );
    }
  }, {
    key: '_renderBlockTypeButtons',
    value: function _renderBlockTypeButtons(name, toolbarConfig) {
      var _this4 = this;

      var blockType = this._getCurrentBlockType();
      var buttons = (toolbarConfig.BLOCK_TYPE_BUTTONS || []).map(function (type, index) {
        return React.createElement(StyleButton, _extends({}, toolbarConfig.extraProps, {
          key: String(index),
          isActive: type.style === blockType,
          label: type.label,
          onToggle: _this4._toggleBlockType,
          style: type.style,
          className: type.className
        }));
      });
      return React.createElement(
        ButtonGroup,
        { key: name },
        buttons
      );
    }
  }, {
    key: '_renderInlineStyleButtons',
    value: function _renderInlineStyleButtons(name, toolbarConfig) {
      var _this5 = this;

      var editorState = this.props.editorState;

      var currentStyle = editorState.getCurrentInlineStyle();
      var buttons = (toolbarConfig.INLINE_STYLE_BUTTONS || []).map(function (type, index) {
        return React.createElement(StyleButton, _extends({}, toolbarConfig.extraProps, {
          key: String(index),
          isActive: currentStyle.has(type.style),
          label: type.label,
          onToggle: _this5._toggleInlineStyle,
          style: type.style,
          className: type.className
        }));
      });
      return React.createElement(
        ButtonGroup,
        { key: name },
        buttons
      );
    }
  }, {
    key: '_renderLinkButtons',
    value: function _renderLinkButtons(name, toolbarConfig) {
      var editorState = this.props.editorState;

      var selection = editorState.getSelection();
      var entity = this._getEntityAtCursor();
      var hasSelection = !selection.isCollapsed();
      var isCursorOnLink = entity != null && entity.type === ENTITY_TYPE.LINK;
      var shouldShowLinkButton = hasSelection || isCursorOnLink;
      var defaultValue = entity && isCursorOnLink ? entity.getData().url : '';
      var config = toolbarConfig.LINK_BUTTONS || {};
      var linkConfig = config.link || {};
      var removeLinkConfig = config.removeLink || {};
      var linkLabel = linkConfig.label || 'Link';
      var removeLinkLabel = removeLinkConfig.label || 'Remove Link';

      return React.createElement(
        ButtonGroup,
        { key: name },
        React.createElement(PopoverIconButton, {
          label: linkLabel,
          iconName: 'link',
          isDisabled: !shouldShowLinkButton,
          showPopover: this.state.showLinkInput,
          onTogglePopover: this._toggleShowLinkInput,
          defaultValue: defaultValue,
          onSubmit: this._setLink
        }),
        React.createElement(IconButton, _extends({}, toolbarConfig.extraProps, {
          label: removeLinkLabel,
          iconName: 'remove-link',
          isDisabled: !isCursorOnLink,
          onClick: this._removeLink,
          focusOnClick: false
        }))
      );
    }
  }, {
    key: '_renderUndoRedo',
    value: function _renderUndoRedo(name, toolbarConfig) {
      var editorState = this.props.editorState;

      var canUndo = editorState.getUndoStack().size !== 0;
      var canRedo = editorState.getRedoStack().size !== 0;
      var config = toolbarConfig.HISTORY_BUTTONS || {};
      var undoConfig = config.undo || {};
      var redoConfig = config.redo || {};
      var undoLabel = undoConfig.label || 'Undo';
      var redoLabel = redoConfig.label || 'Redo';
      return React.createElement(
        ButtonGroup,
        { key: name },
        React.createElement(IconButton, _extends({}, toolbarConfig.extraProps, {
          label: undoLabel,
          iconName: 'undo',
          isDisabled: !canUndo,
          onClick: this._undo,
          focusOnClick: false
        })),
        React.createElement(IconButton, _extends({}, toolbarConfig.extraProps, {
          label: redoLabel,
          iconName: 'redo',
          isDisabled: !canRedo,
          onClick: this._redo,
          focusOnClick: false
        }))
      );
    }
  }, {
    key: '_onKeypress',
    value: function _onKeypress(event, eventFlags) {
      // Catch cmd+k for use with link insertion.
      if (hasCommandModifier(event) && event.keyCode === 75) {
        var editorState = this.props.editorState;

        if (!editorState.getSelection().isCollapsed()) {
          this.setState({ showLinkInput: true });
          eventFlags.wasHandled = true;
        }
      }
    }
  }, {
    key: '_focusEditor',
    value: function _focusEditor() {
      var shouldFocusEditor = true;
      if (event && event.type === 'click') {
        // TODO: Use a better way to get the editor root node.
        var editorRoot = ReactDOM.findDOMNode(this).parentNode;
        var _document = document,
            activeElement = _document.activeElement;

        var wasClickAway = activeElement == null || activeElement === document.body;
        if (!wasClickAway && !editorRoot.contains(activeElement)) {
          shouldFocusEditor = false;
        }
      }
      if (shouldFocusEditor) {
        this.props.focusEditor();
      }
    }
  }, {
    key: '_toggleShowLinkInput',
    value: function _toggleShowLinkInput() {
      var isShowing = this.state.showLinkInput;
      // If this is a hide request, decide if we should focus the editor.
      // if (isShowing) {
      //   this._focusEditor();
      // }
      this.setState({ showLinkInput: !isShowing });
    }
  }, {
    key: '_setLink',
    value: function _setLink(url) {
      if (!url) {
        this._removeLink();
      } else {
        var editorState = this.props.editorState;

        var contentState = editorState.getCurrentContent();
        var selection = editorState.getSelection();
        var origSelection = selection;
        var canApplyLink = false;

        if (selection.isCollapsed()) {
          var entity = this._getEntityDescriptionAtCursor();
          if (entity) {
            canApplyLink = true;
            selection = selection.merge({
              anchorOffset: entity.startOffset,
              focusOffset: entity.endOffset,
              isBackward: false
            });
          }
        } else {
          canApplyLink = true;
        }

        this.setState({ showLinkInput: false });
        if (canApplyLink) {
          contentState = contentState.createEntity(ENTITY_TYPE.LINK, 'MUTABLE', {
            url: url
          });
          var entityKey = contentState.getLastCreatedEntityKey();

          editorState = EditorState.push(editorState, contentState);
          editorState = RichUtils.toggleLink(editorState, selection, entityKey);
          editorState = EditorState.acceptSelection(editorState, origSelection);

          this.props.onChange(editorState);
        }
        this._focusEditor();
      }
    }
  }, {
    key: '_removeLink',
    value: function _removeLink() {
      var editorState = this.props.editorState;

      var entity = getEntityAtCursor(editorState);
      if (entity != null) {
        var blockKey = entity.blockKey,
            startOffset = entity.startOffset,
            endOffset = entity.endOffset;

        this.props.onChange(clearEntityForRange(editorState, blockKey, startOffset, endOffset));
      }
    }
  }, {
    key: '_getEntityDescriptionAtCursor',
    value: function _getEntityDescriptionAtCursor() {
      var editorState = this.props.editorState;

      return getEntityAtCursor(editorState);
    }
  }, {
    key: '_getEntityAtCursor',
    value: function _getEntityAtCursor() {
      var editorState = this.props.editorState;

      var contentState = editorState.getCurrentContent();
      var entity = getEntityAtCursor(editorState);
      return entity == null ? null : contentState.getEntity(entity.entityKey);
    }
  }, {
    key: '_getCurrentBlockType',
    value: function _getCurrentBlockType() {
      var editorState = this.props.editorState;

      var selection = editorState.getSelection();
      return editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
    }
  }, {
    key: '_selectBlockType',
    value: function _selectBlockType() {
      this._toggleBlockType.apply(this, arguments);
      this._focusEditor();
    }
  }, {
    key: '_toggleBlockType',
    value: function _toggleBlockType(blockType) {
      this.props.onChange(RichUtils.toggleBlockType(this.props.editorState, blockType));
    }
  }, {
    key: '_toggleInlineStyle',
    value: function _toggleInlineStyle(inlineStyle) {
      this.props.onChange(RichUtils.toggleInlineStyle(this.props.editorState, inlineStyle));
    }
  }, {
    key: '_undo',
    value: function _undo() {
      var editorState = this.props.editorState;

      this.props.onChange(EditorState.undo(editorState));
    }
  }, {
    key: '_redo',
    value: function _redo() {
      var editorState = this.props.editorState;

      this.props.onChange(EditorState.redo(editorState));
    }
  }, {
    key: '_focusEditor',
    value: function _focusEditor() {
      var _this6 = this;

      // Hacky: Wait to focus the editor so we don't lose selection.
      setTimeout(function () {
        _this6.props.focusEditor();
      }, 50);
    }
  }]);

  return EditorToolbar;
}(Component);

export default EditorToolbar;
export var INLINE_STYLE_BUTTONS = [{ label: 'Bold', style: 'BOLD' }, { label: 'Italic', style: 'ITALIC' }, { label: 'Strikethrough', style: 'STRIKETHROUGH' }, { label: 'Monospace', style: 'CODE' }, { label: 'Underline', style: 'UNDERLINE' }];

export var BLOCK_TYPE_DROPDOWN = [{ label: 'Normal', style: 'unstyled' }, { label: 'Heading Large', style: 'header-one' }, { label: 'Heading Medium', style: 'header-two' }, { label: 'Heading Small', style: 'header-three' }, { label: 'Code Block', style: 'code-block' }];
export var BLOCK_TYPE_BUTTONS = [{ label: 'UL', style: 'unordered-list-item' }, { label: 'OL', style: 'ordered-list-item' }, { label: 'Blockquote', style: 'blockquote' }];

var EditorToolbarConfig = {
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'IMAGE_BUTTON', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
  INLINE_STYLE_BUTTONS: INLINE_STYLE_BUTTONS,
  BLOCK_TYPE_DROPDOWN: BLOCK_TYPE_DROPDOWN,
  BLOCK_TYPE_BUTTONS: BLOCK_TYPE_BUTTONS
};

export default EditorToolbarConfig;
import _JSON$stringify from 'babel-runtime/core-js/json/stringify';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import { ContentState, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToMarkdown } from 'draft-js-export-markdown';
import { stateFromMarkdown } from 'draft-js-import-markdown';

var EditorValue = function () {
  function EditorValue(editorState) {
    var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, EditorValue);

    this._cache = cache;
    this._editorState = editorState;
  }

  _createClass(EditorValue, [{
    key: 'getEditorState',
    value: function getEditorState() {
      return this._editorState;
    }
  }, {
    key: 'setEditorState',
    value: function setEditorState(editorState) {
      return this._editorState === editorState ? this : new EditorValue(editorState);
    }
  }, {
    key: 'toString',
    value: function toString(format, options) {
      var fromCache = this._cache[format];
      if (fromCache != null) {
        return fromCache;
      }
      return this._cache[format] = _toString(this.getEditorState(), format, options);
    }
  }, {
    key: 'setContentFromString',
    value: function setContentFromString(markup, format, options) {
      var editorState = EditorState.push(this._editorState, fromString(markup, format, options), 'secondary-paste');
      return new EditorValue(editorState, _defineProperty({}, format, markup));
    }
  }], [{
    key: 'createEmpty',
    value: function createEmpty(decorator) {
      var editorState = EditorState.createEmpty(decorator);
      return new EditorValue(editorState);
    }
  }, {
    key: 'createFromState',
    value: function createFromState(editorState) {
      return new EditorValue(editorState);
    }
  }, {
    key: 'createFromString',
    value: function createFromString(markup, format, decorator, options) {
      var contentState = fromString(markup, format, options);
      var editorState = EditorState.createWithContent(contentState, decorator);
      return new EditorValue(editorState, _defineProperty({}, format, markup));
    }
  }]);

  return EditorValue;
}();

export default EditorValue;


function _toString(editorState, format, options) {
  var contentState = editorState.getCurrentContent();
  switch (format) {
    case 'html':
      {
        return stateToHTML(contentState, options);
      }
    case 'markdown':
      {
        return stateToMarkdown(contentState);
      }
    case 'raw':
      {
        return _JSON$stringify(convertToRaw(contentState));
      }
    default:
      {
        throw new Error('Format not supported: ' + format);
      }
  }
}

function fromString(markup, format, options) {
  switch (format) {
    case 'html':
      {
        return stateFromHTML(markup, options);
      }
    case 'markdown':
      {
        return stateFromMarkdown(markup, options);
      }
    case 'raw':
      {
        return convertFromRaw(JSON.parse(markup));
      }
    default:
      {
        throw new Error('Format not supported: ' + format);
      }
  }
}
import ImageSpan from '../ui/ImageSpan';
import { ENTITY_TYPE } from 'draft-js-utils';

function findImageEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    if (entityKey != null) {
      var entity = contentState ? contentState.getEntity(entityKey) : null;
      return entity != null && entity.getType() === ENTITY_TYPE.IMAGE;
    }
    return false;
  }, callback);
}

export default {
  strategy: findImageEntities,
  component: ImageSpan
};
import React from 'react';
import { ENTITY_TYPE } from 'draft-js-utils';

function Link(props) {
  var _props$contentState$g = props.contentState.getEntity(props.entityKey).getData(),
      url = _props$contentState$g.url;

  return React.createElement(
    'a',
    { href: url },
    props.children
  );
}

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    if (entityKey != null) {
      var entity = contentState ? contentState.getEntity(entityKey) : null;
      return entity != null && entity.getType() === ENTITY_TYPE.LINK;
    }
    return false;
  }, callback);
}

export default {
  strategy: findLinkEntities,
  component: Link
};
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import IconButton from '../ui/IconButton';
import autobind from 'class-autobind';

var StyleButton = function (_Component) {
  _inherits(StyleButton, _Component);

  function StyleButton() {
    _classCallCheck(this, StyleButton);

    var _this = _possibleConstructorReturn(this, (StyleButton.__proto__ || _Object$getPrototypeOf(StyleButton)).apply(this, arguments));

    autobind(_this);
    return _this;
  }

  _createClass(StyleButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          style = _props.style,
          onToggle = _props.onToggle,
          otherProps = _objectWithoutProperties(_props, ['style', 'onToggle']); // eslint-disable-line no-unused-vars


      var iconName = style.toLowerCase();
      // `focusOnClick` will prevent the editor from losing focus when a control
      // button is clicked.
      return React.createElement(IconButton, _extends({}, otherProps, {
        iconName: iconName,
        onClick: this._onClick,
        focusOnClick: false
      }));
    }
  }, {
    key: '_onClick',
    value: function _onClick() {
      console.log('this.props.style: ', this.props.style);
      this.props.onToggle(this.props.style);
    }
  }]);

  return StyleButton;
}(Component);

export default StyleButton;
var _global = global,
    describe = _global.describe,
    it = _global.it;


import composite from '../composite';
import expect from 'expect';

describe('composite', function () {
  it('should return the composite of two functions', function () {
    var addOne = function addOne(x) {
      return x + 1;
    };
    var addTwo = function addTwo(x) {
      return x + 2;
    };
    expect(composite(addOne, addTwo)(5)).toBe(7);
    expect(composite(addOne, undefined)(5)).toBe(6);
  });
});
import { EditorState } from 'draft-js';

export default function changeBlockDepth(editorState, blockKey, newDepth) {
  var content = editorState.getCurrentContent();
  var block = content.getBlockForKey(blockKey);
  var depth = block.getDepth();
  if (depth === newDepth) {
    return editorState;
  }
  var newBlock = block.set('depth', newDepth);
  var newContent = content.merge({
    blockMap: content.getBlockMap().set(blockKey, newBlock)
  });
  return EditorState.push(editorState, newContent, 'adjust-depth');
}
import { EditorState } from 'draft-js';

export default function changeBlockType(editorState, blockKey, newType) {
  var content = editorState.getCurrentContent();
  var block = content.getBlockForKey(blockKey);
  var type = block.getType();
  if (type === newType) {
    return editorState;
  }
  var newBlock = block.set('type', newType);
  var newContent = content.merge({
    blockMap: content.getBlockMap().set(blockKey, newBlock)
  });
  return EditorState.push(editorState, newContent, 'change-block-type');
}
import { CharacterMetadata, EditorState } from 'draft-js';

export default function clearEntityForRange(editorState, blockKey, startOffset, endOffset) {
  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap();
  var block = blockMap.get(blockKey);
  var charList = block.getCharacterList();
  var newCharList = charList.map(function (char, i) {
    if (i >= startOffset && i < endOffset) {
      return CharacterMetadata.applyEntity(char, null);
    } else {
      return char;
    }
  });
  var newBlock = block.set('characterList', newCharList);
  var newBlockMap = blockMap.set(blockKey, newBlock);
  var newContentState = contentState.set('blockMap', newBlockMap);
  return EditorState.push(editorState, newContentState, 'apply-entity');
}
function composite(defaultFunc, customFunc) {
  return function (input) {
    if (customFunc) {
      var result = customFunc(input);
      if (result != null) {
        return result;
      }
    }
    return defaultFunc(input);
  };
}

export default composite;
import { EditorState } from 'draft-js';
import { OrderedMap } from 'immutable';

export default function getBlocksInSelection(editorState) {
  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap();
  var selection = editorState.getSelection();
  if (selection.isCollapsed()) {
    return new OrderedMap();
  }

  var startKey = selection.getStartKey();
  var endKey = selection.getEndKey();
  if (startKey === endKey) {
    return new OrderedMap({ startKey: contentState.getBlockForKey(startKey) });
  }
  var blocksUntilEnd = blockMap.takeUntil(function (block, key) {
    return key === endKey;
  });
  return blocksUntilEnd.skipUntil(function (block, key) {
    return key === startKey;
  });
}
function getEntityAtOffset(block, offset) {
  var entityKey = block.getEntityAt(offset);
  if (entityKey == null) {
    return null;
  }
  var startOffset = offset;
  while (startOffset > 0 && block.getEntityAt(startOffset - 1) === entityKey) {
    startOffset -= 1;
  }
  var endOffset = startOffset;
  var blockLength = block.getLength();
  while (endOffset < blockLength && block.getEntityAt(endOffset + 1) === entityKey) {
    endOffset += 1;
  }
  return {
    entityKey: entityKey,
    blockKey: block.getKey(),
    startOffset: startOffset,
    endOffset: endOffset + 1
  };
}

export default function getEntityAtCursor(editorState) {
  var selection = editorState.getSelection();

  var startKey = selection.getStartKey();

  var startBlock = editorState.getCurrentContent().getBlockForKey(startKey);

  var startOffset = selection.getStartOffset();

  if (selection.isCollapsed()) {
    // Get the entity before the cursor (unless the cursor is at the start).
    return getEntityAtOffset(startBlock, startOffset === 0 ? startOffset : startOffset - 1);
  }
  if (startKey !== selection.getEndKey()) {
    return null;
  }
  var endOffset = selection.getEndOffset();

  var startEntityKey = startBlock.getEntityAt(startOffset);

  for (var i = startOffset; i < endOffset; i++) {
    var entityKey = startBlock.getEntityAt(i);
    if (entityKey == null || entityKey !== startEntityKey) {
      return null;
    }
  }
  return {
    entityKey: startEntityKey,
    blockKey: startBlock.getKey(),
    startOffset: startOffset,
    endOffset: endOffset
  };
}
import { ContentBlock, EditorState, genKey } from 'draft-js';

export default function insertBlockAfter(editorState, blockKey, newType) {
  var content = editorState.getCurrentContent();
  var blockMap = content.getBlockMap();
  var block = blockMap.get(blockKey);
  var blocksBefore = blockMap.toSeq().takeUntil(function (v) {
    return v === block;
  });
  var blocksAfter = blockMap.toSeq().skipUntil(function (v) {
    return v === block;
  }).rest();
  var newBlockKey = genKey();
  var newBlock = new ContentBlock({
    key: newBlockKey,
    type: newType,
    text: '',
    characterList: block.getCharacterList().slice(0, 0),
    depth: 0
  });
  var newBlockMap = blocksBefore.concat([[blockKey, block], [newBlockKey, newBlock]], blocksAfter).toOrderedMap();
  var selection = editorState.getSelection();
  var newContent = content.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: selection.merge({
      anchorKey: newBlockKey,
      anchorOffset: 0,
      focusKey: newBlockKey,
      focusOffset: 0,
      isBackward: false
    })
  });
  return EditorState.push(editorState, newContent, 'split-block');
}
import { BLOCK_TYPE } from 'draft-js-utils';

export default function isListItem(block) {
  var blockType = block.getType();
  return blockType === BLOCK_TYPE.UNORDERED_LIST_ITEM || blockType === BLOCK_TYPE.ORDERED_LIST_ITEM;
}
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import cx from 'classnames';
import autobind from 'class-autobind';

import styles from './Button.css';

var Button = function (_Component) {
  _inherits(Button, _Component);

  function Button() {
    _classCallCheck(this, Button);

    var _this = _possibleConstructorReturn(this, (Button.__proto__ || _Object$getPrototypeOf(Button)).apply(this, arguments));

    autobind(_this);
    return _this;
  }

  _createClass(Button, [{
    key: 'render',
    value: function render() {
      var props = this.props;

      var className = props.className,
          isDisabled = props.isDisabled,
          focusOnClick = props.focusOnClick,
          formSubmit = props.formSubmit,
          otherProps = _objectWithoutProperties(props, ['className', 'isDisabled', 'focusOnClick', 'formSubmit']);

      className = cx(className, styles.root);
      var onMouseDown = focusOnClick === false ? this._onMouseDownPreventDefault : props.onMouseDown;
      var type = formSubmit ? 'submit' : 'button';
      return React.createElement(
        'button',
        _extends({
          type: type
        }, otherProps, {
          onMouseDown: onMouseDown,
          className: className,
          disabled: isDisabled
        }),
        props.children
      );
    }
  }, {
    key: '_onMouseDownPreventDefault',
    value: function _onMouseDownPreventDefault(event) {
      event.preventDefault();
      var onMouseDown = this.props.onMouseDown;

      if (onMouseDown != null) {
        onMouseDown(event);
      }
    }
  }]);

  return Button;
}(Component);

export default Button;
import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import cx from 'classnames';

import styles from './ButtonGroup.css';

export default function ButtonGroup(props) {
  var className = cx(props.className, styles.root);
  return React.createElement('div', _extends({}, props, { className: className }));
}
import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import cx from 'classnames';

import styles from './ButtonWrap.css';

export default function ButtonWrap(props) {
  var className = cx(props.className, styles.root);
  return React.createElement('div', _extends({}, props, { className: className }));
}
import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import _Array$from from 'babel-runtime/core-js/array/from';
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import autobind from 'class-autobind';
import cx from 'classnames';

import styles from './Dropdown.css';

var Dropdown = function (_Component) {
  _inherits(Dropdown, _Component);

  function Dropdown() {
    _classCallCheck(this, Dropdown);

    var _this = _possibleConstructorReturn(this, (Dropdown.__proto__ || _Object$getPrototypeOf(Dropdown)).apply(this, arguments));

    autobind(_this);
    return _this;
  }

  _createClass(Dropdown, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          choices = _props.choices,
          selectedKey = _props.selectedKey,
          className = _props.className,
          otherProps = _objectWithoutProperties(_props, ['choices', 'selectedKey', 'className']);

      className = cx(className, styles.root);
      var selectedItem = selectedKey == null ? null : choices.get(selectedKey);
      var selectedValue = selectedItem && selectedItem.label || '';
      return React.createElement(
        'span',
        { className: className, title: selectedValue },
        React.createElement(
          'select',
          _extends({}, otherProps, { value: selectedKey, onChange: this._onChange }),
          this._renderChoices()
        ),
        React.createElement(
          'span',
          { className: styles.value },
          selectedValue
        )
      );
    }
  }, {
    key: '_onChange',
    value: function _onChange(event) {
      var value = event.target.value;
      this.props.onChange(value);
    }
  }, {
    key: '_renderChoices',
    value: function _renderChoices() {
      var choices = this.props.choices;

      var entries = _Array$from(choices.entries());
      return entries.map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            _ref2$ = _ref2[1],
            label = _ref2$.label,
            className = _ref2$.className;

        return React.createElement(
          'option',
          { key: key, value: key, className: className },
          label
        );
      });
    }
  }]);

  return Dropdown;
}(Component);

export default Dropdown;
import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import cx from 'classnames';
import Button from './Button';
import ButtonWrap from './ButtonWrap';

import styles from './IconButton.css';

var IconButton = function (_Component) {
  _inherits(IconButton, _Component);

  function IconButton() {
    _classCallCheck(this, IconButton);

    return _possibleConstructorReturn(this, (IconButton.__proto__ || _Object$getPrototypeOf(IconButton)).apply(this, arguments));
  }

  _createClass(IconButton, [{
    key: 'render',
    value: function render() {
      var _cx;

      var props = this.props;

      var className = props.className,
          iconName = props.iconName,
          label = props.label,
          children = props.children,
          isActive = props.isActive,
          otherProps = _objectWithoutProperties(props, ['className', 'iconName', 'label', 'children', 'isActive']);

      className = cx(className, (_cx = {}, _defineProperty(_cx, styles.root, true), _defineProperty(_cx, styles.isActive, isActive), _cx));
      return React.createElement(
        ButtonWrap,
        null,
        React.createElement(
          Button,
          _extends({}, otherProps, { title: label, className: className }),
          React.createElement('span', { className: styles['icon-' + iconName] })
        ),
        children
      );
    }
  }]);

  return IconButton;
}(Component);

export default IconButton;
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import autobind from 'class-autobind';
import cx from 'classnames';
import React, { Component } from 'react';
import { Entity } from 'draft-js';

import styles from './ImageSpan.css';

var ImageSpan = function (_Component) {
  _inherits(ImageSpan, _Component);

  function ImageSpan(props) {
    _classCallCheck(this, ImageSpan);

    var _this = _possibleConstructorReturn(this, (ImageSpan.__proto__ || _Object$getPrototypeOf(ImageSpan)).call(this, props));

    autobind(_this);
    var entity = props.contentState.getEntity(props.entityKey);

    var _entity$getData = entity.getData(),
        width = _entity$getData.width,
        height = _entity$getData.height;

    _this.state = {
      width: width,
      height: height
    };
    return _this;
  }

  _createClass(ImageSpan, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _state = this.state,
          width = _state.width,
          height = _state.height;

      var entity = this.props.contentState.getEntity(this.props.entityKey);
      var image = new Image();

      var _entity$getData2 = entity.getData(),
          src = _entity$getData2.src;

      image.src = src;
      image.onload = function () {
        if (width == null || height == null) {
          // TODO: isMounted?
          _this2.setState({ width: image.width, height: image.height });
          Entity.mergeData(_this2.props.entityKey, {
            width: image.width,
            height: image.height,
            originalWidth: image.width,
            originalHeight: image.height
          });
        }
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _state2 = this.state,
          width = _state2.width,
          height = _state2.height;
      var className = this.props.className;

      var entity = this.props.contentState.getEntity(this.props.entityKey);

      var _entity$getData3 = entity.getData(),
          src = _entity$getData3.src;

      className = cx(className, styles.root);
      var imageStyle = {
        verticalAlign: 'bottom',
        backgroundImage: 'url("' + src + '")',
        backgroundSize: width + 'px ' + height + 'px',
        lineHeight: height + 'px',
        fontSize: height + 'px',
        width: width,
        height: height,
        letterSpacing: width
      };

      return React.createElement(
        'span',
        { className: className, style: imageStyle, onClick: this._onClick },
        this.props.children
      );
    }
  }, {
    key: '_onClick',
    value: function _onClick() {
      console.log('image clicked');
    }
  }, {
    key: '_handleResize',
    value: function _handleResize(event, data) {
      var _data$size = data.size,
          width = _data$size.width,
          height = _data$size.height;

      this.setState({ width: width, height: height });
      Entity.mergeData(this.props.entityKey, { width: width, height: height });
    }
  }]);

  return ImageSpan;
}(Component);

export default ImageSpan;
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import IconButton from './IconButton';
import ButtonGroup from './ButtonGroup';
import autobind from 'class-autobind';
import cx from 'classnames';

import styles from './InputPopover.css';
import { Button } from '../RichTextEditor';

var InputPopover = function (_Component) {
  _inherits(InputPopover, _Component);

  function InputPopover(props) {
    _classCallCheck(this, InputPopover);

    var _this = _possibleConstructorReturn(this, (InputPopover.__proto__ || _Object$getPrototypeOf(InputPopover)).call(this, props));

    autobind(_this);
    _this.state = {
      value: _this.props.defaultValue || ''
    };
    return _this;
  }

  _createClass(InputPopover, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('click', this._onDocumentClick);
      document.addEventListener('keydown', this._onDocumentKeydown);
      if (this._inputRef) {
        this._inputRef.focus();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('click', this._onDocumentClick);
      document.removeEventListener('keydown', this._onDocumentKeydown);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = this.props;

      var className = cx(props.className, styles.root);
      return React.createElement(
        'div',
        { className: className },
        React.createElement(
          'div',
          { className: styles.inner },
          React.createElement('input', {
            defaultValue: props.defaultValue,
            value: this.state.value,
            type: 'text',
            placeholder: 'https://example.com/',
            className: styles.input,
            onKeyPress: this._onInputKeyPress,
            onChange: function onChange(e) {
              _this2.setState({ value: e.target.value });
            }
          }),
          React.createElement(
            Button,
            {
              style: { marginLeft: '4px', marginRight: '0' },
              onClick: function onClick() {
                _this2.setState({ value: 'articleUrl' });
                _this2._onSubmit('articleUrl');
              }
            },
            'Article Url'
          ),
          React.createElement(
            ButtonGroup,
            { className: styles.buttonGroup },
            React.createElement(IconButton, {
              label: 'Cancel',
              iconName: 'cancel',
              onClick: props.onCancel
            }),
            React.createElement(IconButton, {
              label: 'Submit',
              iconName: 'accept',
              onClick: function onClick() {
                _this2._onSubmit(_this2.state.value);
              }
            })
          )
        )
      );
    }
  }, {
    key: '_onInputKeyPress',
    value: function _onInputKeyPress(event) {
      if (event.which === 13) {
        // Avoid submitting a <form> somewhere up the element tree.
        event.preventDefault();
        this._onSubmit();
      }
    }
  }, {
    key: '_onSubmit',
    value: function _onSubmit(value) {
      // let value = this._inputRef ? this._inputRef.value : '';
      this.props.onSubmit(value);
    }
  }, {
    key: '_onDocumentClick',
    value: function _onDocumentClick(event) {
      var rootNode = ReactDOM.findDOMNode(this);
      if (!rootNode.contains(event.target)) {
        // Here we pass the event so the parent can manage focus.
        this.props.onCancel(event);
      }
    }
  }, {
    key: '_onDocumentKeydown',
    value: function _onDocumentKeydown(event) {
      if (event.keyCode === 27) {
        this.props.onCancel();
      }
    }
  }]);

  return InputPopover;
}(Component);

export default InputPopover;
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import IconButton from './IconButton';
import InputPopover from './InputPopover';
import autobind from 'class-autobind';

var PopoverIconButton = function (_Component) {
  _inherits(PopoverIconButton, _Component);

  function PopoverIconButton() {
    _classCallCheck(this, PopoverIconButton);

    var _this = _possibleConstructorReturn(this, (PopoverIconButton.__proto__ || _Object$getPrototypeOf(PopoverIconButton)).apply(this, arguments));

    autobind(_this);
    return _this;
  }

  _createClass(PopoverIconButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          onTogglePopover = _props.onTogglePopover,
          showPopover = _props.showPopover,
          props = _objectWithoutProperties(_props, ['onTogglePopover', 'showPopover']); // eslint-disable-line no-unused-vars


      return React.createElement(
        IconButton,
        _extends({}, props, { onClick: onTogglePopover }),
        this._renderPopover()
      );
    }
  }, {
    key: '_renderPopover',
    value: function _renderPopover() {
      if (!this.props.showPopover) {
        return null;
      }
      return React.createElement(InputPopover, {
        defaultValue: this.props.defaultValue,
        onSubmit: this._onSubmit,
        onCancel: this._resetState
      });
    }
  }, {
    key: '_onSubmit',
    value: function _onSubmit() {
      var _props2;

      (_props2 = this.props).onSubmit.apply(_props2, arguments);
    }
  }, {
    key: '_resetState',
    value: function _resetState(ev) {
      if (ev.target.className.includes('icon-cancel')) {
        this._onSubmit('');
      }
      this._hidePopover();
    }
  }, {
    key: '_hidePopover',
    value: function _hidePopover() {
      if (this.props.showPopover) {
        var _props3;

        (_props3 = this.props).onTogglePopover.apply(_props3, arguments);
      }
    }
  }]);

  return PopoverIconButton;
}(Component);

export default PopoverIconButton;
