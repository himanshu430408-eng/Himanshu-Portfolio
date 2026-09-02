function initContact() {

    const form = document.getElementById("contactForm");
    const status = document.getElementById("contactStatus");
    const submitButton = document.querySelector(".contact-submit");

    if (!form) return;

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const subject = document.getElementById("contactSubject").value.trim();
        const message = document.getElementById("contactMessage").value.trim();

        if (!name || !email || !subject || !message) {
            showStatus("[ ERROR ] All fields are required.", "error");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showStatus("[ ERROR ] Invalid email address.", "error");
            return;
        }

        submitButton.disabled = true;
        submitButton.innerHTML =
            '<i class="fas fa-circle-notch fa-spin"></i> Transmitting...';

        showStatus(
            "[ SYSTEM ] Establishing secure connection...",
            ""
        );

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/api/contact",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        subject: subject,
                        message: message
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Message transmission failed."
                );
            }

            showStatus(
                "[ SUCCESS ] Message transmitted successfully.",
                "success"
            );

            form.reset();

        } catch (error) {

            console.error("CONTACT ERROR:", error);

            showStatus(
                "[ ERROR ] Unable to send message. Backend may be offline.",
                "error"
            );

        } finally {

            submitButton.disabled = false;

            submitButton.innerHTML =
                '<i class="fas fa-paper-plane"></i> Send Message';

        }

    });


    function showStatus(message, type) {

        if (!status) return;

        status.textContent = message;

        status.classList.remove(
            "success",
            "error"
        );

        if (type) {
            status.classList.add(type);
        }

    }

}