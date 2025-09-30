import styles from './Header.module.css';
import logo from '../../assets/servifresco-logo.png';

function Header() {
  return (
    <header className={styles.header}>
      <img src={logo} alt="servifresco-logo" />
    </header>
  );
}

export default Header;