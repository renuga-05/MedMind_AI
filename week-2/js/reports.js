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
// GET DATA FROM LOCAL STORAGE
// ======================================

const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

const medicalRecords = JSON.parse(localStorage.getItem("medicalRecords")) || [];

const prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];

// ======================================
// FILTER CURRENT USER DATA
// ======================================

const userAppointments = appointments.filter(function(item){

    return item.patientEmail === loggedInUser.email;

});

const userRecords = medicalRecords.filter(function(item){

    return item.patientEmail === loggedInUser.email;

});

const userPrescriptions = prescriptions.filter(function(item){

    return item.patientEmail === loggedInUser.email;

});

// ======================================
// UPDATE SUMMARY CARDS
// ======================================

document.getElementById("appointmentCount").textContent =
userAppointments.length;

document.getElementById("recordCount").textContent =
userRecords.length;

const activeMedicines = userPrescriptions.filter(function(item){

    return item.status === "Active";

});

document.getElementById("prescriptionCount").textContent =
activeMedicines.length;

// ======================================
// RECENT ACTIVITY
// ======================================

const activityTable = document.getElementById("activityTable");

activityTable.innerHTML = "";

userAppointments.forEach(function(item){

    activityTable.innerHTML += `

    <tr>

        <td>${item.date}</td>

        <td>Appointment with ${item.doctor}</td>

        <td>${item.status}</td>

    </tr>

    `;

});

userRecords.forEach(function(item){

    activityTable.innerHTML += `

    <tr>

        <td>${item.visitDate}</td>

        <td>Medical Record - ${item.department}</td>

        <td>Completed</td>

    </tr>

    `;

});

// ======================================
// NO ACTIVITY
// ======================================

if(activityTable.innerHTML === ""){

    activityTable.innerHTML = `

    <tr>

        <td colspan="3">

            No recent activity available.

        </td>

    </tr>

    `;

}

// ======================================
// DOWNLOAD REPORT
// ======================================

document.getElementById("downloadReport").addEventListener("click",function(){
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header Title
        doc.setFillColor(59, 107, 96);
        doc.rect(0, 0, 210, 40, "F");
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("MEDMIND AI - HEALTH PORTAL", 15, 25);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Secure Patient Medical Record Summary", 15, 32);

        // Document Details (Metadata)
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(9);
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        doc.text("Generated: " + currentDate, 135, 25);

        // Section: Patient Demographics
        doc.setTextColor(44, 62, 80);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("PATIENT DEMOGRAPHICS", 15, 55);
        doc.setLineWidth(0.5);
        doc.setDrawColor(130, 196, 181);
        doc.line(15, 57, 195, 57);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text("Name: " + loggedInUser.name, 15, 66);
        doc.text("Email: " + loggedInUser.email, 15, 73);
        doc.text("Age: " + (loggedInUser.age || "---"), 110, 66);
        doc.text("Gender: " + (loggedInUser.gender || "---"), 110, 73);
        doc.text("Blood Group: " + (loggedInUser.blood || "---"), 110, 80);
        doc.text("Phone: " + (loggedInUser.phone || "---"), 15, 80);

        // Section: Health Summary Statistics
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("HEALTH SUMMARY METRICS", 15, 95);
        doc.line(15, 97, 195, 97);

        // Draw styled boxes for metrics
        // Box 1: Appointments
        doc.setFillColor(244, 248, 247);
        doc.rect(15, 103, 55, 25, "F");
        doc.setDrawColor(220, 220, 220);
        doc.rect(15, 103, 55, 25, "S");
        doc.setTextColor(59, 107, 96);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(String(userAppointments.length), 42, 114, { align: "center" });
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Appointments", 42, 122, { align: "center" });

        // Box 2: Medical Records
        doc.setFillColor(244, 248, 247);
        doc.rect(77, 103, 55, 25, "F");
        doc.rect(77, 103, 55, 25, "S");
        doc.setTextColor(59, 107, 96);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(String(userRecords.length), 104, 114, { align: "center" });
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Medical Records", 104, 122, { align: "center" });

        // Box 3: Prescriptions
        doc.setFillColor(244, 248, 247);
        doc.rect(140, 103, 55, 25, "F");
        doc.rect(140, 103, 55, 25, "S");
        doc.setTextColor(59, 107, 96);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(String(activeMedicines.length), 167, 114, { align: "center" });
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Active Medicines", 167, 122, { align: "center" });

        // Section: Recent Logged Activities
        doc.setTextColor(44, 62, 80);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("RECENT HEALTH ACTIVITY LOG", 15, 142);
        doc.setDrawColor(130, 196, 181);
        doc.line(15, 144, 195, 144);

        let y = 154;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setFillColor(235, 242, 240);
        doc.rect(15, y - 5, 180, 7, "F");
        doc.setTextColor(59, 107, 96);
        doc.text("DATE", 18, y);
        doc.text("ACTIVITY DESCRIPTION", 60, y);
        doc.text("STATUS", 160, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(44, 62, 80);
        
        let hasActivity = false;
        
        userAppointments.forEach(function(item) {
            hasActivity = true;
            y += 8;
            if (y > 260) { doc.addPage(); y = 20; }
            doc.text(item.date, 18, y);
            doc.text("Appointment with " + item.doctor + " (" + item.department + ")", 60, y);
            doc.text(item.status, 160, y);
        });

        userRecords.forEach(function(item) {
            hasActivity = true;
            y += 8;
            if (y > 260) { doc.addPage(); y = 20; }
            doc.text(item.visitDate, 18, y);
            doc.text("Medical Record - Diagnosis: " + item.diagnosis, 60, y);
            doc.text("Completed", 160, y);
        });

        if (!hasActivity) {
            y += 10;
            doc.setFont("helvetica", "italic");
            doc.setTextColor(120, 120, 120);
            doc.text("No recent activities registered.", 18, y);
        }

        // Footer
        doc.setDrawColor(220, 220, 220);
        doc.line(15, 275, 195, 275);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("This is an automatically generated health summary document. Securely processed by MedMind AI.", 15, 280);
        doc.text("Page 1 of 1", 180, 280);

        doc.save("MedMind_Health_Report_" + loggedInUser.name.replace(/\s+/g, '_') + ".pdf");
    } catch (e) {
        console.error("Failed to generate PDF:", e);
        window.customAlert("An error occurred while generating your PDF. Please try again.");
    }
});