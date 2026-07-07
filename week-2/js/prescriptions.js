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
// SAMPLE PRESCRIPTIONS
// (Created only once)
// ======================================

let prescriptions = JSON.parse(localStorage.getItem("prescriptions"));

if (!prescriptions) {

    prescriptions = [

        {

            patientEmail: loggedInUser.email,

            medicine: "Paracetamol 500mg",

            dosage: "1 Tablet",

            frequency: "Morning & Night",

            startDate: "2026-07-10",

            endDate: "2026-07-15",

            doctor: "Dr. Sarah Johnson",

            status: "Active"

        },

        {

            patientEmail: loggedInUser.email,

            medicine: "Vitamin D3",

            dosage: "1 Capsule",

            frequency: "Once Daily",

            startDate: "2026-06-01",

            endDate: "2026-06-30",

            doctor: "Dr. Emily Davis",

            status: "Completed"

        }

    ];

    localStorage.setItem(

        "prescriptions",

        JSON.stringify(prescriptions)

    );

}

// ======================================
// SHOW ONLY CURRENT USER'S PRESCRIPTIONS
// ======================================

prescriptions = prescriptions.filter(function(item){

    return item.patientEmail === loggedInUser.email;

});

// ======================================
// DISPLAY PRESCRIPTIONS
// ======================================

function displayPrescriptions(list){

    const table = document.getElementById("prescriptionTable");

    const empty = document.getElementById("noPrescription");

    table.innerHTML = "";

    if(list.length === 0){

        empty.style.display = "block";

        return;

    }

    empty.style.display = "none";

    list.forEach(function(item){

        let statusClass =
            item.status === "Active"
            ? "status-active"
            : "status-completed";

        table.innerHTML += `

        <tr>

            <td>${item.medicine}</td>

            <td>${item.dosage}</td>

            <td>${item.frequency}</td>

            <td>${item.startDate}</td>

            <td>${item.endDate}</td>

            <td>${item.doctor}</td>

            <td class="${statusClass}">
                ${item.status}
            </td>

        </tr>

        `;

    });

}

// ======================================
// SEARCH MEDICINE
// ======================================

document.getElementById("searchMedicine").addEventListener("keyup", function(){

    const search = this.value.toLowerCase();

    const filtered = prescriptions.filter(function(item){

        return(

            item.medicine.toLowerCase().includes(search)

            ||

            item.doctor.toLowerCase().includes(search)

        );

    });

    displayPrescriptions(filtered);

});

// ======================================
// LOAD DATA
// ======================================

displayPrescriptions(prescriptions);