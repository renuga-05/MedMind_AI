document.getElementById("registerForm").addEventListener("submit", function(event){

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const age = document.getElementById("age").value.trim();
    const gender = document.getElementById("gender").value;
    const blood = document.getElementById("blood").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if(
        name === "" ||
        email === "" ||
        phone === "" ||
        age === "" ||
        password === "" ||
        confirmPassword === ""
    ){

        window.customAlert("Please fill all fields.");

        return;

    }

    if(password !== confirmPassword){

        window.customAlert("Passwords do not match.");

        return;

    }

    const user = {

        name,
        email,
        phone,
        age,
        gender,
        blood,
        password

    };

    localStorage.setItem("patient", JSON.stringify(user));

    window.customAlert("Registration Successful! Please login with your email and password.", function() {
        window.location.href = "login.html";
    });

});