import './index.css';
import App from './components/App';

(function init() {
  const app = new App({
    el: document.body,
  });

  console.log(app); // eslint-disable-line
}());
