import AppContainer from "../Contaner/container";
import styles from "./header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <AppContainer width={1300}>
        <div className={styles.content}>
          <h2>LOGO</h2>
          <ul>
            <li>Home</li>
            <li>Products</li>
            <li>Categories</li>
            <li>Invoices</li>
          </ul>
        </div>
      </AppContainer>
    </div>
  );
};

export default Header;
