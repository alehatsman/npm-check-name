import App from './components/App';

export default function init() {
  const app = new App({
    el: document.body,
  });

  console.log(app); // eslint-disable-line
}

if (NODE_ENV !== 'testing') { // eslint-disable-line
  init();
}
