import createComponent from 'component';
import Loader from '../Loader';
import actions from '../../actions';
import styles from './Search.css';

const Search = createComponent({
  events: {
    [`change .${styles.search__input}`]: 'onChange',
    [`submit .${styles.search__form}`]: 'onSubmit',
  },

  initialize() {
    this.state = {
      query: '',
    };
    this.render();
    this.afterRender();
  },

  onChange(e) {
    this.state.query = e.target.value;
  },

  onSubmit(e) {
    e.preventDefault();
    if (this.state.query) {
      actions.searchAction(this.state.query.toLowerCase());
    }
  },

  render() {
    this.el.innerHTML = `
      <div class="${styles.search}">
        <form class="${styles.search__form}">
          <div class="${styles.search__field}">
            <input class="${styles.search__input}" value="${this.state.query}"/>
            <button class="${styles.search__btn}">check</button>
          </div>
        </form>
        <div class="search__loader"></div>
      </div>
    `;
  },

  afterRender() {
    this.loader = new Loader({
      el: '.search__loader',
    });
  },
});

export default Search;
