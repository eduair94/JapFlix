const showSpinner = () => {
  document.getElementById("spinner-wrapper").style.display = "block";
};

const hideSpinner = () => {
  document.getElementById("spinner-wrapper").style.display = "none";
};

const getJSONData = (url) => {
  const result = {};
  showSpinner();
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((response) => {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch((error) => {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};
