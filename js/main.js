// ==============================
// HK Portfolio Loader
// ==============================

async function loadComponent(id, file) {

    const response = await fetch(file);

    const html = await response.text();

    document.getElementById(id).innerHTML = html;

}

async function loadPortfolio(){

    await loadComponent("navbar","components/navbar.html");

    await loadComponent("hero","components/hero.html");

    await loadComponent("about","components/about.html");

    await loadComponent("education","components/education.html");

    await loadComponent("skills","components/skills.html");

    await loadComponent("cyber","components/cyber.html");

    await loadComponent("projects","components/projects.html");

    await loadComponent("github","components/github.html");

    await loadComponent("certificates","components/certificates.html");

    await loadComponent("contact-root","components/contact.html");

    if(typeof initMatrix==="function") initMatrix();




    // NOW initialize scripts

    if(typeof initNavbar==="function") initNavbar();

    if(typeof initTyping==="function") initTyping();

    if(typeof initTerminal==="function") initTerminal();

    if(typeof initScroll==="function") initScroll();

    if(typeof initContact==="function") initContact();

}

window.onload=loadPortfolio;