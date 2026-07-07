// ======================================
// CHECK LOGIN
// ======================================

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {

    alert("Please login first.");

    window.location.href = "login.html";

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
// GET APPOINTMENTS
// ======================================

let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

// Show only current user's appointments

appointments = appointments.filter(function (appointment) {

    return appointment.patientEmail === loggedInUser.email;

});

// ======================================
// DISPLAY APPOINTMENTS
// ======================================

function displayAppointments(list) {

    const table = document.getElementById("appointmentTable");

    const emptyMessage = document.getElementById("noAppointments");

    table.innerHTML = "";

    if (list.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }

    emptyMessage.style.display = "none";

    list.forEach(function (appointment, index) {

        table.innerHTML += `

        <tr>

            <td>${appointment.doctor}</td>

            <td>${appointment.department}</td>

            <td>${appointment.date}</td>

            <td>${appointment.time}</td>

            <td>${appointment.symptoms}</td>

            <td class="status">${appointment.status}</td>

            <td>

                <button
                    class="cancel-btn"
                    onclick="cancelAppointment(${index})"
                >

                    Cancel

                </button>

            </td>

        </tr>

        `;

    });

}

// ======================================
// CANCEL APPOINTMENT
// ======================================

function cancelAppointment(index) {

    window.customConfirm("Do you want to cancel this appointment?", function(confirmed) {
        if (!confirmed) return;

        let allAppointments =
            JSON.parse(localStorage.getItem("appointments")) || [];

        const userAppointments = allAppointments.filter(function (appointment) {

            return appointment.patientEmail === loggedInUser.email;

        });

        const appointmentToDelete = userAppointments[index];

        allAppointments = allAppointments.filter(function (appointment) {

            return !(
                appointment.patientEmail === appointmentToDelete.patientEmail &&
                appointment.doctor === appointmentToDelete.doctor &&
                appointment.date === appointmentToDelete.date &&
                appointment.time === appointmentToDelete.time
            );

        });

        localStorage.setItem(
            "appointments",
            JSON.stringify(allAppointments)
        );

        window.customAlert("Appointment Cancelled Successfully!", function() {
            location.reload();
        });
    });

}

// ======================================
// SEARCH
// ======================================

document.getElementById("searchAppointment").addEventListener("keyup", function () {

    const search = this.value.toLowerCase();

    const filtered = appointments.filter(function (appointment) {

        return (

            appointment.doctor.toLowerCase().includes(search)

            ||

            appointment.department.toLowerCase().includes(search)

        );

    });

    displayAppointments(filtered);

});

// ======================================
// LOAD DATA
// ======================================

displayAppointments(appointments);