document.addEventListener("DOMContentLoaded", () => {
    const elDays = document.getElementById("cd-days");
    const elHours = document.getElementById("cd-hours");
    const elMinutes = document.getElementById("cd-minutes");
    const elSeconds = document.getElementById("cd-seconds");
    const displayDate = document.getElementById("display-date");

    displayDate.innerText = PROJECT_CONFIG.birthday.displayDate;
    const targetDate = new Date(PROJECT_CONFIG.birthday.targetDate).getTime();
    let isUnlocked = false;
    let animationFrameId;

    function formatNumber(num) {
        return num < 10 ? `0${num}` : num;
    }

    // Function to update number and trigger a slight pulse animation
    function updateDOMElement(element, newValue) {
        const formattedValue = formatNumber(newValue);
        if (element.innerText !== formattedValue) {
            element.innerText = formattedValue;
            
            // Trigger CSS pulse animation
            element.classList.remove("tick-pulse");
            void element.offsetWidth; // Trigger reflow to restart animation
            element.classList.add("tick-pulse");
            
            // Remove the pulse class shortly after so it settles back to normal glow
            setTimeout(() => {
                element.classList.remove("tick-pulse");
            }, 150);
        }
    }

    function updateCountdown() {
        if (isUnlocked) return;

        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0 || PROJECT_CONFIG.development.forceUnlock) {
            unlockBirthday();
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        updateDOMElement(elDays, days);
        updateDOMElement(elHours, hours);
        updateDOMElement(elMinutes, minutes);
        updateDOMElement(elSeconds, seconds);

        animationFrameId = requestAnimationFrame(updateCountdown);
    }

    function unlockBirthday() {
        isUnlocked = true;
        cancelAnimationFrame(animationFrameId);
        
        elDays.innerText = "00";
        elHours.innerText = "00";
        elMinutes.innerText = "00";
        elSeconds.innerText = "00";

        if (PROJECT_CONFIG.development.debugMode) {
            console.log("🔒 Event Fired: birthdayUnlocked");
        }
        window.dispatchEvent(new CustomEvent("birthdayUnlocked"));
    }

    animationFrameId = requestAnimationFrame(updateCountdown);
});
