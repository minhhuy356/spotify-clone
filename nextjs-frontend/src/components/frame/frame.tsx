import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const Frame: React.FC = () => {
  const [isFinalPhase, setIsFinalPhase] = useState(false);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const handleAnimationEnd = (e: AnimationEvent) => {
      if (e.animationName === "animateSegment") {
      }
    };

    path.addEventListener("animationend", handleAnimationEnd);
    return () => {
      path.removeEventListener("animationend", handleAnimationEnd);
    };
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 38 48"
      width="38"
      height="48"
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: "100%",
        height: "100%",
        transform: "translate3d(0px, 0px, 0px)",
        contentVisibility: "visible",
      }}
    >
      <defs>
        <clipPath id="__lottie_element_2">
          <rect width="38" height="48" x="0" y="0"></rect>
        </clipPath>
      </defs>
      <g clipPath="url(#__lottie_element_2)">
        <g
          transform="matrix(1,0,0,1,0,0)"
          opacity="1"
          style={{ display: "block" }}
        >
          <g
            opacity="1"
            transform="matrix(1,0,0,1,18.999526977539062,24.000717163085938)"
          >
            <path
              ref={pathRef}
              className={`${!isFinalPhase ? "path-segment" : "path-hidden"}`}
              strokeLinecap="round"
              strokeLinejoin="round"
              fillOpacity="0"
              stroke="rgb(167,167,167)"
              strokeOpacity="1"
              strokeWidth="2"
              d="M18,-1.63100004196167 C18,7.376999855041504 18,17.000999450683594 18,17.000999450683594 C17.999526977539062,20.312116622924805 15.310927391052246,23.000717163085938 11.999526977539062,23.000717163085938 C11.999526977539062,23.000717163085938 -11.999526977539062,23.000717163085938 -11.999526977539062,23.000717163085938 C-15.310927391052246,23.000717163085938 -17.999526977539062,20.312116622924805 -17.999526977539062,17.000717163085938 C-18,17.000999450683594 -18,11.378000259399414 -18,4.704999923706055"
            ></path>
          </g>
        </g>
        <g
          transform="matrix(1,0,0,1,0,0)"
          opacity="1"
          style={{ display: "block" }}
        >
          <g
            opacity="1"
            transform="matrix(1,0,0,1,18.999526977539062,24.001197814941406)"
          >
            <path
              ref={pathRef}
              className={`${!isFinalPhase ? "path-segment" : "path-hidden"}`}
              strokeLinecap="round"
              strokeLinejoin="round"
              fillOpacity="0"
              stroke="rgb(167,167,167)"
              strokeOpacity="1"
              strokeWidth="2"
              d="M-18,3.8420000076293945 C-18,-5.208000183105469 -18,-16 -18,-16 C-17.999526977539062,-19.86353874206543 -14.86282730102539,-23.0002384185791 -10.999526977539062,-23.0002384185791 C-10.999526977539062,-23.0002384185791 10.999526977539062,-23.0002384185791 10.999526977539062,-23.0002384185791 C14.86282730102539,-23.0002384185791 17.999526977539062,-19.86353874206543 17.999526977539062,-16.0002384185791 C17.999526977539062,-16.0002384185791 18,-16 18,-16 C18,-16 18,-8.526000022888184 18,-0.8019999861717224"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Frame;
