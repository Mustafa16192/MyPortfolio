import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import { introdata, meta } from "../../content_option";
import { Link } from "react-router-dom";
import me2 from "../../assets/images/me2.jpg";
import me3 from "../../assets/images/me3.png";
import me6 from "../../assets/images/me6.png";
import me7 from "../../assets/images/me7.png";

export const Home = () => {
  return (
    <HelmetProvider>
      <section id="home" className="home">
        {/* decorative gradient circle (purely visual) */}
        <div className="bg-gradient-circle" aria-hidden="true" />
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <div className="intro_sec d-block d-lg-flex align-items-center ">
          <div
            className="h_bg-image photo-grid order-1 order-lg-2 h-10"
            style={{
              // 2x2 grid with a visible border (gap shows bg color)
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: "8px", // space between images — appears as border
              backgroundColor: "#000", // color of the "border" between images
              borderRadius: "50px",
              padding: "8px", // padding around the grid so the rounded corners show the border
              overflow: "hidden",
              // limit overall size; width is now controlled by CSS for responsiveness
              minHeight: "600px",
              boxSizing: "border-box",
            }}
          >
            {/* Four grid cells — swap/add images as desired */}
            <div
              className="photo-tile photo-tile-1"
              style={{
                backgroundImage: `url(${me3})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                borderRadius: "12px",
                borderTopLeftRadius: "43px",
                imageRendering: "auto",
                WebkitFilter: "none",
                height: "100%",
                width: "100%",
              }}
            />
            <div
              className="photo-tile photo-tile-2"
              style={{
                backgroundImage: `url(${me2})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                borderRadius: "12px",
                borderTopRightRadius: "43px",
                imageRendering: "auto",
                WebkitFilter: "none",
                height: "100%",
                width: "100%",
              }}
            />
            <div
              className="photo-tile photo-tile-3"
              style={{
                backgroundImage: `url(${me6})`,
                backgroundSize: "113% auto", // slight zoom
                backgroundRepeat: "no-repeat",
                backgroundPosition: "100% 80%",
                borderRadius: "12px",
                borderBottomLeftRadius: "43px",
                imageRendering: "auto",
                WebkitFilter: "none",
                height: "100%",
                width: "100%",
              }}
            />
            <div
              className="photo-tile photo-tile-4"
              style={{
                backgroundImage: `url(${me7})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                borderRadius: "12px",
                borderBottomRightRadius: "43px",
                imageRendering: "auto",
                WebkitFilter: "none",
                height: "100%",
                width: "100%",
              }}
            />
          </div>

          <div className="text order-2 order-lg-1 h-100 d-lg-flex justify-content-center">
            <div className="align-self-center ">
              <div className="intro mx-auto">
                <h2 className="mb-1x">{introdata.title}</h2>
                <h1 className="fluidz-48 mb-1x">
                  <Typewriter
                    options={{
                      strings: [
                        introdata.animated.first,
                        introdata.animated.second,
                        introdata.animated.third,
                      ],
                      autoStart: true,
                      loop: true,
                      deleteSpeed: 20, // fast delete
                      delay: 45, // fast typing
                    }}
                  />
                </h1>
                <p className="mb-1x">{introdata.description}</p>
                <div className="intro_btn-action pb-5">
                  <Link to="/resume" className="text_2">
                    <div id="button_p" className="ac_btn btn ">
                      Resume
                      <div className="ring one"></div>
                      <div className="ring two"></div>
                      <div className="ring three"></div>
                    </div>
                  </Link>
                  <Link to="/portfolio">
                    <div id="button_h" className="ac_btn btn">
                      Portfolio
                      <div className="ring one"></div>
                      <div className="ring two"></div>
                      <div className="ring three"></div>
                    </div>
                  </Link>
                  <Link to="/contact" className="text_2">
                    <div id="button_p" className="ac_btn btn ">
                      Contact
                      <div className="ring one"></div>
                      <div className="ring two"></div>
                      <div className="ring three"></div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};
