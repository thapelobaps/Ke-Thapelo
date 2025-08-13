"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import "./project.css";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Dynamically import SplitType with SSR disabled
const SplitType = dynamic(() => import("../../lib/SplitType/index"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const Page = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const dateRef = useRef(null);
  const firstImgRef = useRef(null);
  const imgRefs = useRef([]);
  const copyH3Refs = useRef([]);
  const nextProjectRef = useRef(null);
  const nextProjectTitleRef = useRef(null);

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

  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      const tl = gsap.timeline();

      tl.fromTo(
        titleRef.current,
        { y: 100 },
        { y: 0, duration: 1.5, ease: "power4.out" }
      );

      tl.fromTo(
        dateRef.current,
        { y: 100 },
        { y: 0, duration: 1.5, ease: "power4.out" },
        "-=1.4"
      );

      tl.fromTo(
        firstImgRef.current,
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
          duration: 1.5,
          ease: "power4.out",
        },
        "-=1"
      );

      imgRefs.current.forEach((img) => {
        if (img) {
          gsap.fromTo(
            img,
            { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
            {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
              duration: 1.5,
              ease: "power4.out",
              scrollTrigger: {
                trigger: img,
                start: "top 50%",
              },
            }
          );
        }
      });

      copyH3Refs.current.forEach(async (h3) => {
        if (!h3) return;
        // Ensure SplitType is loaded
        const SplitTypeModule = await import("../../lib/SplitType/index");
        const SplitType = SplitTypeModule.default;

        const split = new SplitType(h3, { types: "lines" });

        // Check if split.lines exists and is iterable
        if (split.lines && Array.isArray(split.lines)) {
          split.lines.forEach((line) => {
            const wrapper = document.createElement("div");
            wrapper.className = "line";
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
          });

          gsap.from(h3.querySelectorAll(".line"), {
            y: 36,
            duration: 1,
            stagger: 0.02,
            ease: "power4.out",
            scrollTrigger: {
              trigger: h3,
              start: "top 80%",
            },
          });
        }
      });

      return () => {
        if (typeof window === "undefined") return;
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        copyH3Refs.current.forEach((h3) => {
          if (h3 && h3.splitType && h3.splitType.revert) {
            h3.splitType.revert();
          }
          if (h3) {
            h3.querySelectorAll(".line").forEach((wrapper) => {
              wrapper.replaceWith(...wrapper.childNodes);
            });
          }
        });
      };
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <div className="project-page" ref={containerRef}>
      <div className="container">
        <div className="project-page-title">
          <h1 ref={titleRef}>My Portfolio</h1>
        </div>
        <div className="project-date">
          <p ref={dateRef}>2019 - 2025</p>
        </div>

        <div className="project-content">
          <div className="img img-1" ref={firstImgRef}>
            <img src="/portfolio/project-1.png" alt="Dentist System" />
          </div>

          <div className="copy">
            <h3 ref={(el) => (copyH3Refs.current[0] = el)}>
              Dental System: A comprehensive dental booking and management system designed to streamline operations for dental practices, built with C#, and CSS. It features a .NET Core API for robust backend logic and a React client for a dynamic, responsive user interface, with shared models ensuring data consistency. The system supports patient registration, appointment scheduling, and dentist management, enabling dental offices to manage user accounts, book appointments, and maintain dentist profiles efficiently. It leverages a SQL Server database to store user credentials, patient details, appointment schedules, and dentist information, using Entity Framework Core for seamless data interactions. The database schema includes tables for Users, Patients, Appointments, and Dentists, with foreign keys ensuring referential integrity and indexes for fast query performance.
            </h3>
          </div>

          <div className="img img-2" ref={(el) => (imgRefs.current[0] = el)}>
            <img src="/portfolio/project-2.png" alt="Mini Blog" />
          </div>

          <div className="img img-3" ref={(el) => (imgRefs.current[1] = el)}>
            <img src="/portfolio/project-5.jpg" alt="Banking System Ixbank" />
          </div>

          <div className="copy">
            <h3 ref={(el) => (copyH3Refs.current[1] = el)}>
              Mini-Blog: A lightweight blogging platform built with JavaScript, HTML, and CSS. It features dynamic post rendering and user authentication, with a responsive design for seamless content sharing across devices. The platform uses local storage for lightweight data management, ensuring efficient post and user data retrieval without a complex database backend.
            </h3>
          </div>

          <div className="img img-4" ref={(el) => (imgRefs.current[2] = el)}>
            <img src="/portfolio/project-12.jpg" alt="Banking System Ixbank" />
          </div>

          <div className="copy">
            <h3 ref={(el) => (copyH3Refs.current[2] = el)}>
              Banking System [Ixbank]: A modern banking application developed with Next.js 14, TypeScript, React, Tailwind CSS, and Plaid for secure bank account integration. It supports secure transaction processing, real-time account management, and multi-currency transactions, with a sleek, user-friendly interface. The application leverages a relational database to store user accounts, transaction histories, and financial analytics, with optimized indexing for fast query performance. The additional description highlights advanced analytics for financial insights and scalability for multi-currency support.
            </h3>
          </div>

          <div className="img img-5" ref={(el) => (imgRefs.current[3] = el)}>
            <img src="/portfolio/project-13.jpg" alt="Lawn Mowing Service" />
          </div>

          <div className="copy">
            <h3 ref={(el) => (copyH3Refs.current[3] = el)}>
              Lawn Mowing Service: A C# application with HTML, CSS, and JavaScript for managing lawn mowing businesses. It includes appointment scheduling, customer data tracking, and invoice generation. A local SQLite database stores customer details and appointment schedules, enabling efficient querying and data management for small-scale operations.
            </h3>
          </div>

          <div className="img img-6" ref={(el) => (imgRefs.current[4] = el)}>
            <img src="/portfolio/project-14.jpg" alt="Employee Management System" />
          </div>

          <div className="copy">
            <h3 ref={(el) => (copyH3Refs.current[4] = el)}>
              Employee Management System: A C# demo application built with SQL Server, .NET, Angular, Entity Framework, HTML, and CSS. It enables robust employee record management, role assignment, performance tracking, and data visualization. The SQL Server database, integrated via Entity Framework, supports complex queries for employee data, performance metrics, and organizational hierarchies, ensuring scalability and security. Use Case: Ideal for HR departments or developers showcasing enterprise-level systems with advanced database management.
            </h3>
          </div>

          <div className="img img-7" ref={(el) => (imgRefs.current[5] = el)}>
            <img src="/portfolio/project-7.png" alt="Superhero API" />
          </div>

          <div className="copy">
            <h3 ref={(el) => (copyH3Refs.current[5] = el)}>
              Superhero API: A C# API for accessing superhero data, including character stats, powers, and biographies. It uses an in-memory database for fast data retrieval during development, with potential integration with a relational database like SQL Server for production, ensuring efficient and structured data access for client applications.
            </h3>
          </div>

          <div className="img img-8" ref={(el) => (imgRefs.current[6] = el)}>
            <img src="/portfolio/project-13.jpg" alt="Customer Management System" />
          </div>

          <div className="copy">
            <h3 ref={(el) => (copyH3Refs.current[6] = el)}>
              Customer Management System: A C# application with HTML, CSS, and JavaScript for managing customer relationships. It features interaction tracking, contact storage, and report generation, backed by a SQL Server database for robust data management and efficient querying for business insights.
            </h3>
          </div>

          <div className="next-project" ref={nextProjectRef}>
            <p>Explore More</p>
          </div>
          <div className="next-project-title" ref={nextProjectTitleRef}>
            <Link href="https://github.com/Thapelobaps">
              <h2>View All Repositories</h2>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;