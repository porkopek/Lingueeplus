// browser.storage.local.set({
//   importantUrls: ['com']
// });

//promise to get stored urls
const importantUrlsPromise = browser.storage.local
  .get('importantUrls')
  .then(result => result['importantUrls']);

//render the stored urls
const renderUrls = urls => {
  if (urls === undefined || urls.length === 0) return;

  //HTML of rendered urls
  const urlsHTML = urls
    .map(
      (url, index) => `<div 
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
  console.log(document.querySelector(`#${urlId}`).dataset.url);
};

//execute the promise
importantUrlsPromise.then(renderUrls);
