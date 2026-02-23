document.addEventListener("DOMContentLoaded", function() {
    // Create the toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "dark-mode-toggle";
    toggleBtn.innerHTML = "🌙";
    toggleBtn.setAttribute("aria-label", "Toggle Dark Mode");
    document.body.appendChild(toggleBtn);

    // Check for saved user preference
    const currentTheme = localStorage.getItem("theme");
    
    // Apply the saved theme on load
    if (currentTheme === "dark") {
        document.documentElement.classList.add("dark-mode");
        toggleBtn.innerHTML = "☀️";
    }

    // Toggle the theme on click
    toggleBtn.addEventListener("click", function() {
        document.documentElement.classList.toggle("dark-mode");
        
        let theme = "light";
        if (document.documentElement.classList.contains("dark-mode")) {
            theme = "dark";
            toggleBtn.innerHTML = "☀️";
        } else {
            toggleBtn.innerHTML = "🌙";
        }
        
        localStorage.setItem("theme", theme);
    });
});
