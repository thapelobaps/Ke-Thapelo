"use client";
import React, { useEffect, useRef } from "react";
import "./contact.css";
import { gsap } from "gsap";
import Lenis from "lenis";

const Page = () => {
  const container = useRef();
  const headerRef = useRef();
  const sectionsRef = useRef([]);

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
    const ctx = gsap.context(() => {
      gsap.to(headerRef.current, {
        y: 0,
        duration: 1,
        delay: 1,
        ease: "power3.out",
      });

      gsap.delayedCall(1.1, () => {
        sectionsRef.current.forEach((section) => {
          gsap.to(section.querySelectorAll("p"), {
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
          });
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div className="contact-page" ref={container}>
      <div className="container">
        <div className="col">

        <div className="where" ref={(el) => (sectionsRef.current[0] = el)}>
            <div className="title">
              <p>Where</p>
            </div>
            <div className="item">
              <p>Thapelo Bapela</p>
            </div>
            <div className="item">
              <p>123 Innovation Street, Pretoria East</p>
            </div>
            <div className="item">
              <p>0081 · Pretoria · South Africa</p>
            </div>
          </div>
          <div className="vat" ref={(el) => (sectionsRef.current[1] = el)}>
            <div className="title">
              <p>VAT</p>
            </div>
            <div className="item">
              <p>1234567890</p> {/* Replace with your actual VAT number if available */}
            </div>
          </div>

        </div>

        <div className="col">
          <div className="contact-header">
            <h1 ref={headerRef}>Contact</h1>
          </div>
          <div
            className="socials"
            ref={(el) => (sectionsRef.current[2] = el)}
          >
            <div className="title">
              <p>Socials</p>
            </div>
            <div className="item">
              <p>
                <a href="https://www.instagram.com/thapelobaps" target="_blank">Instagram</a>
              </p>
            </div>
            <div className="item">
              <p>
                <a href="https://www.linkedin.com/in/thapelo-bapela-859a5471/" target="_blank">LinkedIn</a>
              </p>
            </div>
            <div className="item">
              <p>
                <a href="https://www.github.com/thapelobaps" target="_blank">GitHub</a> {/* Update with your GitHub or Vimeo */}
              </p>
            </div>
          </div>
          <div className="mail" ref={(el) => (sectionsRef.current[3] = el)}>
            <div className="title">
              <p>Mail</p>
            </div>
            <div className="item">
              <p>
                <a href="mailto:thapelobaps@gmail.com">Thapelobaps@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;