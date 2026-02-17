import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta, dataportfolio } from "../../content_option";
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
            <p className="home_eyebrow">
              <span className="status_dot" aria-hidden="true"></span>
              <span className="status_text">
                <span className="status_old">Learning</span>{" "}
                <span className="status_new">Building</span>stuff in UMich
              </span>
            </p>
            <h1 className="home_title">
              AI-driven Product Manager who speaks engineering
            </h1>
            <p className="home_subtitle">
              I turn ambiguity into shipped products and business lift
            </p>

            <div className="hero_proof">
              <p className="hero_proof_item">$2M+ monthly revenue impact through shipped product systems</p>
              <p className="hero_proof_item">Led product execution across automotive, fintech, and classifieds</p>
              <p className="hero_proof_item">Admitted to University of Michigan MSI for user-centered product development</p>
            </div>

            <div className="home_cta">
              <Link to="/resume" className="text_2">
                <div className="ac_btn btn btn_outline_light">
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
                <div className="ac_btn btn btn_outline_light">
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
