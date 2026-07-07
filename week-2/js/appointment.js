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

    const logout = confirm("Are you sure you want to logout?");

    if (logout) {

        localStorage.removeItem("loggedInUser");

        alert("Logged out successfully.");

        window.location.href = "login.html";

    }

});

// ======================================
// BOOK APPOINTMENT
// ======================================

document.getElementById("appointmentForm").addEventListener("submit", function (event) {

    event.preventDefault();

    const doctor = document.getElementById("doctor").value;
    const department = document.getElementById("department").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const symptoms = document.getElementById("symptoms").value.trim();

    // ==========================
    // VALIDATION
    // ==========================

    if (
        doctor === "" ||
        department === "" ||
        date === "" ||
        time === "" ||
        symptoms === ""
    ) {

        alert("Please fill all fields.");

        return;

    }

    // ==========================
    // CREATE APPOINTMENT OBJECT
    // ==========================

    const appointment = {

        patientName: loggedInUser.name,

        patientEmail: loggedInUser.email,

        doctor: doctor,

        department: department,

        date: date,

        time: time,

        symptoms: symptoms,

        status: "Confirmed"

    };

    // ==========================
    // GET EXISTING APPOINTMENTS
    // ==========================

    let appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    // ==========================
    // ADD NEW APPOINTMENT
    // ==========================

    appointments.push(appointment);

    // ==========================
    // SAVE TO LOCAL STORAGE
    // ==========================

    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );

    // ==========================
    // SUCCESS MESSAGE
    // ==========================

    alert("Appointment Booked Successfully!");

    // ==========================
    // CLEAR FORM
    // ==========================

    document.getElementById("appointmentForm").reset();

    // ==========================
    // NEXT PAGE
    // ==========================

    // We will create this page next

    window.location.href = "myappointments.html";

});