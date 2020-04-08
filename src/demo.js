import React from 'react';
import ReactDOM from 'react-dom';
import EditorDemo from './EditorDemo';
import {
  sampleStory,
  availableFields,
  replaceFieldsWithSampleData,
  sampleStoryUrl,
  htmlTemplate,
} from './constants';

document.addEventListener('DOMContentLoaded', () => {
  let rootNode = document.createElement('div');
  document.body.appendChild(rootNode);
  ReactDOM.render(
    <EditorDemo
      sampleStory={sampleStory}
      availableFields={availableFields}
      htmlTemplate={htmlTemplate}
      sampleStoryUrl={sampleStoryUrl}
      replaceFieldsWithSampleData={replaceFieldsWithSampleData}
      onChangeCallback={(params) => {
        console.log(params);
      }}
    />,
    rootNode
  );
});
