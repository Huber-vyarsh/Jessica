document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const elDays = document.getElementById("cd-days");
    const elHours = document.getElementById("cd-hours");
    const elMinutes = document.getElementById("cd-minutes");
    const elSeconds = document.getElementById("cd-seconds");
    const displayDate = document.getElementById("display-date");

    // Initialize display date from config
    displayDate.innerText = PROJECT_CONFIG.birthday.displayDate;

    // Parse target date (Native JS Date object handles ISO 8601 with offset properly)
    const targetDate = new Date(PROJECT_CONFIG.birthday.targetDate).getTime();
    let isUnlocked = false;
    let animationFrameId;

    function formatNumber(num) {
        return num < 10 ? `0${num}` : num;
    }

    function updateCountdown() {
        if (isUnlocked) return;

        const now = new Date().getTime();
        const difference = targetDate - now;

        // If development force unlock is on, or time is up
        if (difference <= 0 || PROJECT_CONFIG.development.forceUnlock) {
            unlockBirthday();
            return;
        }

        // Calculate time units
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Update DOM (only if values changed to prevent unnecessary repaints)
        if (elDays.innerText !== formatNumber(days)) elDays.innerText = formatNumber(days);
        if (elHours.innerText !== formatNumber(hours)) elHours.innerText = formatNumber(hours);
        if (elMinutes.innerText !== formatNumber(minutes)) elMinutes.innerText = formatNumber(minutes);
        if (elSeconds.innerText !== formatNumber(seconds)) elSeconds.innerText = formatNumber(seconds);

        // Request next frame (smoother than setInterval)
        animationFrameId = requestAnimationFrame(updateCountdown);
    }

    function unlockBirthday() {
        isUnlocked = true;
        cancelAnimationFrame(animationFrameId);
        
        // Zero out display
        elDays.innerText = "00";
        elHours.innerText = "00";
        elMinutes.innerText = "00";
        elSeconds.innerText = "00";

        // Dispatch Global Event! (The next modules will listen for this)
        if (PROJECT_CONFIG.development.debugMode) {
            console.log("🔒 Event Fired: birthdayUnlocked");
        }
        window.dispatchEvent(new CustomEvent("birthdayUnlocked"));
    }

    // Start engine
    animationFrameId = requestAnimationFrame(updateCountdown);
});
