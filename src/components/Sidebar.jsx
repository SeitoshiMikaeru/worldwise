import styles from "./Sidebar.module.css";

import {Outlet} from "react-router-dom";

import Logo from "./Logo";
import AppNav from "./AppNav";
import Footer from "./Footer";

export default function Sidebar() {
    return (
      <div className={styles.sidebar}>
          <Logo />
          <AppNav />

          <Outlet />

          <Footer />
      </div>
    );
}