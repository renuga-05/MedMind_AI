// ======================================
// GET LOGGED-IN USER
// ======================================

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// ======================================
// CHECK LOGIN
// ======================================

if (!loggedInUser) {

    window.customAlert("Please login first.", function() {
        window.location.href = "login.html";
    });

}

// ======================================
// DISPLAY USER DETAILS
// ======================================

document.getElementById("userName").textContent = loggedInUser.name;

document.getElementById("name").textContent = loggedInUser.name;

document.getElementById("email").textContent = loggedInUser.email;

document.getElementById("phone").textContent = loggedInUser.phone;

document.getElementById("age").textContent = loggedInUser.age;

document.getElementById("gender").textContent = loggedInUser.gender;

document.getElementById("blood").textContent = loggedInUser.blood;

// ======================================
// LOGOUT
// ======================================

document.getElementById("logoutBtn").addEventListener("click", function () {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {

        localStorage.removeItem("loggedInUser");

        alert("Logged out successfully.");

        window.location.href = "login.html";

    }

});

// ======================================
// QUICK ACTION BUTTONS
// ======================================

const buttons = document.querySelectorAll(".action-buttons button");

buttons[0].addEventListener("click", function () {

    window.location.href = "appointment.html";

});

buttons[1].addEventListener("click", function () {

    alert("Medical Records page will be developed later.");

});

buttons[2].addEventListener("click", function () {

    alert("Prescriptions page will be developed later.");

});

buttons[3].addEventListener("click", function () {

    window.location.href = "profile.html";

});
buttons[4].addEventListener("click", function () {

    window.location.href = "myappointments.html";

});