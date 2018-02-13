setTimeout(() => {
  document.querySelector('body').focus();
}, 100);

//promise to get stored urls
const importantUrlsPromise = browser.storage.local
  .get('importantUrls')
  .then(result => result['importantUrls']);

//render the stored urls
const renderUrls = urls => {
  console.log('urls array ', urls);
  const urlsHTML =
    urls === undefined || urls.length === 0
      ? ''
      : urls
          .map((url, index) => {
            console.log('url ', url);
            return `
        <label 
          id ="url-${index}" 
          class="important-url" 
          data-url="${url}">
           <span class="url-text"> ${url}</span>
            <button id="btn-${index}"class="badge badge-danger delete-url">
              ×
            </button>            
        </label>`;
          })
          .reduce((a, b) => a + b);

  // append HTML
  var urlsSection = document.querySelector('#urlsSection');
  urlsSection.innerHTML = urlsHTML;

  //remove buttons
  const deleteButtons = [...document.querySelectorAll('.delete-url')];
  deleteButtons.map(deleteButton => {
    deleteButton.addEventListener('click', removeUrl);
  });
};

//remove url function
const removeUrl = event => {
  const urlId = 'url-' + event.target.id.split('-')[1];
  const urlToRemove = document.querySelector(`#${urlId}`).dataset.url;
  console.log('url to remove ', urlToRemove);
  browser.storage.local
    .get('importantUrls')
    .then(result => result['importantUrls'])
    .then(urls => urls.filter(url => url !== urlToRemove))
    .then(urls => {
      browser.storage.local.set({
        importantUrls: urls
      });
      return urls;
    })
    .then(renderUrls);
};

// add url function
const addUrl = () => {
  const urlInput = document.querySelector('#urlInput');
  let url = urlInput.value;
  url = url.replace(/[<>]/g, '');
  url = url.trim();
  urlInput.value = '';
  if (url === '') return;
  browser.storage.local
    .get('importantUrls')
    .then(result => result['importantUrls'])
    .then(urls => {
      var newUrls = urls === undefined ? [url] : [...urls, url];

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
