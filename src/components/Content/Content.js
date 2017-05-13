import createComponent from 'component';
import Search from '../Search';
import Result from '../Result';
import styles from './Content.css';

const Content = createComponent({
  initialize() {
    this.render();
    this.afterRender();
  },

  render() {
    this.el.innerHTML = `
      <div class="${styles.content} ${styles.container}">
        <div class="${styles.title}">
          <h1 class="${styles.title__slogan}">
            <span class="${styles.title__domain}">
              NPM-CHECK-NAME 
            </span>
            check if npm name available in npm-registry.
          </h1>
        </div>
        <div class="content__search"></div> 
        <div class="content__result"></div>
      </div>
    `;
  },

  afterRender() {
    this.search = new Search({
      el: '.content__search',
    });

    this.result = new Result({
      el: '.content__result',
    });
  },
});

export default Content;
