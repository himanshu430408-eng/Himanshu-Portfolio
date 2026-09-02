// ==========================================
// HK CYBER PORTFOLIO
// Typing Animation
// ==========================================

function initTyping() {

    const typing = document.getElementById("typing");

    if (!typing) return;

    const words = [

        "Cybersecurity Student",
        "Ethical Hacking Learner",
        "Linux Enthusiast",
        "Cloud Computing Student",
        "Python Developer",
        "CTF Player",
        "Future Security Engineer"

    ];

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {

        const currentWord = words[wordIndex];

        if (!deleting) {

            typing.textContent = currentWord.substring(0, charIndex);

            charIndex++;

            if (charIndex > currentWord.length) {

                deleting = true;

                setTimeout(type, 1200);

                return;
            }

        } else {

            typing.textContent = currentWord.substring(0, charIndex);

            charIndex--;

            if (charIndex < 0) {

                deleting = false;

                wordIndex++;

                if (wordIndex >= words.length) {

                    wordIndex = 0;

                }

            }

        }

        setTimeout(type, deleting ? 45 : 90);

    }

    type();

}