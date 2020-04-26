export const sampleStory = {
  feedName: 'Google',
  feedStartDate: 'March 14, 2020',
  feedendDate: 'March 16, 2020',
  storyTitle: 'Legislative Tracker Sounds Alarm on Anti-Transparency Bills',
  storyDate: 'March 15, 2020',
  summaryBullets: [
    "To open government advocates, the effort to hide Louisville's bid was an outrage that soon got worse: A House committee approved the bill with an amendment barring residents outside Kentucky from obtaining public records on any subject.",
    "Advocates like her in all 50 states are getting a new tool to help identify legislation like the Amazon bill that affect the public’s right to know — and give a glimpse of what's happening across the country.",
    'The National Freedom of Information Coalition is launching a bill tracker that aims to find, in real-time, all pieces of legislation that affect government transparency in state legislatures.',
    'Daniel Bevarly, the coalition’s executive director, said tracking such bills is challenging because only a few states, such as Florida and Maine, require such legislation to state up-front that they would affect government transparency.',
    'The program uses software from Quorum, a Washington D. C.-based technology company, that scrapes the raw text of bills from all 50 state legislative websites once or more a day.',
  ],
  articles: [
    {
      articleTitle:
        'Legislative Tracker Sounds Alarm on Anti-Transparency Bills',
      articleUrl:
        'https://www.ksat.com/news/politics/2020/03/10/legislative-tracker-sounds-alarm-on-anti-transparency-bills/',
      articleDate: 'March 15, 2020',
      articleSource: 'KSAT',
    },
    {
      articleTitle: 'Reuters Legislative Tracker',
      articleUrl:
        'https://www.reuters.com/news/politics/2020/03/10/legislative-tracker-sounds-alarm-on-anti-transparency-bills/',
      articleDate: 'March 16, 2020',
      articleSource: 'Reuters',
    },
    {
      articleTitle: 'AP Legislative Tracker',
      articleUrl:
        'https://www.ap.com/news/politics/2020/03/10/legislative-tracker-sounds-alarm-on-anti-transparency-bills/',
      articleDate: 'March 18, 2020',
      articleSource: 'AP',
    },
  ],
};

export const availableFields = [
  'feedName',
  'feedStartDate',
  'feedEndDate',
  'storyTitle',
  'storyDate',
  'summaryBullets',
  'articleTitle',
  'articleUrl',
  'articleDate',
  'articleSource',
  'articlesCount',
  'sourcesSection'
];

const replaceSourceFieldsWithArticleData = (sourcesTemplate, article) => {
  let output = sourcesTemplate;
  output = output.replace(/\b(articleUrl)\b/g, article.articleUrl);
  output = output.replace(/\b(articleTitle)\b/g, article.articleTitle);
  output = output.replace(/\b(articleDate)\b/g, article.articleDate);
  output = output.replace(/\b(articleSource)\b/g, article.articleSource);
  output = output.replace(/\b(sourcesCount)\b/g, '1');
  // console.log('output: ', output);

  return output;
};

export const replaceFieldsWithSampleData = (htmlTemplate = '', sampleStory) => {
  let output = htmlTemplate.replace(/(\s{2,}|\n|\t)/g, ' ');
  const possibleSourcesTitles = ['Sources', 'Sources (articlesCount article)'];
  let sourcesTemplate = '';
  const containUlListForSummaryBullets = output.match(
    /\<ul\> \<li\>summaryBullets\<\/li\> <\/ul\>/
  );
  const containOlListForSummaryBullets = output.match(
    /\<ol\> \<li\>summaryBullets\<\/li\> <\/ol\>/
  );
  possibleSourcesTitles.map(title => {
    if (htmlTemplate.indexOf(title) > 0) {
      // eslint-disable-next-line prefer-destructuring
      sourcesTemplate = htmlTemplate
        .replace(/(\s{2,}|\n|\t)/g, ' ')
        .split(title)[1];
    }
    return title;
  });
  if (sourcesTemplate) {
    sampleStory.articles.map(article => {
      const articleOutput = replaceSourceFieldsWithArticleData(
        sourcesTemplate,
        article
      );
      output += articleOutput;
      return article;
    });
    output = output.replace(sourcesTemplate, '');
    console.log('output.match(sourcesTemplate)', output.match(sourcesTemplate));
  }
  output = output
    .replace(/\bfeedName\b/g, sampleStory.feedName)
    .replace(/\bfeedStartDate\b/g, sampleStory.feedStartDate)
    .replace(/\bfeedEndDate\b/g, sampleStory.feedendDate)
    .replace(/\bstoryTitle\b/g, sampleStory.storyTitle)
    .replace(/\bstoryDate\b/g, sampleStory.storyDate)
    .replace(/\bsummaryBullet1\b/g, sampleStory.summaryBullets[0])
    .replace(/\bsummaryBullet2\b/g, sampleStory.summaryBullets[1])
    .replace(/\bsummaryBullet3\b/g, sampleStory.summaryBullets[2])
    .replace(/\bsummaryBullet4\b/g, sampleStory.summaryBullets[3])
    .replace(/\bsummaryBullet5\b/g, sampleStory.summaryBullets[4]);
  if (containUlListForSummaryBullets) {
    output = output.replace(
      /\<ul\> \<li\>summaryBullets\<\/li\> <\/ul\>/,
      `<ul>${sampleStory.summaryBullets
        .map(bullet => `<li>${bullet}</li>`)
        .join('\n')}</ul>`
    );
  } else if (containOlListForSummaryBullets) {
    output = output.replace(
      /\<ol\> \<li\>summaryBullets\<\/li\> <\/ol\>/,
      `<ol>${sampleStory.summaryBullets
        .map(bullet => `<li>${bullet}</li>`)
        .join('\n')}</ol>`
    );
  } else {
    output = output.replace(
      /\bsummaryBullets\b/,
      `<ul>${sampleStory.summaryBullets
        .map(bullet => `<li>${bullet}</li>`)
        .join('\n')}</ul>`
    );
  }
  output = output.replace(
    /(<a href=)/g,
    "<a ref='noopener noreferer' target='_blank' href="
  );

  output = output.replace(
    /\b(articlesCount article)\b/g,
    sampleStory.articles.length > 0
      ? `${sampleStory.articles.length} articles`
      : `${sampleStory.articles.length} article`
  );
  // console.log('output: ', output);
  return output;
};

export const htmlTemplate = `
  <p>Feed: feedName</p>
  <p><br></p>
  <p>feedStartDate - feedEndDate</p>
  <p><br></p>
  <p>storyTitle</p>
  <p>storyDate</p>
  <p><br></p>
  <p>Summary:</p>
  <ul>
    <li>summaryBullet1</li>
    <li>summaryBullet2</li>
    <li>summaryBullet3</li>
    <li>summaryBullet4</li>
    <li>summaryBullet5</li>
  </ul>
  <p><br></p>
  <p>Sources (articlesCount article)</p>
  <p><strong><a ref="noopener noreferer" target="_blank" href="articleUrl">articleTitle</a></strong></p>
  <p>articleDate</p>
  <p><a ref="noopener noreferer" target="_blank" href="articleUrl">articleUrl</a></p>
  <p>articleDate | [sourcesCount] articleSource</p>
`;

export const sampleStoryUrl =
  'https://app.acuity.agolo.com/feed/5e6dfdfb48ea10000191e397/summary/5e6dfe146b08de149041cea9?collapseSider=false';
