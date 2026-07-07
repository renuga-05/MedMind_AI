// profile.js - MedMind AI Profile Management

// =====================================
// GET LOGGED-IN USER
// =====================================

const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
    window.customAlert("Please login first.", function() {
        window.location.href = "login.html";
    });
}

// =====================================
// DISPLAY USER DETAILS & PHOTO
// =====================================

if (user) {
    document.getElementById("name").value = user.name || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("age").value = user.age || "";
    document.getElementById("gender").value = user.gender || "Male";
    document.getElementById("blood").value = user.blood || "O+";

    const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2382c4b5'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";
    const profilePic = document.getElementById("profilePic");
    if (profilePic) {
        profilePic.src = user.profilePic || defaultAvatar;
    }

    const profilePicInput = document.getElementById("profilePicInput");
    if (profilePicInput) {
        profilePicInput.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const dataUrl = e.target.result;
                    if (profilePic) {
                        profilePic.src = dataUrl;
                    }
                    user.profilePic = dataUrl;
                    localStorage.setItem("loggedInUser", JSON.stringify(user));
                    // Update in registered list
                    localStorage.setItem("patient", JSON.stringify(user));
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// =====================================
// SAVE PROFILE
// =====================================

document.getElementById("profileForm").addEventListener("submit", function(event){

    event.preventDefault();

    user.name = document.getElementById("name").value.trim();
    user.phone = document.getElementById("phone").value.trim();
    user.age = document.getElementById("age").value.trim();
    user.gender = document.getElementById("gender").value;
    user.blood = document.getElementById("blood").value;

    // Update logged in user
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // Update registered user
    localStorage.setItem("patient", JSON.stringify(user));

    window.customAlert("Profile Updated Successfully!", function() {
        window.location.href = "dashboard.html";
    });

});