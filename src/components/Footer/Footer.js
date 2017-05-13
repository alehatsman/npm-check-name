import createComponent from 'component';
import styles from './Footer.css';

const Footer = createComponent({
  initialize() {
    this.render();
  },

  render() {
    this.el.innerHTML = `
      <footer class="${styles.footer}">
        <div class="${styles.footer__inner} ${styles.container}">
          <p class="${styles.footer__text}">
            <span>coded with &#9829; by </span>
            <a href="#">@Atsman</a> & <a href="#">@ok2ju</a>
          </p>
        </div>
      </footer>
    `;
  },
});

export default Footer;

