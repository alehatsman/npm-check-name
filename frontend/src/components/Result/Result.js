import createComponent from 'component';
import core from '../../core';
import styles from './Result.css';

const Result = createComponent({
  initialize() {
    this.state = {
      isAvailable: false,
      packageName: '',
    };

    core.store.subscribe(() => {
      const state = core.store.getState();
      const newState = {
        isAvailable: state.isAvailable,
        packageName: state.packageName,
      };
      if (this.shouldComponentUpdate(newState)) {
        this.state = newState;
        this.render();
      }
    });

    this.render();
  },

  shouldComponentUpdate(newState) {
    return this.state.packageName !== newState.packageName
      || this.state.isAvailable !== newState.isAvailable;
  },

  render() {
    this.el.innerHTML = `
      ${this.state.packageName ? `
        <div class="result">
          ${this.state.isAvailable ?
            `<h2 class="${styles.result__congrats}">
              Yay! <span class="${styles['result__congrats-name']}">${this.state.packageName}</span> name is free
             </h2>
             <p class="${styles.result__description}">Check <a href="https://docs.npmjs.com/">npm docs</a> to getting started</p>
            ` : `<h2 class="${styles.result__reserved}">Ops, this name is reserved.</h2> `}
        </div>` : ''}
    `;
  },
});

export default Result;
