// chatbot.js - MedMind AI Context-Aware Chatbot Assistant

(function () {
    // Check if user is logged in and not on login/register pages
    const isAuthPage = window.location.pathname.includes("login.html") || window.location.pathname.includes("register.html");
    if (isAuthPage) return;

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return;

    // ==========================================
    // INITIALIZATION & DYNAMIC INJECTION
    // ==========================================

    // 1. Inject Stylesheet Link
    if (!document.getElementById("chatbot-css")) {
        const link = document.createElement("link");
        link.id = "chatbot-css";
        link.rel = "stylesheet";
        link.href = "css/chatbot.css";
        document.head.appendChild(link);
    }

    // 2. Load jsPDF dynamically if not present
    if (!window.jspdf) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        document.head.appendChild(script);
    }

    // 3. Inject Chatbot HTML Widget
    const chatbotHtml = `
        <button id="chatbot-toggle-btn" class="chatbot-toggle-btn" title="Chat with MedMind AI">💬</button>
        
        <div id="chatbot-container" class="chatbot-container">
            <div class="chatbot-header">
                <div class="chatbot-title">
                    <span class="chatbot-status-dot"></span>
                    <span>🏥 MedMind AI Assistant</span>
                </div>
                <button id="chatbot-close-btn" class="chatbot-close-btn" title="Close Chat">&times;</button>
            </div>
            
            <div id="chatbot-messages" class="chatbot-messages"></div>
            
            <div class="chatbot-pills-container">
                <button class="chatbot-pill" data-action="summary">📋 Health Summary</button>
                <button class="chatbot-pill" data-action="diet">🥗 Diet Plan</button>
                <button class="chatbot-pill" data-action="download">📄 Download Report</button>
                <button class="chatbot-pill" data-action="meds">💊 Active Meds</button>
            </div>
            
            <div class="chatbot-input-area">
                <input type="text" id="chatbot-input" class="chatbot-input" placeholder="Ask about your health, diet, meds..." autocomplete="off">
                <button id="chatbot-send-btn" class="chatbot-send-btn" title="Send Message">➤</button>
            </div>
        </div>
    `;

    // Append to body after DOM is loaded
    function injectWidget() {
        if (document.getElementById("chatbot-container")) return; // Avoid double injection
        
        const wrapper = document.createElement("div");
        wrapper.innerHTML = chatbotHtml;
        document.body.appendChild(wrapper);

        // Bind event listeners
        const toggleBtn = document.getElementById("chatbot-toggle-btn");
        const closeBtn = document.getElementById("chatbot-close-btn");
        const container = document.getElementById("chatbot-container");
        const inputField = document.getElementById("chatbot-input");
        const sendBtn = document.getElementById("chatbot-send-btn");
        const pills = document.querySelectorAll(".chatbot-pill");

        // Toggle Chat
        toggleBtn.addEventListener("click", () => {
            container.classList.toggle("active");
            if (container.classList.contains("active")) {
                inputField.focus();
                // Play a brief opening sound or trigger a small vibration if desired
                if (navigator.vibrate) navigator.vibrate(15);
            }
        });

        // Close Chat
        closeBtn.addEventListener("click", () => {
            container.classList.remove("active");
        });

        // Send triggers
        sendBtn.addEventListener("click", handleUserMessage);
        inputField.addEventListener("keyup", (e) => {
            if (e.key === "Enter") handleUserMessage();
        });

        // Pills action listeners
        pills.forEach(pill => {
            pill.addEventListener("click", () => {
                const action = pill.getAttribute("data-action");
                let userText = "";
                if (action === "summary") userText = "My Health Summary";
                else if (action === "diet") userText = "What diet should I follow?";
                else if (action === "download") userText = "Download my Health Report";
                else if (action === "meds") userText = "What are my active medications?";

                if (userText) {
                    inputField.value = userText;
                    handleUserMessage();
                }
            });
        });

        // Insert initial greeting
        sendGreeting();
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        injectWidget();
    } else {
        document.addEventListener("DOMContentLoaded", injectWidget);
    }

    // ==========================================
    // CHATLOG CONTEXT LOADERS
    // ==========================================

    function getMedicalData() {
        const email = loggedInUser.email;
        const allRecords = JSON.parse(localStorage.getItem("medicalRecords")) || [];
        const allPrescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
        const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];

        return {
            records: allRecords.filter(r => r.patientEmail === email),
            prescriptions: allPrescriptions.filter(p => p.patientEmail === email),
            appointments: allAppointments.filter(a => a.patientEmail === email)
        };
    }

    // ==========================================
    // MESSAGE HANDLING LOGIC
    // ==========================================

    function addMessage(sender, content, isHtml = false) {
        const messagesContainer = document.getElementById("chatbot-messages");
        if (!messagesContainer) return;

        const msgDiv = document.createElement("div");
        msgDiv.className = `chatbot-message msg-${sender}`;
        
        if (isHtml) {
            msgDiv.innerHTML = content;
        } else {
            msgDiv.textContent = content;
        }
        
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return msgDiv;
    }

    function showTypingIndicator() {
        const messagesContainer = document.getElementById("chatbot-messages");
        if (!messagesContainer) return null;

        const typingDiv = document.createElement("div");
        typingDiv.className = "chatbot-message msg-ai typing-indicator-wrapper";
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv;
    }

    function sendGreeting() {
        const patientName = loggedInUser.name || "Patient";
        const welcomeText = `Hello <strong>${patientName}</strong>! 👋<br><br>I am <strong>MedMind AI</strong>, your dedicated healthcare assistant.<br><br>I can provide tailored information based on your profile, advise on healthy diets based on your diagnoses, list your medications, or generate your complete <strong>Health Report PDF</strong>. What can I do for you today?`;
        addMessage("ai", welcomeText, true);
    }

    function handleUserMessage() {
        const inputField = document.getElementById("chatbot-input");
        const query = inputField.value.trim();
        if (!query) return;

        // Display user message
        addMessage("user", query);
        inputField.value = "";

        // Display AI typing indicator
        const typingIndicator = showTypingIndicator();

        // Simulate thinking latency
        setTimeout(() => {
            if (typingIndicator) typingIndicator.remove();
            
            // Generate answer
            const reply = processQuery(query);
            
            if (reply.isHtml) {
                addMessage("ai", reply.text, true);
            } else {
                addMessage("ai", reply.text);
            }

            // Append specific action card if requested
            if (reply.triggerAction === "download") {
                renderDownloadCard();
            }
        }, 1000);
    }

    // ==========================================
    // AI LOGIC ENGINE (RULE-BASED INTELLIGENCE)
    // ==========================================

    function processQuery(input) {
        const text = input.toLowerCase().trim();
        const data = getMedicalData();

        // 1. HELP / CAPABILITIES
        if (text.includes("help") || text.includes("hello") || text.includes("hi ") || text.includes("hey") || text.includes("greet")) {
            return {
                isHtml: true,
                text: `You can ask me to:<br>
                • 📋 **Summarize your health status** (e.g. "my health summary")<br>
                • 🥗 **Recommend diet tips** (e.g. "what diet should I follow?")<br>
                • 📄 **Download your official PDF health report** (e.g. "download report")<br>
                • 💊 **Check active prescriptions** (e.g. "list my medications")<br><br>
                Feel free to type your query, or click one of the quick action buttons below.`
            };
        }

        // 2. DOWNLOAD REPORT TRIGGER
        if (text.includes("download") || text.includes("pdf") || text.includes("report")) {
            return {
                isHtml: true,
                text: `Sure, I've compiled your patient profile, history, appointments, and prescriptions. Click the download card below to save your official PDF document.`,
                triggerAction: "download"
            };
        }

        // 3. HEALTH SUMMARY / DIAGNOSES
        if (text.includes("health") || text.includes("summary") || text.includes("diagnosis") || text.includes("history") || text.includes("records")) {
            if (data.records.length === 0) {
                return {
                    isHtml: true,
                    text: `I currently see no consultation records registered in your account. You can complete appointments to populate records, or edit your medical profile in the **Settings** menu.`
                };
            }

            let summaryHtml = `Here is your **Clinical Health Summary**:<br><br>`;
            data.records.forEach((rec, idx) => {
                summaryHtml += `**Record #${idx + 1} (${rec.visitDate})**<br>`;
                summaryHtml += `• **Doctor:** ${rec.doctor} (${rec.department})<br>`;
                summaryHtml += `• **Diagnosis:** ${rec.diagnosis}<br>`;
                summaryHtml += `• **Prescription:** ${rec.prescription}<br>`;
                summaryHtml += `• **Lab Work:** ${rec.labReport}<br><br>`;
            });

            return { isHtml: true, text: summaryHtml };
        }

        // 4. DIET & NUTRITION RECOMMENDATIONS
        if (text.includes("diet") || text.includes("nutrition") || text.includes("food") || text.includes("eat") || text.includes("meal")) {
            // Check if patient has specific diagnoses to tailor diet
            const diagnoses = data.records.map(r => r.diagnosis.toLowerCase());
            let cardiologyClient = false;
            let dermatologyClient = false;

            diagnoses.forEach(diag => {
                if (diag.includes("chest") || diag.includes("heart") || diag.includes("cardio") || diag.includes("mild chest pain")) {
                    cardiologyClient = true;
                }
                if (diag.includes("skin") || diag.includes("allergy") || diag.includes("dermatology")) {
                    dermatologyClient = true;
                }
            });

            if (cardiologyClient) {
                return {
                    isHtml: true,
                    text: `🥗 **Tailored Cardio-Diet Plan:**<br>
                    Since you have records indicating mild chest pain/cardiovascular observation, we recommend a heart-healthy diet:<br>
                    • **Reduce Sodium:** Limit salt intake to less than 1,500 mg per day to manage blood pressure.<br>
                    • **Healthy Fats:** Choose olive oil, avocados, and foods rich in Omega-3 (walnuts, chia seeds, salmon). Avoid trans fats.<br>
                    • **High Fiber:** Eat whole grains (oats, brown rice) and lots of leafy greens (spinach, kale).<br>
                    • **Hydration:** Consume at least 2.5L of water daily.<br><br>
                    *Disclaimer: Consult Dr. Sarah Johnson or your doctor before starting any strict dietary regimen.*`
                };
            } else if (dermatologyClient) {
                return {
                    isHtml: true,
                    text: `🥗 **Anti-Inflammatory Allergy Diet:**<br>
                    Since you have records showing skin allergies/dermatology consultations:<br>
                    • **Identify Triggers:** Avoid common food allergens such as shellfish, eggs, nuts, and dairy products during flare-ups.<br>
                    • **Hydration:** Keep your skin barrier hydrated by drinking 3 liters of water daily.<br>
                    • **Anti-inflammatory Foods:** Focus on berries, citrus fruits, green tea, and zinc-rich seeds (pumpkin/sunflower seeds) which help skin healing.<br>
                    • **Minimize Processed Sugars:** High sugar intake can increase skin inflammation.<br><br>
                    *Disclaimer: Please consult Dr. Emily Davis or your dermatologist for specific allergen skin tests.*`
                };
            } else {
                return {
                    isHtml: true,
                    text: `🥗 **General Healthy Balanced Diet:**<br>
                    Based on your profile, here are general dietary guidelines:<br>
                    • **Balanced Plate:** Fill 1/2 of your plate with vegetables/fruits, 1/4 with lean proteins (poultry, fish, tofu), and 1/4 with complex grains.<br>
                    • **Sugar & Salt Control:** Minimize processed sugars and high-sodium foods.<br>
                    • **Hydration:** Drink 8-10 glasses of water daily.<br>
                    • **Snacking:** Opt for raw almonds, fresh fruits, or greek yogurt.<br><br>
                    Let me know if your profile changes or if you are diagnosed with a specific condition to customize this further.`
                };
            }
        }

        // 5. PRESCRIPTIONS / MEDS
        if (text.includes("presc") || text.includes("med") || text.includes("drug") || text.includes("tablet") || text.includes("pill")) {
            const activeMeds = data.prescriptions.filter(p => p.status === "Active");
            const completedMeds = data.prescriptions.filter(p => p.status === "Completed");
            
            if (data.prescriptions.length === 0) {
                return {
                    isHtml: true,
                    text: `I could not find any active prescriptions on record for you. Please check in with your doctor or upload your prescription in the **Prescriptions** section.`
                };
            }

            let medsHtml = `💊 **Your Prescriptions:**<br><br>`;
            if (activeMeds.length > 0) {
                medsHtml += `**Active:**<br>`;
                activeMeds.forEach((med) => {
                    medsHtml += `• **${med.medicine}** (${med.dosage}) - *${med.frequency}* (Ends: ${med.endDate})<br>`;
                });
            }
            if (completedMeds.length > 0) {
                medsHtml += `<br>**Completed:**<br>`;
                completedMeds.forEach((med) => {
                    medsHtml += `• **${med.medicine}** (${med.dosage}) - *${med.frequency}* (Finished: ${med.endDate})<br>`;
                });
            }
            medsHtml += `<br>Make sure to take them as scheduled. If you suffer from side effects, contact your physician immediately.`;

            return { isHtml: true, text: medsHtml };
        }

        // 6. PROFILE / DEMOGRAPHICS
        if (text.includes("profile") || text.includes("me") || text.includes("who am i") || text.includes("details") || text.includes("my age")) {
            return {
                isHtml: true,
                text: `👤 **Patient Profile Details:**<br>
                • **Name:** ${loggedInUser.name || "---"}<br>
                • **Email:** ${loggedInUser.email || "---"}<br>
                • **Phone:** ${loggedInUser.phone || "---"}<br>
                • **Age:** ${loggedInUser.age || "---"} years old<br>
                • **Gender:** ${loggedInUser.gender || "---"}<br>
                • **Blood Group:** ${loggedInUser.blood || "---"}<br><br>
                You can update these details anytime in the **Profile** tab.`
            };
        }

        // 7. DEFAULT
        return {
            isHtml: true,
            text: `I'm not sure how to answer that. I am trained to give medical summary stats, suggest diets based on your medical records, check active meds, and download reports.<br><br>Try typing **"my health summary"**, **"what diet should I follow?"**, or **"download report"**.`
        };
    }

    // ==========================================
    // RENDER INTERACTIVE DOWNLOAD CARD
    // ==========================================

    function renderDownloadCard() {
        const messagesContainer = document.getElementById("chatbot-messages");
        if (!messagesContainer) return;

        const cardDiv = document.createElement("div");
        cardDiv.className = "chatbot-action-card";
        cardDiv.innerHTML = `
            <div class="action-card-header">
                <span>📋</span> MedMind AI Health Report
            </div>
            <div class="action-card-desc">
                Contains demographics, appointments history, diagnostic summaries, and active prescriptions.
            </div>
            <button class="action-card-btn" id="chat-download-btn">
                📥 Download PDF Report
            </button>
        `;

        messagesContainer.appendChild(cardDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Bind download handler
        cardDiv.querySelector("#chat-download-btn").addEventListener("click", () => {
            triggerPdfDownload();
        });
    }

    // ==========================================
    // PDF GENERATION & DOWNLOAD
    // ==========================================

    function triggerPdfDownload() {
        if (!window.jspdf) {
            window.customAlert("PDF Engine is loading. Please click download again in 2 seconds.");
            return;
        }

        window.showSecuringLoader("Generating PDF Health Report...", function() {
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                const data = getMedicalData();

                // 1. Header (Sage Teal matching styling)
                doc.setFillColor(59, 107, 96);
                doc.rect(0, 0, 210, 42, "F");

                doc.setTextColor(255, 255, 255);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(22);
                doc.text("MEDMIND AI - CHATBOT HEALTH SUMMARY", 15, 24);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.text("Certified Clinical & Patient Metrics Digest", 15, 32);

                // Date stamp
                doc.setTextColor(230, 230, 230);
                doc.setFontSize(9);
                doc.text("Issued: " + new Date().toLocaleString(), 135, 24);

                // 2. Demographics Section
                doc.setTextColor(44, 62, 80);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(13);
                doc.text("PATIENT REGISTRY DETAILS", 15, 55);
                doc.setLineWidth(0.5);
                doc.setDrawColor(130, 196, 181);
                doc.line(15, 57, 195, 57);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(60, 60, 60);
                doc.text("Full Name: " + (loggedInUser.name || "---"), 15, 65);
                doc.text("Registered Email: " + (loggedInUser.email || "---"), 15, 71);
                doc.text("Phone Number: " + (loggedInUser.phone || "---"), 15, 77);

                doc.text("Age: " + (loggedInUser.age || "---") + " Years", 110, 65);
                doc.text("Gender: " + (loggedInUser.gender || "---"), 110, 71);
                doc.text("Blood Group: " + (loggedInUser.blood || "---"), 110, 77);

                // 3. Clinical Medical Records Section
                doc.setFont("helvetica", "bold");
                doc.setFontSize(13);
                doc.setTextColor(44, 62, 80);
                doc.text("HISTORICAL CONSULTATION LOG", 15, 92);
                doc.line(15, 94, 195, 94);

                let y = 102;
                if (data.records.length === 0) {
                    doc.setFont("helvetica", "italic");
                    doc.setFontSize(10);
                    doc.setTextColor(120, 120, 120);
                    doc.text("No official historical consultation records found in database.", 18, y);
                    y += 10;
                } else {
                    data.records.forEach((rec, idx) => {
                        if (y > 250) {
                            doc.addPage();
                            y = 20;
                        }
                        
                        // Draw block background
                        doc.setFillColor(245, 249, 248);
                        doc.rect(15, y - 5, 180, 24, "F");
                        doc.setLineWidth(0.5);
                        doc.setDrawColor(210, 225, 222);
                        doc.rect(15, y - 5, 180, 24, "S");
                        
                        // Draw indicator line
                        doc.setDrawColor(59, 107, 96);
                        doc.setLineWidth(1.5);
                        doc.line(15, y - 5, 15, y + 19);

                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(10);
                        doc.setTextColor(59, 107, 96);
                        doc.text("Record #" + (idx + 1) + " | Date: " + rec.visitDate + " | Consulting: " + rec.doctor, 18, y);
                        
                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(9.5);
                        doc.setTextColor(44, 62, 80);
                        doc.text("Diagnosis: " + rec.diagnosis, 18, y + 6);
                        doc.text("Prescribed: " + rec.prescription + "   |   Lab Work: " + rec.labReport, 18, y + 12);
                        y += 30;
                    });
                }

                // 4. Upcoming Appointments & Medications Section
                if (y > 230) {
                    doc.addPage();
                    y = 20;
                }

                doc.setFont("helvetica", "bold");
                doc.setFontSize(13);
                doc.setTextColor(44, 62, 80);
                doc.text("UPCOMING APPOINTMENTS & PRESCRIPTIONS", 15, y);
                doc.setLineWidth(0.5);
                doc.setDrawColor(130, 196, 181);
                doc.line(15, y + 2, 195, y + 2);
                y += 10;

                doc.setFont("helvetica", "bold");
                doc.setFontSize(10.5);
                doc.setTextColor(59, 107, 96);
                doc.text("Active Prescribed Medications:", 15, y);
                y += 6;

                doc.setFont("helvetica", "normal");
                doc.setFontSize(9.5);
                doc.setTextColor(44, 62, 80);
                
                const activeMeds = data.prescriptions.filter(p => p.status === "Active");
                if (activeMeds.length === 0) {
                    doc.text("No active prescribed medications on file.", 18, y);
                    y += 8;
                } else {
                    activeMeds.forEach((med) => {
                        doc.text("• " + med.medicine + " (" + med.dosage + ") - Frequency: " + med.frequency, 18, y);
                        y += 6;
                    });
                    y += 2;
                }

                if (y > 250) {
                    doc.addPage();
                    y = 20;
                }

                y += 4;
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10.5);
                doc.setTextColor(59, 107, 96);
                doc.text("Upcoming Scheduled Bookings:", 15, y);
                y += 6;

                doc.setFont("helvetica", "normal");
                doc.setFontSize(9.5);
                doc.setTextColor(44, 62, 80);

                if (data.appointments.length === 0) {
                    doc.text("No upcoming medical appointments scheduled.", 18, y);
                    y += 8;
                } else {
                    data.appointments.forEach((appt) => {
                        doc.text("• " + appt.date + " with " + appt.doctor + " (" + appt.department + ") - Status: " + appt.status, 18, y);
                        y += 6;
                    });
                    y += 2;
                }

                // Footer signature / Disclaimer
                y = Math.max(y + 10, 260);
                doc.setDrawColor(220, 220, 220);
                doc.setLineWidth(0.5);
                doc.line(15, y, 195, y);

                doc.setFont("helvetica", "italic");
                doc.setFontSize(8);
                doc.setTextColor(140, 140, 140);
                doc.text("This patient medical summary report is compiled by the MedMind AI virtual agent using verified patient records.", 15, y + 5);
                doc.text("Please contact health-portal@medmind.ai for medical record disputes. MedMind Health © 2026", 15, y + 10);

                doc.save(`MedMind_AI_Report_${loggedInUser.name.replace(/\s+/g, "_")}.pdf`);
            } catch (err) {
                console.error("Chatbot PDF Generation failed:", err);
                window.customAlert("An error occurred while compiling your PDF report. Please try again.");
            }
        });
    }

})();
