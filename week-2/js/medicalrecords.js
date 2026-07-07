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
// SAMPLE MEDICAL RECORDS
// (Only created once)
// ======================================

let medicalRecords = JSON.parse(localStorage.getItem("medicalRecords"));

if (!medicalRecords) {

    medicalRecords = [

        {

            patientEmail: loggedInUser.email,

            visitDate: "2026-07-10",

            doctor: "Dr. Sarah Johnson",

            department: "Cardiology",

            diagnosis: "Mild Chest Pain",

            prescription: "Paracetamol 500mg",

            labReport: "Blood Test - Normal"

        },

        {

            patientEmail: loggedInUser.email,

            visitDate: "2026-06-15",

            doctor: "Dr. Emily Davis",

            department: "Dermatology",

            diagnosis: "Skin Allergy",

            prescription: "Cetirizine",

            labReport: "Skin Test - Mild Allergy"

        }

    ];

    localStorage.setItem(

        "medicalRecords",

        JSON.stringify(medicalRecords)

    );

}

// ======================================
// SHOW ONLY CURRENT USER RECORDS
// ======================================

medicalRecords = medicalRecords.filter(function(record){

    return record.patientEmail === loggedInUser.email;

});

// ======================================
// DISPLAY RECORDS
// ======================================

function displayRecords(records){
    const grid = document.getElementById("recordsGrid");
    const empty = document.getElementById("noRecords");
    
    grid.innerHTML = "";

    if(records.length === 0){
        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";

    records.forEach(function(record){
        let deptClass = "dept-general";
        const dept = record.department.toLowerCase();
        if (dept.includes("cardio")) deptClass = "dept-cardiology";
        else if (dept.includes("derm")) deptClass = "dept-dermatology";

        grid.innerHTML += `
        <div class="record-card">
            <div class="record-card-header">
                <span class="record-date">📅 ${record.visitDate}</span>
                <span class="dept-badge ${deptClass}">${record.department}</span>
            </div>
            <div class="record-doc">👨‍⚕️ ${record.doctor}</div>
            <div class="record-diag-block">
                <span class="record-diag-label">Diagnosis</span>
                <span class="record-diag-val">${record.diagnosis}</span>
            </div>
            <div class="record-details-mini">
                <div>💊 <strong>Prescription:</strong> ${record.prescription}</div>
                <div>🧪 <strong>Lab Work:</strong> ${record.labReport}</div>
            </div>
            <div class="record-actions-row">
                <button class="view-btn" onclick="viewRecord('${record.doctor}')">View</button>
                <button class="download-btn" onclick="downloadRecord('${record.doctor}')">Download</button>
            </div>
        </div>
        `;
    });
}

// ======================================
// VIEW REPORT
// ======================================

function viewRecord(doctor){
    const record = medicalRecords.find(function(r) { return r.doctor === doctor; });
    if (!record) {
        window.customAlert("Record not found.");
        return;
    }

    const existing = document.getElementById("detailed-record-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "detailed-record-overlay";
    overlay.className = "custom-modal-overlay";
    overlay.innerHTML = `
        <div class="custom-modal" style="max-width: 550px; text-align: left;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-color); padding-bottom: 12px; margin-bottom: 18px;">
                <h3 style="margin: 0; color: var(--primary); font-size: 20px;">📄 Medical Consultation Record</h3>
                <span style="font-size: 24px; cursor: pointer; color: var(--text-muted); font-weight: bold;" id="close-record-btn">&times;</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                    <strong style="color: var(--text-muted); font-size: 12px; text-transform: uppercase;">Doctor</strong>
                    <div style="font-size: 15px; font-weight: 600; color: var(--text-color); margin-top: 2px;">${record.doctor}</div>
                </div>
                <div>
                    <strong style="color: var(--text-muted); font-size: 12px; text-transform: uppercase;">Department</strong>
                    <div style="font-size: 15px; font-weight: 600; color: var(--text-color); margin-top: 2px;">${record.department}</div>
                </div>
                <div>
                    <strong style="color: var(--text-muted); font-size: 12px; text-transform: uppercase;">Visit Date</strong>
                    <div style="font-size: 15px; font-weight: 600; color: var(--text-color); margin-top: 2px;">${record.visitDate}</div>
                </div>
                <div>
                    <strong style="color: var(--text-muted); font-size: 12px; text-transform: uppercase;">Lab Status</strong>
                    <div style="font-size: 15px; font-weight: 600; color: var(--text-color); margin-top: 2px;">${record.labReport}</div>
                </div>
            </div>
            <div style="margin-bottom: 15px; background: var(--primary-light); padding: 12px; border-radius: 8px; border-left: 4px solid var(--primary);">
                <strong style="color: var(--primary); font-size: 13px; text-transform: uppercase;">Diagnosis</strong>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: var(--text-color); font-weight: 500;">${record.diagnosis}</p>
            </div>
            <div style="margin-bottom: 22px; background: var(--primary-light); padding: 12px; border-radius: 8px; border-left: 4px solid var(--primary);">
                <strong style="color: var(--primary); font-size: 13px; text-transform: uppercase;">Prescribed Medication</strong>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: var(--text-color); font-weight: 500; font-family: monospace;">${record.prescription}</p>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button class="modal-btn modal-btn-secondary" id="record-download-btn" style="padding: 10px 20px;">Download PDF</button>
                <button class="modal-btn modal-btn-primary" id="record-ok-btn" style="padding: 10px 20px;">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(function() { overlay.classList.add("active"); }, 10);

    const closeOverlay = function() {
        overlay.classList.remove("active");
        setTimeout(function() { overlay.remove(); }, 300);
    };

    overlay.querySelector("#close-record-btn").addEventListener("click", closeOverlay);
    overlay.querySelector("#record-ok-btn").addEventListener("click", closeOverlay);
    overlay.querySelector("#record-download-btn").addEventListener("click", function() {
        closeOverlay();
        downloadRecord(doctor);
    });
}

// ======================================
// DOWNLOAD REPORT
// ======================================

function downloadRecord(doctor){
    const record = medicalRecords.find(function(r) { return r.doctor === doctor; });
    if (!record) {
        window.customAlert("Record not found.");
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header Title block matching Sage Teal design
        doc.setFillColor(59, 107, 96);
        doc.rect(0, 0, 210, 45, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("MEDMIND CLINIC & HOSPITAL", 15, 25);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Official Clinical Consultation Record", 15, 33);

        // Document Details (Metadata)
        doc.setTextColor(240, 240, 240);
        doc.setFontSize(9);
        doc.text("Doc ID: REC-" + Math.floor(100000 + Math.random() * 900000), 145, 25);
        doc.text("Date Printed: " + new Date().toLocaleDateString(), 145, 31);

        // Patient Section
        doc.setTextColor(44, 62, 80);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("PATIENT DEMOGRAPHICS", 15, 60);
        doc.setLineWidth(0.5);
        doc.setDrawColor(130, 196, 181);
        doc.line(15, 62, 195, 62);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text("Patient Name: " + loggedInUser.name, 15, 71);
        doc.text("Patient Email: " + loggedInUser.email, 15, 78);
        doc.text("Age: " + (loggedInUser.age || "---"), 110, 71);
        doc.text("Gender: " + (loggedInUser.gender || "---"), 110, 78);
        doc.text("Blood Group: " + (loggedInUser.blood || "---"), 110, 85);
        doc.text("Phone: " + (loggedInUser.phone || "---"), 15, 85);

        // Medical Visit Details Section
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("CLINICAL CONSULTATION DETAILS", 15, 103);
        doc.line(15, 105, 195, 105);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Consulting Doctor:", 15, 114);
        doc.setFont("helvetica", "normal");
        doc.text(record.doctor, 60, 114);

        doc.setFont("helvetica", "bold");
        doc.text("Department:", 15, 122);
        doc.setFont("helvetica", "normal");
        doc.text(record.department, 60, 122);

        doc.setFont("helvetica", "bold");
        doc.text("Visit Date:", 15, 130);
        doc.setFont("helvetica", "normal");
        doc.text(record.visitDate, 60, 130);

        doc.setFont("helvetica", "bold");
        doc.text("Lab & Diagnostics:", 15, 138);
        doc.setFont("helvetica", "normal");
        doc.text(record.labReport, 60, 138);

        // Diagnosis Block
        doc.setFillColor(244, 248, 247);
        doc.rect(15, 148, 180, 24, "F");
        doc.setDrawColor(59, 107, 96);
        doc.setLineWidth(1);
        doc.line(15, 148, 15, 172); // left border-accent line
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(59, 107, 96);
        doc.text("PRIMARY DIAGNOSIS", 20, 155);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(44, 62, 80);
        doc.text(record.diagnosis, 20, 163);

        // Prescription Block
        doc.setFillColor(244, 248, 247);
        doc.rect(15, 180, 180, 24, "F");
        doc.line(15, 180, 15, 204); // left border-accent line
        doc.setFont("helvetica", "bold");
        doc.setTextColor(59, 107, 96);
        doc.text("PRESCRIBED MEDICATION & INSTRUCTIONS", 20, 187);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(44, 62, 80);
        doc.text(record.prescription, 20, 195);

        // Doctor Signature line
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(135, 240, 185, 240);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Authorized Signature", 140, 246);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text(record.doctor, 140, 252);

        // Footer
        doc.setDrawColor(220, 220, 220);
        doc.line(15, 275, 195, 275);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("This document is a certified patient medical record. For any questions, contact support@medmind.ai.", 15, 280);
        doc.text("MedMind Health © 2026", 160, 280);

        doc.save("Medical_Record_" + doctor.replace(/\s+/g, '_') + ".pdf");
    } catch (e) {
        console.error("Failed to generate medical record PDF:", e);
        window.customAlert("An error occurred while generating the PDF. Please try again.");
    }
}

// ======================================
// SEARCH
// ======================================

document.getElementById("searchRecord").addEventListener("keyup", function(){

    const search = this.value.toLowerCase();

    const filtered = medicalRecords.filter(function(record){

        return(

            record.doctor.toLowerCase().includes(search)

            ||

            record.department.toLowerCase().includes(search)

        );

    });

    displayRecords(filtered);

});

// ======================================
// LOAD RECORDS
// ======================================

displayRecords(medicalRecords);

// ======================================
// ADD RECORD MODAL HANDLERS
// ======================================

const addModal = document.getElementById("addRecordModal");
const openAddModalBtn = document.getElementById("openAddModalBtn");
const closeAddModalBtn = document.getElementById("closeAddModalBtn");
const cancelAddModalBtn = document.getElementById("cancelAddModalBtn");
const addRecordForm = document.getElementById("addRecordForm");
const newVisitDateInput = document.getElementById("newVisitDate");

// Set default date to today
if (newVisitDateInput) {
    newVisitDateInput.value = new Date().toISOString().split("T")[0];
}

if (openAddModalBtn) {
    openAddModalBtn.addEventListener("click", function() {
        addModal.classList.add("active");
        if (newVisitDateInput) {
            newVisitDateInput.value = new Date().toISOString().split("T")[0];
        }
    });
}

const hideAddModal = function() {
    addModal.classList.remove("active");
    addRecordForm.reset();
};

if (closeAddModalBtn) closeAddModalBtn.addEventListener("click", hideAddModal);
if (cancelAddModalBtn) cancelAddModalBtn.addEventListener("click", hideAddModal);

// Close on clicking overlay
if (addModal) {
    addModal.addEventListener("click", function(e) {
        if (e.target === addModal) {
            hideAddModal();
        }
    });
}

// Handle Form Submit
if (addRecordForm) {
    addRecordForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const dateVal = document.getElementById("newVisitDate").value;
        const doctorVal = document.getElementById("newDoctor").value.trim();
        const departmentVal = document.getElementById("newDepartment").value;
        const diagnosisVal = document.getElementById("newDiagnosis").value.trim();
        const prescriptionVal = document.getElementById("newPrescription").value.trim();
        const labReportVal = document.getElementById("newLabReport").value.trim();

        const newRec = {
            patientEmail: loggedInUser.email,
            visitDate: dateVal,
            doctor: doctorVal,
            department: departmentVal,
            diagnosis: diagnosisVal,
            prescription: prescriptionVal,
            labReport: labReportVal
        };

        // Load all records from localStorage
        let allRecords = JSON.parse(localStorage.getItem("medicalRecords")) || [];
        allRecords.push(newRec);
        
        // Save back to localStorage
        localStorage.setItem("medicalRecords", JSON.stringify(allRecords));

        // Reload current user's filtered records list
        medicalRecords = allRecords.filter(function(record) {
            return record.patientEmail === loggedInUser.email;
        });

        // Re-render display
        displayRecords(medicalRecords);

        // Success alert
        hideAddModal();
        window.customAlert("Medical Consultation Record Added Successfully!");
    });
}