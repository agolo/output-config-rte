import React, { Component } from 'react';
import EditorDemo from './EditorDemo';

export default class EditorDemoExample extends Component {
  render() {
    return (
      <EditorDemo
        sampleStory={this.props.sampleStory}
        availableFields={this.props.availableFields}
        replaceFieldsWithSampleData={this.props.replaceFieldsWithSampleData}
        htmlTemplate={this.props.htmlTemplate}
        sampleStoryUrl={this.props.sampleStoryUrl}
      />
    );
  }
}
