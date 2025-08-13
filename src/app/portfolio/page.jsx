"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "./portfolio.css";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

const Page = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const containerRef = useRef(null);

  const projects = [
    { name: "Dental Booking System", img: "project-1.png", size: "lg" },
    { name: "Smart Living", img: "project-2.jpg", size: "sm" },
    { name: "Stuff Management System", img: "project-14.jpg", size: "lg" },
    { name: "VR Fitness", img: "project-4.jpg", size: "sm" },
    { name: "Mini Blog", img: "project-5.jpg", size: "lg" },
    { name: "Financial Systems", img: "project-13.jpg", size: "lg" },
    { name: "SuperHero API", img: "project-7.png", size: "lg" },
    { name: "Drone Post", img: "project-8.jpg", size: "lg" },
    { name: "Employee Management System", img: "project-6.jpg", size: "sm" },
  ];

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    if (typeof window === "undefined") return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = projects.map((project) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = `/portfolio/${project.img}`;
          img.onload = () => resolve();
          img.onerror = () => {
            console.error(`Failed to load image: /portfolio/${project.img}`);
            reject(new Error(`Failed to load image: /portfolio/${project.img}`));
          };
        });
      });

      try {
        await Promise.all(imagePromises);
        setIsLoaded(true);
      } catch (error) {
        setLoadError(error.message);
        console.error("Image loading error:", error);
      }
    };

    loadImages();
  }, []); // Empty dependency array since projects is static

  useGSAP(
    () => {
      if (!isLoaded || !containerRef.current) return;

      const header = containerRef.current.querySelector(".portfolio-header h1");
      const cols = containerRef.current.querySelectorAll(".col");

      if (header) {
        gsap.to(header, {
          y: 0,
          delay: 0.75,
          duration: 1.5,
          ease: "power4.out",
        });
      }

      if (cols.length) {
        gsap.to(cols, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
          duration: 1.5,
          delay: 0.9,
          ease: "power4.out",
          stagger: 0.1,
        });

        cols.forEach((col) => {
          const img = col.querySelector("img");
          const titleP = col.querySelector(".project-title h3");

          if (img && titleP) {
            col.addEventListener("mouseenter", () => {
              gsap.to(img, {
                scale: 1.25,
                duration: 2,
                ease: "power4.out",
              });
              gsap.to(titleP, {
                y: 0,
                duration: 1,
                ease: "power4.out",
              });
            });

            col.addEventListener("mouseleave", () => {
              gsap.to(img, {
                scale: 1,
                duration: 2,
                ease: "power4.out",
              });
              gsap.to(titleP, {
                y: 24,
                duration: 1,
                ease: "power4.out",
              });
            });
          }
        });
      }
    },
    { scope: containerRef, dependencies: [isLoaded] }
  );

  const renderProjectRows = () => {
    const rows = [];
    for (let i = 0; i < projects.length; i += 3) {
      rows.push(
        <div className="portfolio-row" key={i}>
          {projects.slice(i, i + 3).map((project, index) => (
            <div className={`col ${project.size}`} key={i + index}>
              <Link href="/portfolio/project">
                <img src={`/portfolio/${project.img}`} alt={project.name} />
                <div className="project-title">
                  <h3>{project.name}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      );
    }
    return rows;
  };

  return (
    <div
      className={`portfolio-page ${isLoaded ? "loaded" : ""}`}
      ref={containerRef}
    >
      <div className="container">
        <div className="portfolio-header">
          <h1>Portfolio</h1>
        </div>
        {loadError && (
          <div className="error-message">
            <p>Error loading images: {loadError}</p>
          </div>
        )}
        {isLoaded && renderProjectRows()}
      </div>
    </div>
  );
};

export default Page;