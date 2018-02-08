const urlSelector = '.source_url';
const sortResults = importantUrls => {
  var parent = document.querySelector('tbody.examples');
  var sortedListOfNodes = [...document.querySelectorAll('[id*="row"]')].sort(
    el => {
      const elementUrl = el.querySelector(urlSelector).innerText;

      if (
        importantUrls.some(importantUrl => elementUrl.includes(importantUrl))
      ) {
        return -1;
      }

      return 1;
    }
  );

  parent.innerHTML = sortedListOfNodes
    .map(el => el.outerHTML)
    .reduce((a, b) => a + ' ' + b);

  [...document.querySelectorAll(urlSelector)].map(
    element =>
      importantUrls.some(importantUrl =>
        element.innerText.includes(importantUrl)
      )
        ? element.parentElement.classList.add('important-result')
        : element.parentElement.classList.remove('important-result')
  );
};

browser.storage.local
  .get('importantUrls')
  .then(result => result['importantUrls'])
  .then(sortResults);

browser.storage.onChanged.addListener(changes =>
  sortResults(changes.importantUrls.newValue)
);
