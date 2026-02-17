import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { introdata, meta, dataportfolio } from "../../content_option";
import { Link } from "react-router-dom";

const featuredProjects = dataportfolio.slice(0, 4);

export const Home = () => {
  return (
    <HelmetProvider>
      <section id="home" className="home">
        <div className="bg-gradient-circle" aria-hidden="true" />
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <div className="home_shell">
          <div className="home_hero">
            <p className="home_eyebrow">Product Management + UX + Technical Execution</p>
            <h1 className="home_title">
              Building user-centered products that drive measurable business growth.
            </h1>
            <p className="home_description">{introdata.description}</p>

            <div className="hero_tags">
              <span className="hero_tag">{introdata.animated.first}</span>
              <span className="hero_tag">{introdata.animated.second}</span>
              <span className="hero_tag">{introdata.animated.third}</span>
            </div>

            <div className="home_cta">
              <Link to="/resume" className="text_2">
                <div className="ac_btn btn btn_primary_fill">
                  Resume
                  <div className="ring one"></div>
                  <div className="ring two"></div>
                  <div className="ring three"></div>
                </div>
              </Link>
              <Link to="/portfolio" className="text_2">
                <div className="ac_btn btn btn_outline_light">
                  Portfolio
                  <div className="ring one"></div>
                  <div className="ring two"></div>
                  <div className="ring three"></div>
                </div>
              </Link>
              <Link to="/contact" className="text_2">
                <div className="ac_btn btn btn_primary_fill">
                  Contact
                  <div className="ring one"></div>
                  <div className="ring two"></div>
                  <div className="ring three"></div>
                </div>
              </Link>
            </div>
          </div>

          <section className="featured_projects" aria-label="Featured projects">
            <div className="featured_projects_header">
              <h2>Featured Projects</h2>
              <Link to="/portfolio" className="featured_projects_link">
                View all
              </Link>
            </div>

            <div className="featured_projects_grid">
              {featuredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/project/${project.id}`}
                  className="featured_project_card"
                  aria-label={`Open ${project.title}`}
                >
                  <div className="featured_project_media">
                    <img
                      src={require(`../../assets/images/${project.img}`)}
                      alt={project.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="featured_project_body">
                    <p className="featured_project_meta">
                      {project.role || "Product Project"}
                      {project.timeline ? ` • ${project.timeline}` : ""}
                    </p>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </HelmetProvider>
  );
};
