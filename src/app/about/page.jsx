"use client";
import React, { useEffect, useRef } from "react";
import "./about.css";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Dynamically import SplitType with SSR disabled
const SplitType = dynamic(() => import("../lib/SplitType/index"), { ssr: false });

import { cvItems } from "./cvItems";

const AboutPage = () => {
  const container = useRef();
  const aboutCopyRef = useRef(null);
  const cvWrapperRef = useRef(null);
  const cvHeaderRef = useRef(null);
  const cvListRef = useRef(null);
  const heroImgRef = useRef(null);

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
    if (typeof window === "undefined") return;
    gsap.registerPlugin(CustomEase, ScrollTrigger);
    CustomEase.create(
      "hop2",
      "M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1"
    );

    const applySplitType = async (element) => {
      if (!element) return;
      const splitTexts = element.querySelectorAll("h1, h2, h3");
      if (!splitTexts.length) return;

      // Ensure SplitType is loaded
      const SplitTypeModule = await import("../lib/SplitType/index");
      const SplitType = SplitTypeModule.default;

      splitTexts.forEach((text) => {
        const split = new SplitType(text, {
          types: "lines",
          tagName: "span",
        });

        // Check if split.lines exists and is iterable
        if (split.lines && Array.isArray(split.lines)) {
          split.lines.forEach((line) => {
            const wrapper = document.createElement("div");
            wrapper.className = "line-wrapper";
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
          });
        }
      });
    };

    // Apply SplitType to refs
    Promise.all([
      applySplitType(aboutCopyRef.current),
      applySplitType(cvHeaderRef.current),
      applySplitType(cvListRef.current),
    ]).then(() => {
      if (aboutCopyRef.current) {
        gsap.to(aboutCopyRef.current.querySelectorAll(".line-wrapper span"), {
          y: 0,
          stagger: 0.05,
          delay: 1.5,
          duration: 1.5,
          ease: "power4.out",
        });
      }

      if (cvWrapperRef.current) {
        const cvHeaderSpans =
          cvHeaderRef.current?.querySelectorAll(".line-wrapper span") || [];
        const cvListSpans =
          cvListRef.current?.querySelectorAll(".line-wrapper span") || [];

        gsap.set([cvHeaderSpans, cvListSpans], { y: "100%" });

        ScrollTrigger.create({
          trigger: cvWrapperRef.current,
          start: "top 50%",
          onEnter: () => {
            gsap.to(cvHeaderSpans, {
              y: 0,
              stagger: 0.05,
              duration: 1.5,
              ease: "power4.out",
            });
            gsap.to(cvListSpans, {
              y: 0,
              stagger: 0.02,
              duration: 1.5,
              ease: "power4.out",
            });
          },
        });
      }
    });

    if (heroImgRef.current) {
      ScrollTrigger.create({
        trigger: heroImgRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const scale = 1 + self.progress * 0.5;
          gsap.to(heroImgRef.current.querySelector("img"), {
            scale: scale,
            ease: "none",
            duration: 0.1,
          });
        },
      });
    }

    return () => {
      if (typeof window === "undefined") return;
      ScrollTrigger.getAll().forEach((t) => t.kill());
      [aboutCopyRef, cvHeaderRef, cvListRef].forEach((ref) => {
        if (ref.current) {
          const splitTexts = ref.current.querySelectorAll("h1, h2, h3");
          splitTexts.forEach((text) => {
            if (text.splitType && text.splitType.revert) {
              text.splitType.revert();
            }
            text.querySelectorAll(".line-wrapper").forEach((wrapper) => {
              wrapper.replaceWith(...wrapper.childNodes);
            });
          });
        }
      });
    };
  }, []);

  useGSAP(
    () => {
      gsap.to(".about-portrait", {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        delay: 0.8,
        duration: 1,
        ease: "hop",
      });

      gsap.to(".about-copy-wrapper .about-copy-title h1", {
        y: 0,
        delay: 1,
        duration: 1.5,
        ease: "power4.out",
      });
    },
    { scope: container }
  );

  return (
    <div className="about-page" ref={container}>
      <div className="container">
        <div className="about-intro">
          <div className="col about-portrait-img">
            <div className="about-portrait">
              <img src="/about/portrait-min.jpg" alt="Portrait" />
            </div>
          </div>
          <div className="col about-copy-wrapper">
            <div className="about-copy-title">
              <h1>Bio</h1>
            </div>

            <div className="about-copy" ref={aboutCopyRef}>
              <h3>
                Passionate about crafting immersive digital experiences,
                Stefan Markovic blends design and code to push the boundaries
                of whats possible on the web. His approach focuses on
                creating seamless, responsive, and engaging interfaces that
                leave a lasting impact.
              </h3>
              <br />
              <h3>
                With a strong foundation in JavaScript, React, and modern web
                technologies, Stefan excels at turning complex ideas into
                interactive realities. Whether its a sleek portfolio site, a
                dynamic web app, or a mesmerizing animation, he approaches
                each project with creativity and technical precision.
              </h3>
              <br />
              <h3>
                Driven by curiosity and innovation, Stefan constantly explores
                new tools, techniques, and frameworks. Hes not just a
                developer—hes a problem solver, ready to bring your vision to
                life with a unique and modern touch.
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="about-hero-img" ref={heroImgRef}>
        <img src="/about/portrait-2-min.jpg" alt="Portrait" />
      </div>

      <div className="container">
        <div className="cv-wrapper" ref={cvWrapperRef}>
          <div className="cv-header" ref={cvHeaderRef}>
            <h2>CV</h2>
          </div>

          <div className="cv-list" ref={cvListRef}>
            {cvItems.map((item, index) => (
              <div className="cv-item" key={index}>
                <div className="cv-name">
                  <h3>{item.name}</h3>
                </div>
                <div className="cv-year">
                  <h3>{item.year}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;