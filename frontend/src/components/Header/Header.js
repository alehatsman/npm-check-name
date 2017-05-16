import createComponent from 'component';
import styles from './Header.css';

const Header = createComponent({
  initialize() {
    this.render();
  },

  render() {
    this.el.innerHTML = `
      <header class="${styles.header}">
        <div class="${styles.header__inner} ${styles.container}">
          <div class="${styles.header__logo}">
            <div class="${styles['header__logo-img']}">
              <img src="https://avatars0.githubusercontent.com/u/11519224?v=3&s=200" alt"logo"/>
            </div>
            <h3 class="${styles['header__logo-text']}">
              npm check name
            </h3>
          </div>
          <div class="${styles.header__links}">
            <a class="${styles.header__link}" 
               href="https://github.com/Atsman/npm-check-name">Github</a>
            <a class="${styles.header__link}" href="#">Twitter</a>
          </div>
        </div>
      </header>
    `;
  },
});

export default Header;
