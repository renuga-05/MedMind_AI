// ======================================
// CHECK LOGIN
// ======================================

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {

    window.customAlert("Please login first.", function() { window.location.href = "login.html"; });

}

// ======================================
// LOGOUT
// ======================================

document.getElementById("logoutBtn").addEventListener("click", function () {

    if (confirm("Are you sure you want to logout?")) {

        localStorage.removeItem("loggedInUser");

        alert("Logged out Successfully!");

        window.location.href = "login.html";

    }

});

// ======================================
// LOAD SAVED SETTINGS
// ======================================

const savedSettings = JSON.parse(localStorage.getItem("userSettings")) || {

    notifications: true,

    darkMode: true,

    language: "English"

};

document.getElementById("notificationToggle").checked =
savedSettings.notifications;

document.getElementById("darkModeToggle").checked =
savedSettings.darkMode;

document.getElementById("languageSelect").value =
savedSettings.language;

// ======================================
// APPLY DARK MODE
// ======================================

if(savedSettings.darkMode){
    document.documentElement.classList.remove('light-theme');
    document.documentElement.setAttribute('data-theme', 'dark');
}
else{
    document.documentElement.classList.add('light-theme');
    document.documentElement.setAttribute('data-theme', 'light');
}

// ======================================
// DARK MODE TOGGLE
// ======================================

document.getElementById("darkModeToggle").addEventListener("change",function(){

    if(this.checked){
        document.documentElement.classList.remove('light-theme');
        document.documentElement.setAttribute('data-theme', 'dark');
    }else{
        document.documentElement.classList.add('light-theme');
        document.documentElement.setAttribute('data-theme', 'light');
    }

});

// ======================================
// EDIT PROFILE
// ======================================

document.getElementById("editProfileBtn").addEventListener("click",function(){

    window.location.href = "profile.html";

});

// ======================================
// CHANGE PASSWORD
// ======================================

document.getElementById("changePasswordBtn").addEventListener("click",function(){

    alert(

        "Change Password feature will be connected after backend integration."

    );

});

// ======================================
// SAVE SETTINGS
// ======================================

document.getElementById("saveSettings").addEventListener("click",function(){

    const settings = {

        notifications:
        document.getElementById("notificationToggle").checked,

        darkMode:
        document.getElementById("darkModeToggle").checked,

        language:
        document.getElementById("languageSelect").value

    };

    localStorage.setItem(

        "userSettings",

        JSON.stringify(settings)

    );

    alert("Settings saved successfully!");

});

// ======================================
// LANGUAGE CHANGE
// ======================================

document.getElementById("languageSelect").addEventListener("change",function(){

    console.log("Language Selected:", this.value);

});