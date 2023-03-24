import React from 'react';
import { NextPageContext } from 'next';
import { env } from '@/env/client.mjs';
import { getBaseUrl } from '@utils/trpc';

let umami = '';

if (process.env.VERCEL_ENV === 'production') {
  umami = `<script async defer data-website-id="${
    env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  }" src="${getBaseUrl()}/api/umami/test"></script>`;
}

const str = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>planner.</title>
  <link rel="stylesheet" href="./index.css">
  <meta property="og:title" content="planner.">
  <meta property="og:description" content="Say goodbye to the stress and hassle of degree planning and hello to a smooth, organized path towards graduation with Nebula Planner.">
  ${umami}
</head>
<body>
<header>
  <img src="planner_logo.svg" width="160" alt="planner logo"/>
  <ul>
    <li><a href="#features">Features</a></li>
    <li><a href="#team">Meet the Team</a></li>
    <li><a href="#contact">Contact Us</a></li>
    <li><a href="/auth/login" class="login button">Login</a></li>
  </ul>
  <div id="menu"><img src="./icons8-menu-rounded-100.png" alt="Menu"></div>
</header>
<main>
  <section id="intro">
    <div>
      <h2>Navigate your degree with ease</h2>
      <h1>Launch Your Degree Plan with Nebula Planner</h1>
      <h3>Blast off your academic journey to the moon with Nebula Labs Planner - the ultimate tool for customizing your four-year degree.</h3>
      <div class="buttons">
        <button><a href="/auth/login" class="login button">Get Started</a></button>
        <button><a href="#features" class="button">Learn More</a></button>
      </div>
    </div>
    <img src="mockup.png" alt="planner mockup">
  </section>
  <section id="features">
    <h2>Features</h2>
    <h3>
      Say goodbye to the stress and hassle of degree planning and hello to a smooth, organized path towards graduation with Nebula Planner.
    </h3>
    <div class="features">
      <div class="feature">
        <div class="icon">
          <img src="./icons8-gold-medal-100.png" alt="medal">
        </div>
        <h4>Spreadsheet where?</h4>
        <p>
          Bye-bye clunky spreadsheets, hello easy-peasy degree planning with simple click-and-drag action. You&apos;re welcome!
        </p>
      </div>
      <div class="feature">
        <div class="icon">
          <img src="./icons8-test-tube-100.png" alt="medal">
        </div>
        <h4>Slay your progress! </h4>
        <p>
          Not sure where you are in your degree plan? That&apos;s ok. Tracking your degree plan is now a piece of cake with our degree tracker. No cap.
        </p>
      </div>
      <div class="feature">
        <div class="icon">
          <img src="./icons8-stopwatch-100.png" alt="medal">
        </div>
        <h4>Save Time</h4>
        <p>
          Nebula Planner streamlines academic planning, enabling you to map out your course requirements, track your progress, and adjust your plan as needed so you can focus on what you do best.
        </p>
      </div>
    </div>
    <button><a href="/auth/login" class="login button">Get Started</a></button>
  </section>
  <section id="team">
    <h2>Meet the team</h2>
    <ul>
      <a href="#team" style="cursor: pointer; color: var(--gray)" id="designSelection" onclick="showDesign()"><li>Design</li></a>
      <a href="#team" style="cursor: pointer; color: var(--gray)" id="engineeringSelection" onclick="showEngineering()"><li>Engineering</li></a>
      <a href="#team" style="cursor: pointer; color: var(--gray)" id="productSelection" onclick="showProduct()"><li>Product</li></a>
    </ul>
    <div id="designTeam" class="team">
      <div class="member">
        <img src="./team/Aanos.jpeg" width="200px" height="200px" alt="Person">
        <h4>Aanos Mahmood</h4>
        <h5>Design Lead</h5>
      </div>
      <div class="member">
        <img src="./team/hilary.jpeg" alt="Person">
        <h4>Hilary Nguyen</h4>
        <h5>Designer</h5>
      </div>
      <div class="member">
        <img src="./team/Solomon (1).jpeg" width="200px" alt="Person">
        <h4>Solomon Wakhungu</h4>
        <h5>Designer</h5>
      </div>
    </div>
    <div id="engineeringTeam" class="team">
      <div class="member">
        <img src="./team/Caleb.jpeg" alt="Person">
        <h4>Caleb Lim</h4>
        <h5>Project Lead</h5>
      </div>
      <div class="member">
        <img src="./team/Aravindan.jpeg" alt="Person">
        <h4>Aravindan Kasiraman</h4>
        <h5>Developer</h5>
      </div>
      <div class="member">
        <img src="./team/Jason.jpeg" alt="Person">
        <h4>Jason Antwi-Appah</h4>
        <h5>Developer</h5>
      </div>
      <div class="member">
        <img src="./team/Kevin.jpeg" alt="Person">
        <h4>Kevin Ge</h4>
        <h5>Developer</h5>
      </div>
      <div class="member">
        <img src="./team/JCGarza.jpeg" alt="Person">
        <h4>JC Garza</h4>
        <h5>Developer</h5>
      </div>
      <div class="member">
        <img src="./team/Saidarsh.jpeg" alt="Person">
        <h4>Saidarsh Tukkadi</h4>
        <h5>Developer</h5>
      </div>
      <div class="member">
        <img src="./team/Loki.jpeg" alt="Person">
        <h4>Lokesh Yerneni</h4>
        <h5>Developer</h5>
      </div>
    </div>
    <div id="productTeam" class="team">
      <div class="member">
        <img src="./team/stephanie.jpg" alt="Person">
        <h4>Stephanie Li</h4>
        <h5>Product Lead</h5>
      </div>
    </div>
  </section>
  <section id="plan">
    <div>
      <h2>Explore the Possibilities with Nebula Planner!</h2>
      <button><a href="/auth/login" class="button login">Get Started</a></button>
    </div>
    <img src="./graduation.jpg" alt="Graduation">
  </section>
  <section id="contact">
    <h2>Contact Us</h2>
    <form id="contactForm">
      <div>
        <img src="./icons8-mail-96.png" alt="Mail">
        <h3>Email</h3>
        <p>planner@utdallas.edu</p>
      </div>
      <hr>
      <div>
        <div class="inputField">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email">
        </div>
        <div class="inputField">
          <label for="message">Message</label>
          <textarea id="message" rows="6" placeholder="Your message"></textarea>
        </div>
        <button class="button login">Send now</button>
      </div>
    </form>
  </section>
