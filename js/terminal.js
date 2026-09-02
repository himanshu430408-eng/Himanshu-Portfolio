// ==========================================
// HK CYBER PORTFOLIO
// Hacker Terminal Animation
// ==========================================

function initTerminal() {
    console.log("Terminal Started");

    const terminal = document.getElementById("terminalText");

    if (!terminal) return;

    const lines = [

        "root@himanshu:~$ whoami",
        "Himanshu Kumar",
        "",
        "root@himanshu:~$ role",
        "Cybersecurity Student",
        "",
        "root@himanshu:~$ skills",
        "Linux  |  Bash  |  Python",
        "Networking  |  C  |  C++",
        "SQL  |  Git  |  Flask",
        "",
        "root@himanshu:~$ tools",
        "Wireshark",
        "Gobuster",
        "Dirb",
        "Airmon-ng",
        "Nmap",
        "",
        "root@himanshu:~$ status",
        "Available for Internship",
        "",
        "root@himanshu:~$ _"

    ];

    let line = 0;
    let character = 0;

    function typeLine() {

        if (line >= lines.length) {

            setTimeout(() => {

                terminal.textContent = "";

                line = 0;

                character = 0;

                typeLine();

            }, 2500);

            return;

        }

        const current = lines[line];

        if (character < current.length) {

            terminal.textContent += current.charAt(character);

            character++;

            setTimeout(typeLine, 30);

        } else {

            terminal.textContent += "\n";

            line++;

            character = 0;

            terminal.scrollTop = terminal.scrollHeight;

            setTimeout(typeLine, 250);

        }

    }

    terminal.textContent = "";

    typeLine();

}