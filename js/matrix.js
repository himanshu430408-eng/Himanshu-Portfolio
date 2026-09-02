// ==========================================
// HK CYBER PORTFOLIO
// Matrix Rain Background
// ==========================================

function initMatrix() {

    const canvas = document.getElementById("matrixCanvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    const letters =
        "01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    const fontSize = 16;

    let columns = Math.floor(canvas.width / fontSize);

    let drops = [];

    function resetDrops() {
        columns = Math.floor(canvas.width / fontSize);
        drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * canvas.height / fontSize;
        }
    }

    resetDrops();

    window.addEventListener("resize", resetDrops);

    function draw() {

        ctx.fillStyle = "rgba(5,7,10,0.06)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00FF88";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {

            const text =
                letters.charAt(
                    Math.floor(Math.random() * letters.length)
                );

            ctx.fillText(
                text,
                i * fontSize,
                drops[i] * fontSize
            );

            if (
                drops[i] * fontSize > canvas.height &&
                Math.random() > 0.975
            ) {
                drops[i] = 0;
            }

            drops[i]++;

        }

        requestAnimationFrame(draw);

    }

    draw();

}