</main>
<footer>
  <h1>planner.</h1>
  <hr>
  <p>Copyright © 2023. All rights reserved</p>
</footer>
<script>
  function showDesign() {
    document.getElementById("designTeam").classList.add("active");
    document.getElementById("engineeringTeam").classList.remove("active");
    document.getElementById("productTeam").classList.remove("active");

    document.getElementById("designSelection").classList.add("selectedTeam");
    document.getElementById("engineeringSelection").classList.remove("selectedTeam");
    document.getElementById("productSelection").classList.remove("selectedTeam");
  }
  function showEngineering() {
    document.getElementById("designTeam").classList.remove("active");
    document.getElementById("engineeringTeam").classList.add("active");
    document.getElementById("productTeam").classList.remove("active");

    document.getElementById("designSelection").classList.remove("selectedTeam");
    document.getElementById("engineeringSelection").classList.add("selectedTeam");
    document.getElementById("productSelection").classList.remove("selectedTeam");
  }
  function showProduct() {
    document.getElementById("designTeam").classList.remove("active");
    document.getElementById("engineeringTeam").classList.remove("active");
    document.getElementById("productTeam").classList.add("active");

    document.getElementById("designSelection").classList.remove("selectedTeam");
    document.getElementById("engineeringSelection").classList.remove("selectedTeam");
    document.getElementById("productSelection").classList.add("selectedTeam");
  }

  showDesign();
  
  document.querySelector("#contactForm").addEventListener("submit", e => {
    e.preventDefault();
    fetch("/api/mail", {
      method: "POST",
      body: JSON.stringify({
        email: document.querySelector("#email").value,
        message: document.querySelector("#message").value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(response => response.json()).then(json => alert("Email has been sent!"));
  });
</script>
</body>
</html>`;
