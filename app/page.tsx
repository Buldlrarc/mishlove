"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"

const games = [
  {
    title: "Empire",
    tagline: "Scale the skyline. Don't look down.",
    href: "/empire",
    status: "live",
  },
  {
    title: "Nine Lanes",
    tagline: "Nine lanes. Nine lives. Spend them wisely.",
    href: "/nine-lanes",
    status: "live",
  },
  {
    title: "Nine Lives",
    tagline: "Rescue the strays. No cat left behind.",
    href: "/nine-lives",
    status: "live",
  },
  {
    title: "???",
    tagline: "Next cabinet under construction.",
    href: "#",
    status: "soon",
  },
]

export default function Page() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [needsPermission, setNeedsPermission] = useState(false)
  const [gyroActive, setGyroActive] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const frameRef = useRef<number>()
  const lastUpdateRef = useRef<number>(0)

  const requestOrientation = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission()
        if (permissionState === "granted") {
          setNeedsPermission(false)
          setGyroActive(true)
          setShouldAnimate(true)
        }
      } catch (error) {
        console.error("Permission denied:", error)
      }
    } else {
      setNeedsPermission(false)
      setGyroActive(true)
      setShouldAnimate(true)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / window.innerWidth
      const y = (e.clientY - window.innerHeight / 2) / window.innerHeight
      setMousePosition({ x, y })
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const now = Date.now()
      if (now - lastUpdateRef.current < 16) {
        return
      }
      lastUpdateRef.current = now

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }

      frameRef.current = requestAnimationFrame(() => {
        const isLandscape = window.innerWidth > window.innerHeight

        let x = 0
        if (isLandscape) {
          const beta = e.beta || 0
          x = Math.max(-1, Math.min(1, beta / 45))
        } else {
          const gamma = e.gamma || 0
          x = Math.max(-1, Math.min(1, gamma / 45))
        }

        setMousePosition({ x, y: 0 })
      })
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768
    const isTouchDevice = isMobile || isTablet || "ontouchstart" in window || navigator.maxTouchPoints > 0

    if (isTouchDevice) {
      if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
        setNeedsPermission(true)
      } else {
        setGyroActive(true)
        setShouldAnimate(true)
      }
    } else {
      window.addEventListener("mousemove", handleMouseMove)
      setShouldAnimate(true)
    }

    if (gyroActive) {
      window.addEventListener("deviceorientation", handleOrientation)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("deviceorientation", handleOrientation)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [gyroActive])

  const scrollToGames = () => {
    document.getElementById("games")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <main className="bg-black text-white">
      <section className="relative h-dvh w-full overflow-hidden">
        {needsPermission && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
            <button
              onClick={requestOrientation}
              className="px-8 py-4 bg-[#7ed321] text-black text-xl font-bold rounded-lg hover:bg-[#93e83a] transition-colors"
            >
              Enable Parallax
            </button>
          </div>
        )}

        <div
          className={`absolute inset-0 ${shouldAnimate ? "zoom-layer-1" : ""}`}
          style={{
            transform: `translate3d(${mousePosition.x * 25}px, ${mousePosition.y * 25}px, 0)`,
            willChange: "transform",
            width: "130%",
            height: "130%",
            left: "-15%",
            top: "-15%",
          }}
        >
          <Image
            src="/images/rooftop-bg.png"
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: "22% center" }}
            priority
          />
        </div>

        <div
          className={`absolute z-5 cat-signal ${shouldAnimate ? "signal-in" : ""}`}
          style={{
            transform: `translate3d(${mousePosition.x * 40}px, ${mousePosition.y * 40}px, 0)`,
            willChange: "transform",
          }}
        />

        <div
          className={`absolute inset-0 z-10 ${shouldAnimate ? "zoom-layer-2" : ""}`}
          style={{
            transform: `translate3d(${mousePosition.x * 55}px, ${mousePosition.y * 55}px, 0)`,
            willChange: "transform",
            width: "126%",
            height: "126%",
            left: "-13%",
            top: "-13%",
          }}
        >
          <Image
            src="/images/rooftop.png"
            alt="Jellycat crouched on a rooftop over the New York skyline at night"
            fill
            className="object-cover"
            style={{ objectPosition: "22% center" }}
            priority
          />
        </div>

        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-6 ${shouldAnimate ? "zoom-layer-text" : ""}`}
          style={{
            transform: `translate3d(${mousePosition.x * 85}px, ${mousePosition.y * 85}px, 0)`,
            willChange: "transform",
            perspective: "1000px",
          }}
        >
          <p className="hero-eyebrow mb-3 text-xs sm:text-sm tracking-[0.4em] text-[#a8ff4a]">
            #JUSTICEFORJELLYCAT
          </p>
          <h1 className="flex text-[42px] sm:text-[72px] md:text-[104px] lg:text-[136px] leading-none hero-title">
            {"JELLYCAT".split("").map((letter, index) => (
              <span
                key={index}
                className={shouldAnimate ? "letter-rotate" : ""}
                style={{
                  display: "inline-block",
                  transformStyle: "preserve-3d",
                  animationDelay: `${index * 0.06}s`,
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
          <p className="hero-sub mt-3 text-lg sm:text-2xl tracking-[0.55em] text-white/90">
            ARCADE
          </p>
        </div>

        <div
          className={`absolute bottom-0 left-0 z-30 w-full ${shouldAnimate ? "zoom-layer-3" : ""}`}
          style={{
            transform: `translate3d(${mousePosition.x * 110}px, ${mousePosition.y * 110}px, 0)`,
            willChange: "transform",
            width: "116%",
            left: "-8%",
          }}
        >
          <Image
            src="/images/rooftop-ledge.png"
            alt=""
            width={2172}
            height={188}
            className="w-full h-auto"
          />
        </div>

        <button
          onClick={scrollToGames}
          className="insert-coin absolute bottom-6 left-1/2 z-40 -translate-x-1/2 text-sm sm:text-base tracking-[0.3em] text-[#a8ff4a] hover:text-white transition-colors"
        >
          INSERT COIN
        </button>

        <style jsx>{`
          .hero-title,
          .hero-eyebrow,
          .hero-sub,
          .insert-coin {
            font-family: var(--font-display);
          }

          .hero-title span {
            color: #fff;
            text-shadow:
              0 0 24px rgba(126, 211, 33, 0.55),
              0 4px 30px rgba(0, 0, 0, 0.8);
          }

          .cat-signal {
            top: 4%;
            left: 2%;
            width: 42vmin;
            height: 42vmin;
            border-radius: 50%;
            background: radial-gradient(
              circle,
              rgba(168, 255, 74, 0.28) 0%,
              rgba(126, 211, 33, 0.12) 45%,
              transparent 70%
            );
            opacity: 0;
            pointer-events: none;
          }

          .signal-in {
            animation: signalPulse 6s ease-in-out 2s infinite,
              signalFade 3s ease-out 1.5s forwards;
          }

          @keyframes signalFade {
            to {
              opacity: 1;
            }
          }

          @keyframes signalPulse {
            0%,
            100% {
              filter: brightness(1);
            }
            50% {
              filter: brightness(1.35);
            }
          }

          .insert-coin {
            animation: coinBlink 1.6s steps(2, jump-none) infinite;
          }

          @keyframes coinBlink {
            50% {
              opacity: 0.35;
            }
          }

          .zoom-layer-1 {
            animation: zoomOut1 6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .zoom-layer-2 {
            animation: zoomOut2 6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .zoom-layer-3 {
            animation: zoomOut3 6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .zoom-layer-text {
            animation: zoomOutText 6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          @keyframes zoomOut1 {
            0% {
              scale: 1.3;
            }
            100% {
              scale: 1;
            }
          }

          @keyframes zoomOut2 {
            0% {
              scale: 2.2;
              filter: blur(18px);
            }
            50% {
              filter: blur(8px);
            }
            100% {
              scale: 1;
              filter: blur(0px);
            }
          }

          @keyframes zoomOut3 {
            0% {
              scale: 3;
              filter: blur(30px);
              opacity: 0;
            }
            40% {
              opacity: 0.4;
            }
            100% {
              scale: 1;
              filter: blur(0px);
              opacity: 1;
            }
          }

          @keyframes zoomOutText {
            0% {
              scale: 3.2;
              opacity: 0;
            }
            40% {
              opacity: 0.3;
            }
            70% {
              opacity: 0.7;
            }
            100% {
              scale: 1;
              opacity: 1;
            }
          }

          .letter-rotate {
            animation: rotateText 6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          @keyframes rotateText {
            0% {
              transform: rotateY(90deg);
              filter: blur(30px);
              opacity: 0;
            }
            40% {
              filter: blur(15px);
              opacity: 0.5;
            }
            70% {
              filter: blur(5px);
              opacity: 0.8;
            }
            100% {
              transform: rotateY(0deg);
              filter: blur(0px);
              opacity: 1;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .zoom-layer-1,
            .zoom-layer-2,
            .zoom-layer-3,
            .zoom-layer-text,
            .letter-rotate,
            .insert-coin,
            .signal-in {
              animation: none;
            }
            .signal-in {
              opacity: 1;
            }
          }
        `}</style>
      </section>

      <section id="games" className="relative border-t border-[#7ed321]/25 bg-[#050805] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="games-heading text-2xl sm:text-4xl text-white">
            Pick your cabinet
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/60">
            Every run posts to the global leaderboard. No wallet needed to play.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {games.map((game) => {
              const soon = game.status === "soon"
              const Tag = soon ? "div" : "a"
              return (
                <Tag
                  key={game.title}
                  {...(soon ? {} : { href: game.href })}
                  className={`cabinet group relative block rounded-lg border p-6 sm:p-8 transition-all ${
                    soon
                      ? "border-white/10 bg-white/[0.02] opacity-60"
                      : "border-[#7ed321]/30 bg-white/[0.03] hover:border-[#a8ff4a] hover:bg-[#7ed321]/5 hover:shadow-[0_0_40px_rgba(126,211,33,0.15)]"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="cabinet-title text-xl sm:text-2xl text-white">
                      {game.title}
                    </h3>
                    <span
                      className={`cabinet-badge text-[10px] tracking-[0.25em] ${
                        soon ? "text-white/40" : "text-[#a8ff4a]"
                      }`}
                    >
                      {soon ? "SOON" : "PLAY"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-white/60">{game.tagline}</p>
                </Tag>
              )
            })}
          </div>

          <div className="mt-14 flex justify-center gap-8">
            <a
              href="/arcade"
              className="cabinet-badge text-xs tracking-[0.25em] text-[#a8ff4a] transition-colors hover:text-white"
            >
              THE ARCADE
            </a>
            <a
              href="/shelter"
              className="cabinet-badge text-xs tracking-[0.25em] text-[#a8ff4a] transition-colors hover:text-white"
            >
              THE SHELTER
            </a>
          </div>

          <p className="mt-10 text-center text-xs tracking-[0.3em] text-white/30">
            A JELLYCAT COMMUNITY TAKEOVER
          </p>
        </div>

        <style jsx>{`
          .games-heading,
          .cabinet-title,
          .cabinet-badge {
            font-family: var(--font-display);
          }
        `}</style>
      </section>
    </main>
  )
}
