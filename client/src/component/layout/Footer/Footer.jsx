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
        <h1>ECOMMERCE</h1>

        <p>High Quality is our first priority</p>

        <p className="footerCopyright">
          © 2024 Ecommerce. All rights reserved.
        </p>
      </div>

      <div className="footerRight">
        <h4>Follow Us</h4>

        <a
          href="https://instagram.com/meabhisingh"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>

        <a
          href="https://youtube.com/6packprogramemr"
          target="_blank"
          rel="noreferrer"
        >
          Youtube
        </a>

        <a href="https://facebook.com" target="_blank" rel="noreferrer">
          Facebook
        </a>
      </div>
    </footer>
  );
};

export default Footer;
