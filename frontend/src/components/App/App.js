import createComponent from 'component';
import Header from '../Header';
import Content from '../Content';
import Footer from '../Footer';
import './base.css';
import styles from './App.css';

const App = createComponent({
  initialize() {
    this.render();
    this.afterRender();
  },

  render() {
    this.el.innerHTML = `
      <div class="${styles.app}">
        <header class="app__header">
        </header>

        <section class="${styles.app__content}">
        </section>

        <footer class="app__footer">
        </footer>
      </div>
    `;
  },

  afterRender() {
    this.header = new Header({
      el: '.app__header',
    });

    this.content = new Content({
      el: `.${styles.app__content}`,
    });

    this.footer = new Footer({
      el: '.app__footer',
    });
  },
});

export default App;
