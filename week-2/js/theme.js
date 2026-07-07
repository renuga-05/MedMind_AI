// theme.js - MedMind AI Soothing Health Theme Loader & Global Utility Script
(function () {
    try {
        const savedSettings = JSON.parse(localStorage.getItem("userSettings"));
        // Default to dark theme if no settings or if darkMode is explicitly true
        if (!savedSettings || savedSettings.darkMode !== false) {
            document.documentElement.classList.remove('light-theme');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.add('light-theme');
            document.documentElement.setAttribute('data-theme', 'light');
        }
    } catch (e) {
        console.error("Error loading theme settings:", e);
    }
})();

// Inject preloader on DOM Content Loaded
document.addEventListener("DOMContentLoaded", function() {
    // 1. Create page-loader element
    const loader = document.createElement("div");
    loader.id = "medmind-loader";
    loader.className = "page-loader active";
    loader.innerHTML = `
        <div class="loader-content">
            <div class="medical-icon-container">🏥</div>
            <svg class="heartbeat-svg" viewBox="0 0 150 50">
                <path class="pulse-line" d="M0,25 L30,25 L40,10 L50,40 L60,15 L70,30 L80,25 L150,25" />
            </svg>
            <div class="loader-text">Loading MedMind AI...</div>
        </div>
    `;
    document.body.appendChild(loader);

    // Fade out loader after window load
    const fadeOutLoader = function() {
        setTimeout(function() {
            loader.classList.remove("active");
            loader.classList.add("fade-out");
            setTimeout(() => loader.remove(), 400);
        }, 750); // 750ms minimum duration for premium EKG feel
    };

    if (document.readyState === "complete") {
        fadeOutLoader();
    } else {
        window.addEventListener("load", fadeOutLoader);
    }

    // 2. Centralized Logout Hijack & Profile Button Injection
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        // Inject Profile Button next to Logout Button if not already there
        if (!document.getElementById("globalProfileBtn")) {
            const profileBtn = document.createElement("button");
            profileBtn.id = "globalProfileBtn";
            profileBtn.className = "header-profile-btn";
            profileBtn.title = "View Profile";
            profileBtn.innerHTML = "👤";
            profileBtn.addEventListener("click", function() {
                window.location.href = "profile.html";
            });
            logoutBtn.parentNode.insertBefore(profileBtn, logoutBtn);
        }

        // Clone and replace button to discard any page-specific synchronous alert event listeners
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
        
        newLogoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            window.customConfirm("Are you sure you want to logout?", function(confirmed) {
                if (confirmed) {
                    localStorage.removeItem("loggedInUser");
                    window.customAlert("Logged out Successfully!", function() {
                        window.location.href = "login.html";
                    });
                }
            });
        });
    }

    // 3. Inject Chatbot Script if user is logged in (excluding login and register pages)
    const isAuthPage = window.location.pathname.includes("login.html") || window.location.pathname.includes("register.html");
    if (!isAuthPage && localStorage.getItem("loggedInUser") && !document.getElementById("medmind-chatbot-script")) {
        const chatScript = document.createElement("script");
        chatScript.id = "medmind-chatbot-script";
        chatScript.src = "js/chatbot.js";
        document.body.appendChild(chatScript);
    }
});

// ==========================================
// GLOBAL CUSTOM ALERTS & CONFIRM OVERRIDES
// ==========================================

window.customAlert = function(message, callback) {
    const existing = document.getElementById("custom-alert-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "custom-alert-overlay";
    overlay.className = "custom-modal-overlay";
    overlay.innerHTML = `
        <div class="custom-modal">
            <span class="modal-icon">🩺</span>
            <div class="modal-message"></div>
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-primary" id="alert-ok-btn">OK</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.querySelector(".modal-message").textContent = message;
    
    setTimeout(() => overlay.classList.add("active"), 10);
    
    overlay.querySelector("#alert-ok-btn").addEventListener("click", function() {
        overlay.classList.remove("active");
        setTimeout(() => {
            overlay.remove();
            if (callback) callback();
        }, 300);
    });
};

// Override window.alert
window.alert = function(message) {
    window.customAlert(message);
};

window.customConfirm = function(message, onConfirm) {
    const existing = document.getElementById("custom-confirm-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "custom-confirm-overlay";
    overlay.className = "custom-modal-overlay";
    overlay.innerHTML = `
        <div class="custom-modal">
            <span class="modal-icon">❓</span>
            <div class="modal-message"></div>
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-secondary" id="confirm-cancel-btn">Cancel</button>
                <button class="modal-btn modal-btn-primary" id="confirm-ok-btn">OK</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.querySelector(".modal-message").textContent = message;
    
    setTimeout(() => overlay.classList.add("active"), 10);
    
    overlay.querySelector("#confirm-ok-btn").addEventListener("click", function() {
        overlay.classList.remove("active");
        setTimeout(() => {
            overlay.remove();
            if (onConfirm) onConfirm(true);
        }, 300);
    });
    
    overlay.querySelector("#confirm-cancel-btn").addEventListener("click", function() {
        overlay.classList.remove("active");
        setTimeout(() => {
            overlay.remove();
            if (onConfirm) onConfirm(false);
        }, 300);
    });
};

window.showSecuringLoader = function(message, callback) {
    const loader = document.createElement("div");
    loader.id = "medmind-securing-loader";
    loader.className = "page-loader active";
    loader.innerHTML = `
        <div class="loader-content">
            <div class="medical-icon-container">🏥</div>
            <svg class="heartbeat-svg" viewBox="0 0 150 50">
                <path class="pulse-line" d="M0,25 L30,25 L40,10 L50,40 L60,15 L70,30 L80,25 L150,25" />
            </svg>
            <div class="loader-text" style="font-size: 14px; max-width: 320px; line-height: 1.5;">${message || "Securing Connection..."}</div>
        </div>
    `;
    document.body.appendChild(loader);

    setTimeout(function() {
        loader.classList.remove("active");
        loader.classList.add("fade-out");
        setTimeout(() => {
            loader.remove();
            if (callback) callback();
        }, 400);
    }, 1500); // 1.5 seconds loading experience
};
