export default function ajax(config) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.Done) {
        resolve(xhr.responseText);
      }
    };
    xhr.open(config.method, config.url);
    xhr.send();
  });
}
