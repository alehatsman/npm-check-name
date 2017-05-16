export default function ajax(config) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        resolve(JSON.parse(xhr.responseText));
      }
    };
    xhr.open(config.method, config.url);
    xhr.send();
  });
}
