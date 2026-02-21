import React, { useState } from "react";
import "./style.css";
import { VscGrabber, VscClose } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { logotext, socialprofils } from "../content_option";
import Themetoggle from "../components/themetoggle";
import brandImage from "../assets/images/me_final.png";

const Headermain = () => {
  const [isActive, setActive] = useState("false");

  const handleToggle = () => {
    setActive(!isActive);
    document.body.classList.toggle("ovhidden");
  };

  return (
    <>
      <header className="fixed-top site__header">
        <div className="d-flex align-items-center justify-content-between">
          <Link to="/" className="navbar-brand nav_ac" aria-label={`${logotext} home`}>
            <span className="brand_identity">
              <img src={brandImage} alt={logotext} className="brand_avatar" />
              <span className="brand_text_wrap">
                <span className="brand_text">{logotext}</span>
              </span>
            </span>
          </Link>

          <nav className="header_quick_links" aria-label="Quick links">
            <Link to="/resume" className="header_quick_link">
              Resume
            </Link>
            <Link to="/portfolio" className="header_quick_link">
              Portfolio
            </Link>
            <Link to="/about" className="header_quick_link">
              About
            </Link>
            <Link to="/contact" className="header_quick_link">
              Contact
            </Link>
          </nav>

          <div className="d-flex align-items-center header_controls">
            <Themetoggle />
            <button className="menu__button nav_ac" onClick={handleToggle}>
              {!isActive ? <VscClose /> : <VscGrabber />}
            </button>
          </div>
        </div>

        <div className={`site__navigation ${!isActive ? "menu__opend" : ""}`}>
          <div className="bg__menu h-100">
            <div className="menu__wrapper">
              <div className="menu__container p-3">
                <ul className="the_menu">
                  <li className="menu_item ">
                    <Link onClick={handleToggle} to="/" className="my-3">
                      Home
                    </Link>
                  </li>
                  <li className="menu_item">
                    <Link onClick={handleToggle} to="/about" className="my-3">
                      About
                    </Link>
                  </li>
                  <li className="menu_item">
                    <Link onClick={handleToggle} to="/resume" className="my-3">
                      Resume
                    </Link>
                  </li>
                  <li className="menu_item">
                    <Link onClick={handleToggle} to="/portfolio" className="my-3">
                      Portfolio
                    </Link>
                  </li>
                  <li className="menu_item">
                    <Link onClick={handleToggle} to="/contact" className="my-3">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="menu_footer d-flex flex-column flex-md-row justify-content-between align-items-md-center position-absolute w-100 p-3">
            <div className="d-flex">
              <a href={socialprofils.facebook}>Facebook</a>
              <a href={socialprofils.twitter}>Twitter</a>
              <a href={socialprofils.instagram}>Instagram</a>
              <a href={socialprofils.linkedin}>LinkedIn</a>
            </div>
            <p className="copyright m-0">© {new Date().getFullYear()} {logotext}</p>
          </div>
        </div>
      </header>
      <div className="br-top"></div>
      <div className="br-bottom"></div>
      <div className="br-left"></div>
      <div className="br-right"></div>
    </>
  );
};

export default Headermain;
