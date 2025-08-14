document.addEventListener("DOMContentLoaded", function () {
    const shortenBtn = document.getElementById("shorten-btn");
    const urlInput = document.getElementById("url-input");
    const resultDiv = document.getElementById("result");

    shortenBtn.addEventListener("click", async function () {
        const longUrl = urlInput.value.trim();

        if (!longUrl) {
            resultDiv.innerHTML = "<p style='color:red;'>Please enter a URL</p>";
            return;
        }

        try {
            // Send the long URL to Django backend
            let response = await fetch("/shorten/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken() // Django requires CSRF token for POST
                },
                body: JSON.stringify({ url: longUrl })
            });

            let data = await response.json();

            if (data.short_url) {
                resultDiv.innerHTML = `
                    <p>Shortened URL: 
                        <a href="${data.short_url}" target="_blank">${data.short_url}</a>
                    </p>
                `;
            } else {
                resultDiv.innerHTML = "<p style='color:red;'>Error: Could not shorten URL</p>";
            }

        } catch (error) {
            console.error(error);
            resultDiv.innerHTML = "<p style='color:red;'>Something went wrong</p>";
        }
    });

    // Function to get CSRF token from cookies
    function getCSRFToken() {
        let name = "csrftoken=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
});
