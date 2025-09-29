import './Header.css';
import logo from '../../assets/servifresco-logo.png';

function Header() {
  return (
    <header className="header">
      <img src={logo} alt="servifresco-logo" />
    </header>
  );
}

export default Header;