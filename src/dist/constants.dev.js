"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sampleStoryUrl = exports.htmlTemplate = exports.replaceFieldsWithSampleData = exports.availableFields = exports.sampleStory = void 0;
var sampleStory = {
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
    articleTitle: 'Reuters Legislative Tracker',
    articleUrl: 'https://www.reuters.com/news/politics/2020/03/10/legislative-tracker-sounds-alarm-on-anti-transparency-bills/',
    articleDate: 'March 16, 2020',
    articleSource: 'Reuters'
  }, {
    articleTitle: 'AP Legislative Tracker',
    articleUrl: 'https://www.ap.com/news/politics/2020/03/10/legislative-tracker-sounds-alarm-on-anti-transparency-bills/',
    articleDate: 'March 18, 2020',
    articleSource: 'AP'
  }]
};
exports.sampleStory = sampleStory;
var availableFields = ['feedName', 'feedStartDate', 'feedEndDate', 'storyTitle', 'storyDate', 'summaryBullets', 'articleTitle', 'articleUrl', 'articleDate', 'articleSource', 'articlesCount', 'sourcesSection'];
exports.availableFields = availableFields;

var replaceSourceFieldsWithArticleData = function replaceSourceFieldsWithArticleData(sourcesTemplate, article) {
  var output = sourcesTemplate;
  output = output.replace(/\b(articleUrl)\b/g, article.articleUrl);
  output = output.replace(/\b(articleTitle)\b/g, article.articleTitle);
  output = output.replace(/\b(articleDate)\b/g, article.articleDate);
  output = output.replace(/\b(articleSource)\b/g, article.articleSource);
  output = output.replace(/\b(sourcesCount)\b/g, '1'); // console.log('output: ', output);

  return output;
};

var replaceFieldsWithSampleData = function replaceFieldsWithSampleData() {
  var htmlTemplate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var sampleStory = arguments.length > 1 ? arguments[1] : undefined;
  var output = htmlTemplate.replace(/(\s{2,}|\n|\t)/g, ' ');
  var possibleSourcesTitles = ['Sources', 'Sources (articlesCount article)'];
  var sourcesTemplate = '';
  var containUlListForSummaryBullets = output.match(/\<ul\> \<li\>summaryBullets\<\/li\> <\/ul\>/);
  var containOlListForSummaryBullets = output.match(/\<ol\> \<li\>summaryBullets\<\/li\> <\/ol\>/);
  possibleSourcesTitles.map(function (title) {
    if (htmlTemplate.indexOf(title) > 0) {
      // eslint-disable-next-line prefer-destructuring
      sourcesTemplate = htmlTemplate.replace(/(\s{2,}|\n|\t)/g, ' ').split(title)[1];
    }

    return title;
  });

  if (sourcesTemplate) {
    sampleStory.articles.map(function (article) {
      var articleOutput = replaceSourceFieldsWithArticleData(sourcesTemplate, article);
      output += articleOutput;
      return article;
    });
    output = output.replace(sourcesTemplate, '');
    console.log('output.match(sourcesTemplate)', output.match(sourcesTemplate));
  }

  output = output.replace(/\bfeedName\b/g, sampleStory.feedName).replace(/\bfeedStartDate\b/g, sampleStory.feedStartDate).replace(/\bfeedEndDate\b/g, sampleStory.feedendDate).replace(/\bstoryTitle\b/g, sampleStory.storyTitle).replace(/\bstoryDate\b/g, sampleStory.storyDate).replace(/\bsummaryBullet1\b/g, sampleStory.summaryBullets[0]).replace(/\bsummaryBullet2\b/g, sampleStory.summaryBullets[1]).replace(/\bsummaryBullet3\b/g, sampleStory.summaryBullets[2]).replace(/\bsummaryBullet4\b/g, sampleStory.summaryBullets[3]).replace(/\bsummaryBullet5\b/g, sampleStory.summaryBullets[4]);

  if (containUlListForSummaryBullets) {
    output = output.replace(/\<ul\> \<li\>summaryBullets\<\/li\> <\/ul\>/, "<ul>".concat(sampleStory.summaryBullets.map(function (bullet) {
      return "<li>".concat(bullet, "</li>");
    }).join('\n'), "</ul>"));
  } else if (containOlListForSummaryBullets) {
    output = output.replace(/\<ol\> \<li\>summaryBullets\<\/li\> <\/ol\>/, "<ol>".concat(sampleStory.summaryBullets.map(function (bullet) {
      return "<li>".concat(bullet, "</li>");
    }).join('\n'), "</ol>"));
  } else {
    output = output.replace(/\bsummaryBullets\b/, "<ul>".concat(sampleStory.summaryBullets.map(function (bullet) {
      return "<li>".concat(bullet, "</li>");
    }).join('\n'), "</ul>"));
  }

  output = output.replace(/(<a href=)/g, "<a ref='noopener noreferer' target='_blank' href=");
  output = output.replace(/\b(articlesCount article)\b/g, sampleStory.articles.length > 0 ? "".concat(sampleStory.articles.length, " articles") : "".concat(sampleStory.articles.length, " article")); // console.log('output: ', output);

  return output;
};

exports.replaceFieldsWithSampleData = replaceFieldsWithSampleData;
var htmlTemplate = "\n  <p>Feed: feedName</p>\n  <p><br></p>\n  <p>feedStartDate - feedEndDate</p>\n  <p><br></p>\n  <p>storyTitle</p>\n  <p>storyDate</p>\n  <p><br></p>\n  <p>Summary:</p>\n  <ul>\n    <li>summaryBullet1</li>\n    <li>summaryBullet2</li>\n    <li>summaryBullet3</li>\n    <li>summaryBullet4</li>\n    <li>summaryBullet5</li>\n  </ul>\n  <p><br></p>\n  <p>Sources (articlesCount article)</p>\n  <p><strong><a ref=\"noopener noreferer\" target=\"_blank\" href=\"articleUrl\">articleTitle</a></strong></p>\n  <p>articleDate</p>\n  <p><a ref=\"noopener noreferer\" target=\"_blank\" href=\"articleUrl\">articleUrl</a></p>\n  <p>articleDate | [sourcesCount] articleSource</p>\n";
exports.htmlTemplate = htmlTemplate;
var sampleStoryUrl = 'https://app.acuity.agolo.com/feed/5e6dfdfb48ea10000191e397/summary/5e6dfe146b08de149041cea9?collapseSider=false';
exports.sampleStoryUrl = sampleStoryUrl;