import createComponent from 'component';
import core from '../../core';
import styles from './Loader.css';

const Loader = createComponent({
  initialize() {
    this.state = {
      loading: false,
    };

    core.store.subscribe(() => {
      const state = core.store.getState();
      if (this.shouldComponentUpdate(state)) {
        this.state.loading = state.loading;
        this.render();
      }
    });
  },

  shouldComponentUpdate(newState) {
    return this.state.loading !== newState.loading;
  },

  render() {
    this.el.innerHTML = this.state.loading ? `
      <div class="${styles.loader}">
        <span class="${styles.loader__circle}"></span>
        <span class="${styles.loader__circle}"></span>
        <span class="${styles.loader__circle}"></span>
      </div>`
      : '';
  },
});

export default Loader;
