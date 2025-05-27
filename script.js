//execute after DOM loaded
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".main");
    const filterSelect = document.getElementById("filterSelect");
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const close = document.querySelector(".close");
    const toggleButton = document.getElementById("themeToggle");

    let cards = [];

    //sorting al the cards if exists
    if (container) {
        cards = Array.from(container.querySelectorAll(".cards"));
    }

    // Filtering Function based on selection of range
    const filterCards = () => {
        if (!container || !filterSelect) return;

        //filter card based on the selected value
        const filteredCards = cards.filter(card => {
            const year = parseInt(card.dataset.year, 10);
            switch (filterSelect.value) {
                case "before1900":
                    return year < 1900;
                case "1900to1930":
                    return year >= 1900 && year <= 1930;
                case "after1930":
                    return year > 1930;
                default:
                    return true; //return true if no filter selected
            }
        });

        // Clear existing cards and append filtered ones
        container.innerHTML = "";
        filteredCards.forEach(card => container.appendChild(card));
    };

    // an event listener for dropdown
    filterSelect?.addEventListener("change", filterCards);
    filterCards(); // Initial render

    // Modal Logic to preview an image
    let scale = 1; //default size for zoom

    //click event to each image inside cards
    document.querySelectorAll(".cards img").forEach(img => {
        img.addEventListener("click", () => {
            if (!modal || !modalImg) return;
            modal.style.display = "block";
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            scale = 1;
            modalImg.style.transform = `scale(${scale})`;
        });
    });

    // Close modal on clicking X button
    close?.addEventListener("click", () => {
        modal.style.display = "none";
        resetZoom();
    });

    // Close modal on background is clicked
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            resetZoom();
        }
    });

    // Zoom the image using mouse wheel
    modalImg?.addEventListener("wheel", (e) => {
        e.preventDefault();
        scale += (e.deltaY < 0) ? 0.1 : -0.1;
        scale = Math.max(1, scale); //maxium output for zooming
        modalImg.style.transform = `scale(${scale})`;
    });

    // Reset zoom on double click
    modalImg?.addEventListener("dblclick", () => {
        resetZoom();
    });

    function resetZoom() {
        scale = 1;
        if (modalImg) {
            modalImg.style.transform = `scale(1)`;
        }
    }

    //theme toggle logic
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.body.setAttribute("data-theme", savedTheme); //apply teh selected theme that is saved
    }

    //toogle button for switching themes
    toggleButton.addEventListener("click", () => {
        const currentTheme = document.body.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        //update toggle button icon
        toggleButton.textContent = newTheme === "dark" ? "☀️" : "🌙";

        //apply the theme on clicling the button and saving in
        if (newTheme === "dark") {
        document.body.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        } else {
        document.body.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        }
    });
});
