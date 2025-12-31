"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [answered, setAnswered] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [isNameConfirmed, setIsNameConfirmed] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [islandOpenCards, setIslandOpenCards] = useState({});
  const [giftChoice, setGiftChoice] = useState("");
  const [revealedLines, setRevealedLines] = useState([]);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dayCount, setDayCount] = useState(0);
  const [dayPulse, setDayPulse] = useState(0);
  const nextSectionRef = useRef(null);
  const letterNextRef = useRef(null);
  const thankYouRef = useRef(null);
  const finalLetterRef = useRef(null);
  const typingTimerRef = useRef(null);

  useEffect(() => {
    const container = document.querySelector("[data-snap-container]");
    const sections = Array.from(document.querySelectorAll("[data-snap]"));
    if (!sections.length) return;

    let rafId = null;

    const updateActive = () => {
      rafId = null;
      const containerRect = container?.getBoundingClientRect();
      const viewportCenter = containerRect
        ? containerRect.top + containerRect.height / 2
        : window.innerHeight / 2;
      let closest = sections[0];
      let minDistance = Number.POSITIVE_INFINITY;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closest = section;
        }
      });

      sections.forEach((section) => {
        const content = section.querySelector("[data-snap-content]");
        if (!content) return;
        content.classList.toggle("is-active", section === closest);
      });
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateActive);
      }
    };

    updateActive();
    container?.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      container?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const letterLines = [
    "Looking back, we have built so much together, haven’t we?",
    "But then... what about us?",
    "When did our story begin?",
    "There are so many questions I still wonder about.",
    "Who fell first?",
    "When did I start seeing you as more than a friend?",
    "What was it that made me love you this much?",
    "And why do you love me this much?",
    "Whatever the answer is, it doesn’t really matter.",
    "Because in the end, when I finally realized it, I knew that...",
  ];

  const handleLetterClick = () => {
    if (isTyping || revealedLines.length >= letterLines.length) return;
    const line = letterLines[revealedLines.length];
    let index = 0;
    setIsTyping(true);
    setTypingText("");

    if (typingTimerRef.current) {
      window.clearInterval(typingTimerRef.current);
    }

    typingTimerRef.current = window.setInterval(() => {
      index += 1;
      setTypingText(line.slice(0, index));
      if (index >= line.length) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
        setRevealedLines((prev) => [...prev, line]);
        setTypingText("");
        setIsTyping(false);
      }
    }, 55);
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!answered) return;
    const timer = window.setTimeout(() => {
      thankYouRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [answered]);

  useEffect(() => {
    if (dayCount !== 1) return;
    const timer = window.setTimeout(() => {
      finalLetterRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [dayCount]);


  const handleNameSubmit = (event) => {
    event.preventDefault();
    const raw = nameInput.trim();
    if (!raw) {
      setNameMessage("You have to type something, love.");
      setIsNameConfirmed(false);
      return;
    }

    const normalized = raw.toLowerCase();
    const isNaomi = normalized === "naomi" || normalized === "nao";

    setIsNameConfirmed(isNaomi);
    setNameMessage(
      isNaomi
        ? "Okay, Naomi. That's my favorite person's name, actually."
        : `Hmm... "${raw}"? I'm not so sure if that's your actual name -.-`
    );
  };

  const handleNextSection = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <span className="float-sparkle absolute left-[8%] top-[12%] h-2.5 w-2.5 rounded-full bg-amber-300/80" />
        <span className="float-sparkle absolute left-[36%] top-[20%] h-2 w-2 rounded-full bg-rose-400/80 [animation-delay:1.5s]" />
        <span className="float-sparkle absolute left-[70%] top-[16%] h-3 w-3 rounded-full bg-teal-200/80 [animation-delay:2.6s]" />
        <span className="float-sparkle absolute left-[82%] top-[36%] h-2.5 w-2.5 rounded-full bg-amber-200/80 [animation-delay:3.4s]" />
      </div>

      <main
        data-snap-container
        className={`snap-page relative ${isNameConfirmed ? "" : "snap-locked"}`}
      >
        <section
          data-snap
          className="snap-section"
        >
          <div
            data-snap-content
            className="snap-content mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 text-center md:px-12"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">
              hello, love
            </p>
            <h1 className="font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
              What&apos;s your name?
            </h1>
            <form
              onSubmit={handleNameSubmit}
              className="flex w-full max-w-md flex-col items-center gap-4"
            >
              <input
                type="text"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                placeholder="Type it here..."
                className="w-full rounded-full border border-white/15 bg-white/10 px-5 py-3 text-center text-base text-white placeholder:text-white/40 focus:border-amber-300 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-amber-950 shadow-lg shadow-amber-300/40 transition hover:bg-amber-200"
              >
                Submit
              </button>
            </form>
            {nameMessage ? (
              <p className="text-base text-white/75">{nameMessage}</p>
            ) : (
              <p className="text-base text-white/60">
                Answer correctly and I&apos;ll keep going. 🙂
              </p>
            )}
            {isNameConfirmed && (
              <button
                type="button"
                onClick={handleNextSection}
                className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
              >
                Continue
              </button>
            )}
          </div>
        </section>

        <section data-snap className="snap-section" ref={nextSectionRef}>
          <div
            data-snap-content
            className="snap-content mx-auto flex w-full max-w-4xl items-center justify-center px-6 text-center md:px-12"
          >
            <p className="font-display text-3xl leading-relaxed text-white/85 md:text-4xl">
              I made this page for you. I&apos;m not sure if you&apos;ll like it,
              but I like you so much :) 💫
            </p>
          </div>
        </section>

        <section data-snap className="snap-section">
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-5xl px-6 text-center md:px-12"
          >
            <div className="glass-card rounded-[32px] border border-white/10 px-6 py-14 md:px-12">
              <h2 className="font-display text-3xl md:text-4xl">
                Well, where should we start... ummm okie let&apos;s start with the
                first place that we met
              </h2>
              <p className="mt-3 text-white/65">
                Funny how a little coincidence can change everything.
              </p>
            </div>
          </div>
        </section>

        <section
          data-snap
          className="snap-section relative overflow-hidden bg-gradient-to-br from-[#050506] via-[#0b1220] to-[#1a0b2f]"
        >
          <div className="pointer-events-none absolute inset-0">
            <span className="float-sparkle absolute left-[10%] top-[18%] h-2 w-2 rounded-full bg-emerald-300/70" />
            <span className="float-sparkle absolute left-[22%] top-[62%] h-1.5 w-1.5 rounded-full bg-amber-200/70 [animation-delay:1.2s]" />
            <span className="float-sparkle absolute left-[48%] top-[22%] h-2.5 w-2.5 rounded-full bg-sky-300/70 [animation-delay:2.1s]" />
            <span className="float-sparkle absolute left-[70%] top-[30%] h-2 w-2 rounded-full bg-rose-300/70 [animation-delay:3s]" />
            <span className="float-sparkle absolute left-[78%] top-[68%] h-1.5 w-1.5 rounded-full bg-teal-200/70 [animation-delay:1.8s]" />
            <span className="float-sparkle absolute left-[36%] top-[78%] h-2 w-2 rounded-full bg-amber-300/70 [animation-delay:2.6s]" />
          </div>
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-5xl space-y-8 px-6 text-center md:px-12"
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl">
                GeckSMP, where it all started
              </h2>
              <p className="mt-3 text-white/65">
                I was so lucky to meet you in the server.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  src: "/images/geck/img1.png",
                  alt: "GeckSMP build screenshot",
                  caption: "Your little base",
                },
                {
                  src: "/images/geck/img5.PNG",
                  alt: "GeckSMP adventure",
                  caption: "A silly moment that you sent to me",
                },
                {
                  src: "/images/geck/img3.png",
                  alt: "GeckSMP hangout",
                  caption: "Your castle",
                },
                {
                  src: "/images/geck/img4.png",
                  alt: "GeckSMP sunset",
                  caption: "A statue that I want to bring you to see someday.",
                },
              ].map((item, index) => (
                <div
                  key={item.src}
                  className={`flip-card group relative h-64 w-full ${
                    flippedCards[index] ? "is-flipped" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setFlippedCards((prev) => ({
                        ...prev,
                        [index]: !prev[index],
                      }))
                    }
                    className="flip-card-inner h-full w-full rounded-3xl border border-white/10 bg-white/5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
                  >
                    <div className="flip-card-face">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={900}
                        height={600}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 py-4 text-sm text-white/90">
                        {item.caption}
                      </div>
                    </div>
                    <div className="flip-card-face flip-card-back">
                      <p className="text-sm uppercase tracking-[0.35em] text-white/65">
                        Tap to flip back.
                      </p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section data-snap className="snap-section">
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-4xl px-6 text-center md:px-12"
          >
            <div className="glass-card rounded-[32px] border border-white/10 px-6 py-14 md:px-12">
              <h2 className="font-display text-3xl md:text-4xl">
                It&apos;s a bit sad that I don&apos;t even have any screenshots of us.
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Who would have thought we&apos;d come this far, right? 🫶
              </p>
            </div>
          </div>
        </section>

        <section data-snap className="snap-section">
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-4xl px-6 text-center md:px-12"
          >
            <div className="glass-card rounded-[32px] border border-white/10 px-6 py-14 md:px-12">
              <h2 className="font-display text-3xl md:text-4xl">
                Ummm... what&apos;s next? Lemme think. 🤔
              </h2>
              <p className="mt-4 text-lg text-white/70">
                There&apos;s still so much I want to say.
              </p>
            </div>
          </div>
        </section>

        <section data-snap className="snap-section">
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-4xl px-6 text-center md:px-12"
          >
            <div className="glass-card rounded-[32px] border border-white/10 px-6 py-14 md:px-12">
              <h2 className="font-display text-3xl md:text-4xl">
                Oh our server world, right? 🌿
              </h2>
              <p className="mt-4 text-lg text-white/70">
                The one we built together and had so many moments in.
              </p>
            </div>
          </div>
        </section>

        <section
          data-snap
          className="snap-section relative overflow-hidden bg-gradient-to-b from-[#071826] via-[#0f2d3a] to-[#1b3a2f]"
        >
          <div className="pointer-events-none absolute inset-0">
            <span className="float-sparkle absolute left-[12%] top-[16%] h-2 w-2 rounded-full bg-sky-300/70" />
            <span className="float-sparkle absolute left-[24%] top-[72%] h-1.5 w-1.5 rounded-full bg-emerald-200/70 [animation-delay:1.4s]" />
            <span className="float-sparkle absolute left-[46%] top-[24%] h-2.5 w-2.5 rounded-full bg-amber-200/70 [animation-delay:2.2s]" />
            <span className="float-sparkle absolute left-[68%] top-[36%] h-2 w-2 rounded-full bg-teal-200/70 [animation-delay:3.2s]" />
            <span className="float-sparkle absolute left-[82%] top-[70%] h-1.5 w-1.5 rounded-full bg-cyan-200/70 [animation-delay:2.6s]" />
          </div>
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-6xl space-y-8 px-6 text-center md:px-12"
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl">
                Our island days
              </h2>
              <p className="mt-3 text-white/65">
                Screenshots from the world we made together.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { src: "/images/island/img1.png" },
                { src: "/images/island/img4.png" },
                { src: "/images/island/img5.png" },
                { src: "/images/island/img3.png" },
                { src: "/images/island/img2.png" },
                { src: "/images/island/img6.png" },
                { src: "/images/island/img7.png" },
              ].map((item, index) => (
                <figure
                  key={item.src}
                  className={`island-card h-44 md:h-48 lg:h-52 ${
                    index === 3 ? "md:col-span-3 md:h-60 lg:h-64" : ""
                  } ${
                    islandOpenCards[index] ? "is-open" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setIslandOpenCards((prev) => ({
                        ...prev,
                        [index]: !prev[index],
                      }))
                    }
                    className="relative h-full w-full rounded-[24px] focus:outline-none"
                  >
                    <div className="island-media">
                      <Image
                        src={item.src}
                        alt="Island memory"
                        width={900}
                        height={600}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="island-doors" aria-hidden="true">
                      <span className="island-door"></span>
                      <span className="island-door right"></span>
                    </div>
                  </button>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section data-snap className="snap-section">
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-4xl px-6 text-center md:px-12"
          >
            <div className="glass-card rounded-[32px] border border-white/10 px-6 py-14 md:px-12">
              <h2 className="font-display text-3xl md:text-4xl">
                I created this server for you.
              </h2>
              <p className="mt-4 text-lg text-white/70">
                I still remember that, and it was really worth it — I can&apos;t
                lie.
              </p>
            </div>
          </div>
        </section>

        <section data-snap className="snap-section">
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-4xl px-6 text-center md:px-12"
          >
            <div className="glass-card rounded-[32px] border border-white/10 px-6 py-14 md:px-12">
              <h2 className="font-display text-3xl md:text-4xl">
                Are you tired yet?
              </h2>
              <p className="mt-4 text-lg text-white/70">
                I happen to have something for you to play with.
              </p>
            </div>
          </div>
        </section>

        <section
          data-snap
          className="snap-section relative overflow-hidden bg-gradient-to-br from-[#3a0b2c] via-[#6b1b48] to-[#b33a7c]"
        >
          <div className="gift-glow" aria-hidden="true"></div>
          <div className="pointer-events-none absolute inset-0">
            <span className="float-sparkle absolute left-[8%] top-[20%] h-2 w-2 rounded-full bg-rose-200/70" />
            <span className="float-sparkle absolute left-[22%] top-[70%] h-1.5 w-1.5 rounded-full bg-pink-200/70 [animation-delay:1.4s]" />
            <span className="float-sparkle absolute left-[80%] top-[30%] h-2 w-2 rounded-full bg-fuchsia-200/70 [animation-delay:2.2s]" />
            <span className="float-sparkle absolute left-[68%] top-[78%] h-1.5 w-1.5 rounded-full bg-rose-100/70 [animation-delay:3.1s]" />
            <span className="absolute left-[6%] top-[50%] text-4xl opacity-20">🎁</span>
            <span className="absolute right-[6%] top-[18%] text-3xl opacity-20">🎀</span>
          </div>
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-5xl px-6 text-center md:px-12"
          >
            {giftChoice && (
              <div className="gift-fireworks" aria-hidden="true">
                <span className="gift-burst" style={{ left: "18%", top: "20%", animationDelay: "0s" }} />
                <span className="gift-burst" style={{ left: "78%", top: "24%", animationDelay: "0.2s" }} />
                <span className="gift-burst" style={{ left: "32%", top: "68%", animationDelay: "0.35s" }} />
                <span className="gift-burst" style={{ left: "62%", top: "72%", animationDelay: "0.5s" }} />
              </div>
            )}
            <div className="glass-card rounded-[32px] border border-white/10 px-6 py-12 md:px-12">
              <h2 className="font-display text-3xl md:text-4xl">
                Pick your random gift 🎁
              </h2>
              <p className="mt-3 text-white/70">
                You can choose only once, so choose wisely.
              </p>
              <div
                className={`mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${
                  giftChoice ? "gift-reveal" : ""
                }`}
              >
                {["Ring", "Bracelet", "Necklace", "Plushie"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setGiftChoice(item)}
                    disabled={Boolean(giftChoice)}
                    className={`gift-option glass-card rounded-2xl border border-white/10 px-4 py-6 text-lg font-semibold transition ${
                      giftChoice === item
                        ? "is-chosen bg-white/20 text-white"
                        : giftChoice
                        ? "is-dim text-white/70"
                        : "gift-shuffle text-white/85 hover:bg-white/10"
                    } disabled:cursor-not-allowed`}
                  >
                    <div className="text-3xl">🎁</div>
                    <div className="gift-label mt-2 text-sm uppercase tracking-[0.2em] text-white/70">
                      {giftChoice ? item : ""}
                    </div>
                  </button>
                ))}
              </div>
              {giftChoice ? (
                <p className="mt-6 text-white/80">
                  You chose the {giftChoice.toLowerCase()}. I think that suits
                  you perfectly.
                </p>
              ) : (
                <p className="mt-6 text-white/60">Only one pick, my love.</p>
              )}
            </div>
          </div>
        </section>

        <section data-snap className="snap-section">
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-3xl px-6 text-left md:px-12"
          >
            <button
              type="button"
              onClick={handleLetterClick}
              className="glass-card w-full rounded-[28px] border border-white/10 px-6 py-10 text-left focus:outline-none md:px-10"
            >
              <div className="font-letter space-y-3 text-base leading-relaxed text-white/85 md:text-lg">
                {revealedLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {isTyping && (
                  <p>
                    {typingText}
                    <span className="type-cursor">|</span>
                  </p>
                )}
              </div>
              {revealedLines.length < letterLines.length && !isTyping && (
                <p className="font-letter mt-6 text-sm text-white/60">
                  Tap to reveal the next line
                </p>
              )}
              {isTyping && (
                <p className="font-letter mt-6 text-sm text-white/50">
                  ...
                </p>
              )}
            </button>
            {revealedLines.length >= letterLines.length && !isTyping && (
              <button
                type="button"
                onClick={() => letterNextRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="mt-6 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
              >
                Continue
              </button>
            )}
          </div>
        </section>

        <section data-snap className="snap-section" ref={letterNextRef}>
          <div
            data-snap-content
            className="snap-content mx-auto flex w-full max-w-4xl items-center justify-center px-6 text-center md:px-12"
          >
            <p className="font-letter text-2xl leading-relaxed text-white/85 md:text-3xl">
              You are the first person I think of every morning and the last
              every night.
            </p>
          </div>
        </section>

        <section data-snap className="snap-section">
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-6xl px-6 md:px-12"
          >
            <div className="memory-stage relative mx-auto flex min-h-[420px] w-full max-w-5xl items-center justify-center text-center">
              <p className="memory-center font-letter text-2xl leading-relaxed text-white/85 md:text-3xl">
                Your beautiful smile is what I always want to see.
              </p>
              {[
                {
                  src: "/images/yoursmile/IMG_6570.PNG",
                  style: {
                    top: "10%",
                    left: "6%",
                    width: "clamp(90px, 14vw, 170px)",
                    height: "clamp(90px, 14vw, 170px)",
                    "--tilt": "-6deg",
                  },
                  delay: "",
                },
                {
                  src: "/images/yoursmile/IMG_6575.JPG",
                  style: {
                    top: "12%",
                    right: "6%",
                    width: "clamp(80px, 12vw, 150px)",
                    height: "clamp(80px, 12vw, 150px)",
                    "--tilt": "5deg",
                  },
                  delay: "delay",
                },
                {
                  src: "/images/yoursmile/IMG_6576.PNG",
                  style: {
                    bottom: "12%",
                    left: "16%",
                    width: "clamp(85px, 13vw, 160px)",
                    height: "clamp(85px, 13vw, 160px)",
                    "--tilt": "-3deg",
                  },
                  delay: "delay-2",
                },
              ].map((item) => (
                <div
                  key={item.src}
                  className={`memory-float ${item.delay} pointer-events-none absolute`}
                  style={item.style}
                >
                  <Image
                    src={item.src}
                    alt="Your smile"
                    width={400}
                    height={400}
                    className="h-full w-full rounded-full object-cover ring-2 ring-white/25"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section data-snap className="snap-section">
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-6xl px-6 md:px-12"
          >
            <div className="memory-stage relative mx-auto flex min-h-[560px] w-full max-w-5xl items-center justify-center text-center">
              <p className="memory-center max-w-sm font-letter text-2xl leading-relaxed text-white/85 md:text-3xl">
                Your warm voice is what I always want to hear.
              </p>
              {[
                {
                  src: "/images/yourvoice/IMG_6566.PNG",
                  style: {
                    top: "6%",
                    left: "6%",
                    width: "clamp(95px, 14vw, 170px)",
                    height: "clamp(95px, 14vw, 170px)",
                    "--tilt": "-6deg",
                  },
                  delay: "",
                },
                {
                  src: "/images/yourvoice/IMG_6579.jpg",
                  style: {
                    top: "8%",
                    right: "6%",
                    width: "clamp(100px, 15vw, 170px)",
                    height: "clamp(75px, 11vw, 130px)",
                    "--tilt": "5deg",
                  },
                  delay: "delay",
                },
                {
                  src: "/images/yourvoice/IMG_6580.jpg",
                  style: {
                    bottom: "18%",
                    right: "10%",
                    width: "clamp(95px, 13vw, 165px)",
                    height: "clamp(95px, 13vw, 165px)",
                    "--tilt": "4deg",
                  },
                  delay: "",
                },
                {
                  src: "/images/yourvoice/IMG_6581.jpg",
                  style: {
                    bottom: "14%",
                    left: "10%",
                    width: "clamp(100px, 14vw, 170px)",
                    height: "clamp(85px, 12vw, 150px)",
                    "--tilt": "2deg",
                  },
                  delay: "delay",
                },
                {
                  src: "/images/yourvoice/IMG_6582.jpg",
                  style: {
                    bottom: "14%",
                    right: "12%",
                    width: "clamp(95px, 13vw, 160px)",
                    height: "clamp(80px, 11vw, 140px)",
                    "--tilt": "-4deg",
                  },
                  delay: "",
                },
                {
                  src: "/images/yourvoice/IMG_6583.jpg",
                  style: {
                    top: "40%",
                    left: "2%",
                    width: "clamp(90px, 12vw, 150px)",
                    height: "clamp(90px, 12vw, 150px)",
                    "--tilt": "5deg",
                  },
                  delay: "delay-2",
                  hideOnSmall: true,
                },
                {
                  src: "/images/yourvoice/IMG_6584.jpg",
                  style: {
                    top: "40%",
                    right: "2%",
                    width: "clamp(95px, 13vw, 155px)",
                    height: "clamp(80px, 11vw, 135px)",
                    "--tilt": "-3deg",
                  },
                  delay: "",
                  hideOnSmall: true,
                },
              ].map((item) => (
                <div
                  key={item.src}
                  className={`memory-float ${item.delay} pointer-events-none absolute ${
                    item.hideOnSmall ? "hidden sm:block" : ""
                  }`}
                  style={item.style}
                >
                  <div className="polaroid">
                    <Image
                      src={item.src}
                      alt="Your voice"
                      width={400}
                      height={400}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          data-snap
          className="snap-section relative overflow-hidden bg-gradient-to-br from-[#4c1733] via-[#b13d6f] to-[#e57fb0]"
        >
          <div className="pointer-events-none absolute inset-0">
            <span className="float-sparkle absolute left-[10%] top-[14%] h-2 w-2 rounded-full bg-rose-200/80" />
            <span className="float-sparkle absolute left-[80%] top-[20%] h-2.5 w-2.5 rounded-full bg-amber-100/80 [animation-delay:1.6s]" />
            <span className="float-sparkle absolute left-[22%] top-[72%] h-2 w-2 rounded-full bg-pink-100/70 [animation-delay:2.4s]" />
            <span className="float-sparkle absolute left-[68%] top-[78%] h-1.5 w-1.5 rounded-full bg-fuchsia-100/70 [animation-delay:3.1s]" />
            <span className="absolute left-[6%] top-[26%] text-3xl opacity-30">✨</span>
            <span className="absolute right-[12%] top-[14%] text-3xl opacity-30">💗</span>
            <span className="absolute left-[14%] bottom-[16%] text-2xl opacity-25">🌸</span>
            <span className="absolute right-[18%] bottom-[20%] text-2xl opacity-25">💫</span>
            <span className="absolute left-[48%] top-[6%] text-2xl opacity-20">🫶</span>
          </div>
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-6xl px-6 md:px-12"
          >
            <div className="memory-stage relative mx-auto flex min-h-[600px] w-full max-w-5xl items-center justify-center text-center">
              <p className="memory-center font-letter text-2xl leading-relaxed text-white/90 md:text-3xl">
                <span className="block">And everything about you is what I&apos;ll</span>
                <span className="block">keep falling in love with forever.</span>
              </p>
              {[
                {
                  src: "/images/everything/IMG_6449.JPG",
                  style: {
                    top: "6%",
                    left: "6%",
                    width: "clamp(120px, 17vw, 210px)",
                    height: "clamp(98px, 15vw, 175px)",
                    "--tilt": "-5deg",
                  },
                  delay: "delay",
                },
                {
                  src: "/images/everything/IMG_6569.PNG",
                  style: {
                    top: "6%",
                    right: "6%",
                    width: "clamp(120px, 17vw, 210px)",
                    height: "clamp(98px, 15vw, 175px)",
                    "--tilt": "6deg",
                  },
                  delay: "",
                },
                {
                  src: "/images/everything/IMG_6571.JPG",
                  style: {
                    top: "34%",
                    left: "2%",
                    width: "clamp(105px, 15vw, 185px)",
                    height: "clamp(88px, 13vw, 150px)",
                    "--tilt": "4deg",
                  },
                  delay: "delay-2",
                },
                {
                  src: "/images/everything/IMG_6572.JPG",
                  style: {
                    top: "34%",
                    right: "2%",
                    width: "clamp(105px, 15vw, 185px)",
                    height: "clamp(88px, 13vw, 150px)",
                    "--tilt": "-4deg",
                  },
                  delay: "",
                },
                {
                  src: "/images/everything/IMG_6561.JPG",
                  style: {
                    bottom: "10%",
                    left: "8%",
                    width: "clamp(110px, 16vw, 195px)",
                    height: "clamp(92px, 14vw, 165px)",
                    "--tilt": "3deg",
                  },
                  delay: "delay",
                  hideOnSmall: true,
                },
                {
                  src: "/images/everything/IMG_6573.JPG",
                  style: {
                    bottom: "10%",
                    right: "8%",
                    width: "clamp(110px, 16vw, 195px)",
                    height: "clamp(92px, 14vw, 165px)",
                    "--tilt": "-6deg",
                  },
                  delay: "delay-2",
                  hideOnSmall: true,
                },
                {
                  src: "/images/everything/IMG_6574.JPG",
                  style: {
                    top: "62%",
                    left: "22%",
                    width: "clamp(100px, 14vw, 170px)",
                    height: "clamp(82px, 12vw, 140px)",
                    "--tilt": "4deg",
                  },
                  delay: "",
                  hideOnSmall: true,
                },
                {
                  src: "/images/everything/IMG_6577.JPG",
                  style: {
                    top: "62%",
                    right: "22%",
                    width: "clamp(110px, 15vw, 180px)",
                    height: "clamp(88px, 13vw, 150px)",
                    "--tilt": "-3deg",
                  },
                  delay: "delay",
                  hideOnSmall: true,
                },
                {
                  src: "/images/everything/image 2.PNG",
                  style: {
                    bottom: "4%",
                    left: "38%",
                    width: "clamp(115px, 16vw, 190px)",
                    height: "clamp(92px, 13vw, 160px)",
                    "--tilt": "-2deg",
                  },
                  delay: "",
                },
              ].map((item) => (
                <div
                  key={item.src}
                  className={`pink-drift memory-float ${item.delay} pointer-events-none absolute ${
                    item.hideOnSmall ? "hidden sm:block" : ""
                  }`}
                  style={item.style}
                >
                  <Image
                    src={item.src}
                    alt="Everything about you"
                    width={420}
                    height={420}
                    className="h-full w-full rounded-2xl object-cover shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-2 ring-white/20"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section data-snap className="snap-section">
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-4xl px-6 text-center md:px-12"
          >
            <div className="glass-card rounded-[32px] border border-white/10 px-6 py-14 md:px-12">
              <h2 className="font-display text-3xl md:text-4xl">
                Can I ask you something a little special?
              </h2>
              <p className="mt-4 text-lg text-white/70">
                It&apos;s been on my mind for a while now.
              </p>
            </div>
          </div>
        </section>

        <section data-snap className="snap-section">
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-4xl px-6 text-center md:px-12"
          >
            <div className="glass-card rounded-[32px] border border-white/10 px-6 py-14 md:px-12">
              <h2 className="font-display text-3xl md:text-4xl">
                I know we already talked about us, but a girl like you deserves
                a proper proposal.
              </h2>
              <p className="mt-4 text-lg text-white/70">
                I want to do every step right with you, starting with this...
              </p>
            </div>
          </div>
        </section>

        <section data-snap className="snap-section">
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-4xl px-6 text-center md:px-12"
          >
            <div
              className={`glass-card question-card rounded-[32px] border border-white/10 px-6 py-14 md:px-12 ${
                answered ? "is-answered" : ""
              }`}
            >
              <div className="pointer-events-none absolute inset-0">
                <span className="absolute left-[10%] top-[18%] text-3xl opacity-30">✨</span>
                <span className="absolute right-[12%] top-[16%] text-3xl opacity-30">💗</span>
                <span className="absolute left-[18%] bottom-[18%] text-2xl opacity-25">🌸</span>
                <span className="absolute right-[18%] bottom-[20%] text-2xl opacity-25">💫</span>
              </div>
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  the real question
                </p>
                <h2 className="mt-4 font-display text-3xl md:text-4xl">
                  Are you interested in being my girlfriend?
                </h2>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setAnswered(true)}
                    disabled={answered}
                    className="rounded-full bg-amber-300 px-8 py-3 text-sm font-semibold text-amber-950 shadow-lg shadow-amber-300/40 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswered(true)}
                    disabled={answered}
                    className="rounded-full border border-black/70 bg-black px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    YES
                  </button>
                </div>
                {answered && (
                  <div className="love-burst" aria-hidden="true">
                    <span className="love-pop" style={{ left: "8%", top: "24%" }} />
                    <span className="love-pop" style={{ left: "18%", top: "70%" }} />
                    <span className="love-pop" style={{ left: "50%", top: "12%" }} />
                    <span className="love-pop" style={{ left: "74%", top: "28%" }} />
                    <span className="love-pop" style={{ left: "86%", top: "66%" }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section data-snap className="snap-section" ref={thankYouRef}>
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-4xl px-6 text-center md:px-12"
          >
            <div className="glass-card rounded-[32px] border border-white/10 px-6 py-14 md:px-12">
              <h2 className="font-display text-3xl md:text-4xl">
                Thank you for saying yes.
              </h2>
              <p className="mt-4 text-lg text-white/70">
                You just made me the happiest. 💫
              </p>
            </div>
          </div>
        </section>

        <section data-snap className="snap-section">
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-4xl px-6 text-center md:px-12"
          >
            <button
              type="button"
              onClick={() => {
                setDayCount((prev) => (prev === 0 ? 1 : prev));
                setDayPulse((prev) => prev + 1);
              }}
              className="glass-card w-full rounded-[32px] border border-white/10 px-6 py-14 text-center md:px-12"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                for everything
              </p>
              <h2 className="mt-4 font-display text-3xl md:text-4xl">
                Thank you for this past year.
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Every single day has been a precious gift.
              </p>
              <p className="mt-3 text-lg text-white/70">
                I&apos;m so excited for the new year ahead with you.
              </p>
              <p className="mt-4 text-sm text-white/55">
                Tap the card to change the date.
              </p>
              <div className="mt-8 flex items-center justify-center">
                <div
                  key={dayPulse}
                  className={`day-counter ${dayCount ? "is-ticked" : ""}`}
                >
                  <span className="day-digit">{dayCount}</span>
                  <span className="day-sep">/</span>
                  <span className="day-total">365</span>
                </div>
              </div>
            </button>
          </div>
        </section>

        <section
          data-snap
          className="snap-section relative overflow-hidden bg-gradient-to-br from-[#4b1231] via-[#b33a7a] to-[#f08bb8]"
          ref={finalLetterRef}
        >
          <div className="pointer-events-none absolute inset-0">
            <span className="float-sparkle absolute left-[8%] top-[18%] h-2.5 w-2.5 rounded-full bg-rose-100/80" />
            <span className="float-sparkle absolute left-[20%] top-[64%] h-2 w-2 rounded-full bg-amber-100/70 [animation-delay:1.4s]" />
            <span className="float-sparkle absolute left-[70%] top-[16%] h-2.5 w-2.5 rounded-full bg-pink-100/70 [animation-delay:2.2s]" />
            <span className="float-sparkle absolute left-[82%] top-[72%] h-2 w-2 rounded-full bg-fuchsia-100/70 [animation-delay:3.1s]" />
            <span className="absolute left-[10%] top-[30%] text-3xl opacity-40">💗</span>
            <span className="absolute right-[12%] top-[24%] text-3xl opacity-35">💞</span>
            <span className="absolute left-[16%] bottom-[18%] text-2xl opacity-35">💕</span>
            <span className="absolute right-[18%] bottom-[22%] text-2xl opacity-35">💘</span>
            <span className="absolute left-[48%] top-[10%] text-2xl opacity-30">💖</span>
          </div>
          <div
            data-snap-content
            className="snap-content mx-auto w-full max-w-4xl px-6 text-center md:px-12"
          >
            <div className="px-2 py-6 md:px-6">
              <div className="font-letter text-2xl leading-relaxed text-white/90 md:text-3xl">
                <p>
                  I love you beyond words, Naomi. No matter who else is in this
                  world, you will always be my first and only choice.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
