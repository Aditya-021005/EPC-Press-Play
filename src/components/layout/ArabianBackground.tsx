"use client";

import React from "react";

export default function ArabianBackground() {
  return (
    <div className="arabian-night-env" aria-hidden="true">
      {/* Deep purple velvet night gradient */}
      <div className="arabian-sky" />

      {/* Twinkling celestial stars */}
      <div className="arabian-stars">
        <span className="star star-1" style={{ top: "8%", left: "12%", animationDelay: "0.2s" }}>✦</span>
        <span className="star star-2" style={{ top: "15%", left: "28%", animationDelay: "1.4s" }}>✧</span>
        <span className="star star-3" style={{ top: "6%", left: "45%", animationDelay: "0.8s" }}>✦</span>
        <span className="star star-4" style={{ top: "22%", left: "62%", animationDelay: "2.1s" }}>✧</span>
        <span className="star star-5" style={{ top: "12%", left: "78%", animationDelay: "1.0s" }}>✦</span>
        <span className="star star-6" style={{ top: "25%", left: "88%", animationDelay: "0.5s" }}>✧</span>
        <span className="star star-7" style={{ top: "35%", left: "18%", animationDelay: "1.7s" }}>✧</span>
        <span className="star star-8" style={{ top: "42%", left: "34%", animationDelay: "2.5s" }}>✦</span>
        <span className="star star-9" style={{ top: "38%", left: "72%", animationDelay: "0.9s" }}>✧</span>
        <span className="star star-10" style={{ top: "18%", left: "95%", animationDelay: "1.9s" }}>✦</span>
        <span className="star star-11" style={{ top: "5%", left: "68%", animationDelay: "0.3s" }}>✧</span>
        <span className="star star-12" style={{ top: "48%", left: "82%", animationDelay: "1.2s" }}>✦</span>
        <span className="star star-13" style={{ top: "30%", left: "5%", animationDelay: "2.3s" }}>✦</span>
        <span className="star star-14" style={{ top: "52%", left: "14%", animationDelay: "1.6s" }}>✧</span>
        <span className="star star-15" style={{ top: "45%", left: "52%", animationDelay: "0.7s" }}>✧</span>
      </div>

      {/* Luminous Golden Crescent Moon with Star */}
      <div className="arabian-moon-container">
        <div className="arabian-moon-halo" />
        <svg
          className="arabian-crescent-moon"
          viewBox="0 0 100 100"
          width="90"
          height="90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="moonGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff9db" />
              <stop offset="35%" stopColor="#ffe082" />
              <stop offset="70%" stopColor="#ffc107" />
              <stop offset="100%" stopColor="#d48b06" />
            </linearGradient>
            <filter id="moonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Crescent Moon path */}
          <path
            d="M50 10 A40 40 0 1 0 90 50 A32 32 0 1 1 50 10 Z"
            fill="url(#moonGold)"
            filter="url(#moonGlow)"
          />
          {/* Subtle craters */}
          <circle cx="36" cy="42" r="3" fill="#d48b06" opacity="0.25" />
          <circle cx="44" cy="62" r="4.5" fill="#d48b06" opacity="0.2" />
          <circle cx="28" cy="54" r="2.5" fill="#d48b06" opacity="0.22" />
        </svg>

        {/* Companion golden star */}
        <div className="arabian-moon-star">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffe082">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>
      </div>

      {/* Majestic Golden Palaces Silhouette Horizon */}
      <div className="arabian-palace-skyline">
        <svg
          viewBox="0 0 1440 280"
          preserveAspectRatio="none"
          className="arabian-palace-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Palace Gold Silhouette Gradient */}
            <linearGradient id="palaceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f5af19" stopOpacity="0.45" />
              <stop offset="15%" stopColor="#a3620f" stopOpacity="0.65" />
              <stop offset="60%" stopColor="#2b1152" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#140628" stopOpacity="0.98" />
            </linearGradient>

            {/* Back Palace Shadow Layer */}
            <linearGradient id="palaceBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e5a93c" stopOpacity="0.2" />
              <stop offset="40%" stopColor="#3c186d" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#130626" stopOpacity="0.8" />
            </linearGradient>

            {/* Golden Rim Highlight */}
            <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffd700" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#fff3b0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffd700" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Denser Background Layer: Distant Domes & Towers */}
          <g fill="url(#palaceBackGrad)">
            {/* Left Far Towers */}
            <path d="M30 280 L30 140 Q40 100 50 140 L50 280 Z" />
            <path d="M90 280 L90 120 Q120 70 150 120 L150 280 Z" />
            {/* Mid Far Palace */}
            <path d="M420 280 L420 130 Q460 70 500 130 L500 280 Z" />
            <path d="M520 280 L520 110 Q540 60 560 110 L560 280 Z" />
            {/* Central Giant Dome Background Silhouette */}
            <path d="M660 280 L660 110 Q720 30 780 110 L780 280 Z" />
            <path d="M880 280 L880 120 Q920 60 960 120 L960 280 Z" />
            {/* Right Far Towers */}
            <path d="M1220 280 L1220 130 Q1250 80 1280 130 L1280 280 Z" />
            <path d="M1350 280 L1350 100 Q1380 50 1410 100 L1410 280 Z" />
          </g>

          {/* Main Foreground Layer: Intricate Arabian Sultan Palace */}
          <g fill="url(#palaceGrad)" stroke="url(#goldRim)" strokeWidth="1.2">
            {/* ---- PALACE COMPLEX LEFT (0px - 400px) ---- */}
            {/* Minaret 1 */}
            <path d="M40 280 L40 125 L35 125 L35 118 L43 118 L43 70 L45 50 L47 70 L47 118 L55 118 L55 125 L50 125 L50 280 Z" />
            {/* Onion Dome 1 */}
            <path d="M65 280 L65 170 Q65 140 75 140 Q85 110 95 100 Q105 110 115 140 Q125 140 125 170 L125 280 Z" />
            {/* Crescent finial on dome 1 */}
            <path d="M94 100 L94 85 Q97 82 95 78 Q92 82 95 85 L96 100 Z" />

            {/* Arched Battlement Wall */}
            <path d="M125 280 L125 190 L145 190 L145 180 L160 180 L160 190 L180 190 L180 180 L195 180 L195 190 L215 190 L215 280 Z" />

            {/* Minaret 2 */}
            <path d="M220 280 L220 105 L215 105 L215 98 L223 98 L223 55 L225 35 L227 55 L227 98 L235 98 L235 105 L230 105 L230 280 Z" />

            {/* Secondary Dome */}
            <path d="M245 280 L245 155 Q245 130 260 125 Q280 90 300 125 Q315 130 315 155 L315 280 Z" />
            <path d="M299 90 L299 75 Q302 72 300 68 Q297 72 300 75 Z" />

            {/* Palace Pavilion Arch */}
            <path d="M315 280 L315 175 L390 175 L390 280 Z" />

            {/* ---- PALACE COMPLEX CENTER (400px - 1050px) ---- */}
            {/* Left Central Minaret */}
            <path d="M530 280 L530 95 L522 95 L522 88 L533 88 L533 45 L535 25 L537 45 L537 88 L548 88 L548 95 L540 95 L540 280 Z" />

            {/* Flanking Side Dome Left */}
            <path d="M555 280 L555 145 Q555 125 570 120 Q595 85 620 120 Q635 125 635 145 L635 280 Z" />
            <path d="M619 85 L619 70 Q622 67 620 63 Q617 67 620 70 Z" />

            {/* GRAND SULTAN CENTRAL ONION DOME */}
            <path d="M640 280 L640 145 Q640 105 660 95 Q690 70 720 20 Q750 70 780 95 Q800 105 800 145 L800 280 Z" />
            {/* Grand Crescent Finial atop central dome */}
            <path d="M719 20 L719 5 Q724 2 720 -5 Q715 2 720 5 Z" fill="#ffd700" />
            <circle cx="720" cy="-6" r="4" fill="#ffd700" />

            {/* Grand Palace Colonnade Base */}
            <path d="M610 280 L610 210 L830 210 L830 280 Z" />

            {/* Flanking Side Dome Right */}
            <path d="M805 280 L805 145 Q805 125 820 120 Q845 85 870 120 Q885 125 885 145 L885 280 Z" />
            <path d="M869 85 L869 70 Q872 67 870 63 Q867 67 870 70 Z" />

            {/* Right Central Minaret */}
            <path d="M900 280 L900 95 L892 95 L892 88 L903 88 L903 45 L905 25 L907 45 L907 88 L918 88 L918 95 L910 95 L910 280 Z" />

            {/* ---- PALACE COMPLEX RIGHT (1050px - 1440px) ---- */}
            {/* Eastern Pavilion */}
            <path d="M1020 280 L1020 170 Q1020 140 1040 135 Q1065 100 1090 135 Q1110 140 1110 170 L1110 280 Z" />
            <path d="M1089 100 L1089 85 Q1092 82 1090 78 Q1087 82 1090 85 Z" />

            {/* Minaret 3 */}
            <path d="M1150 280 L1150 105 L1143 105 L1143 98 L1153 98 L1153 55 L1155 35 L1157 55 L1157 98 L1167 98 L1167 105 L1160 105 L1160 280 Z" />

            {/* Right Wing Dome & Walls */}
            <path d="M1190 280 L1190 160 Q1210 120 1240 120 Q1260 90 1280 120 Q1310 120 1330 160 L1330 280 Z" />
            {/* Far Right Tower Minaret */}
            <path d="M1370 280 L1370 125 L1363 125 L1363 118 L1373 118 L1373 70 L1375 50 L1377 70 L1377 118 L1387 118 L1387 125 L1380 125 L1380 280 Z" />
          </g>

          {/* Glowing Palace Windows (warm lantern light) */}
          <g fill="#ffc107" opacity="0.85">
            {/* Left Domes Windows */}
            <path d="M85 160 A8 8 0 0 1 105 160 L105 175 L85 175 Z" />
            <path d="M270 150 A6 6 0 0 1 290 150 L290 165 L270 165 Z" />
            {/* Center Grand Palace Arches */}
            <path d="M680 160 A12 12 0 0 1 704 160 L704 185 L680 185 Z" />
            <path d="M708 140 A14 14 0 0 1 732 140 L732 185 L708 185 Z" />
            <path d="M736 160 A12 12 0 0 1 760 160 L760 185 L736 185 Z" />
            {/* Center Lower Colonnade Lights */}
            <circle cx="640" cy="235" r="4" />
            <circle cx="670" cy="235" r="4" />
            <circle cx="700" cy="235" r="4" />
            <circle cx="740" cy="235" r="4" />
            <circle cx="770" cy="235" r="4" />
            <circle cx="800" cy="235" r="4" />
            {/* Right Windows */}
            <path d="M840 150 A6 6 0 0 1 860 150 L860 165 L840 165 Z" />
            <path d="M1060 160 A8 8 0 0 1 1080 160 L1080 175 L1060 175 Z" />
            <path d="M1250 155 A7 7 0 0 1 1270 155 L1270 170 L1250 170 Z" />
          </g>

          {/* Undulating desert dunes at bottom base with golden rim shimmer */}
          <path
            d="M0 240 Q350 200 720 235 Q1100 260 1440 220 L1440 280 L0 280 Z"
            fill="#0f0420"
            opacity="0.95"
          />
          <path
            d="M0 240 Q350 200 720 235 Q1100 260 1440 220"
            fill="none"
            stroke="#ffc107"
            strokeWidth="1.5"
            opacity="0.45"
          />
          <path
            d="M0 260 Q450 230 900 255 Q1250 240 1440 250 L1440 280 L0 280 Z"
            fill="#080214"
          />
        </svg>
      </div>

      {/* Subtle oriental geometric / arabesque watermark overlay */}
      <div className="arabian-pattern-overlay" />
    </div>
  );
}
