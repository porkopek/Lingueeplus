// browser.storage.local.set({
//   importantUrls: ['com']
// });

//promise to get stored urls
const importantUrlsPromise = browser.storage.local
  .get('importantUrls')
  .then(result => result['importantUrls']);

//render the stored urls
const renderUrls = urls => {
  console.log('urls to reder ', urls);
  const urlsHTML =
    urls === undefined || urls.length === 0
      ? ''
      : urls
          .map(
            (url, index) => `
        <div 
          id ="url-${index}" 
          class="important-url" 
          data-url=${url}>
            ${url}
            <button id="btn-${index}"class="delete-url">
              x
            </button>            
        </div>`
          )
          .reduce((a, b) => a + b);

  // append HTML
  var urlsSection = document.querySelector('#urlsSection');
  urlsSection.innerHTML = urlsHTML;

  //add event listener to delete url buttons
  const deleteButtons = [...document.querySelectorAll('.delete-url')];
  deleteButtons.map(deleteButton => {
    deleteButton.addEventListener('click', removeUrl);
  });
};

//remove url function
const removeUrl = event => {
  const urlId = 'url-' + event.target.id.split('-')[1];
  const urlToRemove = document.querySelector(`#${urlId}`).dataset.url;

  browser.storage.local
    .get('importantUrls')
    .then(result => result['importantUrls'])
    .then(urls => urls.filter(url => url !== urlToRemove))
    .then(urls => {
      console.log('novo array urls após delete ', urls);
      browser.storage.local.set({
        importantUrls: urls
      });
      return urls;
    })
    .then(renderUrls);
};

// add url function
const addUrl = () => {
  const url = document.querySelector('#urlInput').value;
  console.log('url to add ', url);
  browser.storage.local
    .get('importantUrls')
    .then(result => result['importantUrls'])
    .then(urls => {
      console.log('array sem url added', urls);
      var newUrls = urls === undefined ? [url] : [...urls, url];
      console.log('array com url added ', newUrls);
      return newUrls;
    })
    .then(urls2 => {
      browser.storage.local.set({
        importantUrls: urls2
      });
      return urls2;
    })
    .then(renderUrls);
};

//add url button
var addUrlButton = document.querySelector('#addUrlButton');
addUrlButton.addEventListener('click', addUrl);

//execute the promise
importantUrlsPromise.then(renderUrls);
