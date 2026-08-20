/* =====================================
   EDIT THESE VALUES
   ===================================== */

const PROJECT_CONFIG = {
    birthday: {
        name: "Jessica",
        // Target date in ISO 8601 format with IST offset (+05:30)
        // Format: YYYY-MM-DDTHH:mm:ss+05:30
        targetDate: "2026-09-07T12:00:00+05:30",
        displayDate: "07 · 09 · 2026"
    },

    access: {
        secretPin: "0709"
    },

    music: {
        enabled: true
    },

    development: {
        // Set to true to force UI into unlocked state without PIN
        forceUnlock: false,
        debugMode: true
    }
};

// Expose globally
window.PROJECT_CONFIG = PROJECT_CONFIG;
