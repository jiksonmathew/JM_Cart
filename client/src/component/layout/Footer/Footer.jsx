import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerLeft">
        <h4>Download Our App</h4>
        <p>Download App for Android and iOS mobile phones</p>

        <div className="footerStores">
          <img src={playStore} alt="Play Store" />
          <img src={appStore} alt="App Store" />
        </div>
      </div>

      <div className="footerMiddle">
        <h1>JM-CART</h1>
        <p>High Quality is our first priority</p>
        <p className="footerCopyright">© 2026 JM-Cart. All rights reserved.</p>
      </div>

      <div className="footerRight">
        <h4>Follow Us</h4>

        <a href="https://instagram.com/gxnmtw" target="_blank" rel="noreferrer">
          Instagram
        </a>

        <a href="https://youtube.com/" target="_blank" rel="noreferrer">
          YouTube
        </a>

        <a href="https://facebook.com/gxnmtw" target="_blank" rel="noreferrer">
          Facebook
        </a>
      </div>
    </footer>
  );
};

export default Footer;
