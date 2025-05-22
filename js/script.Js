const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".SignInLink");
const registerLink = document.querySelector(".registerLink");

registerLink.onclick = () => {
    wrapper.classList.add("active");
}

loginLink.onclick = () => {
    wrapper.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", function () {
    if (!localStorage.getItem("email")) {
        localStorage.setItem("name", "Aya Mounis");
        localStorage.setItem("email", "aya@gmail.com");
        localStorage.setItem("password", "123456");
    }
});

function getdata(event) {
    event.preventDefault(); 

    var user = document.querySelector(".Register input[type='text']");
    var email = document.querySelector(".Register input[type='email']");
    var password = document.querySelector(".Register input[type='password']");
    
    if (user.value.length < 3) {
        user.style.border = "2px solid red";
        alert("The username must be at least 3 characters long!");
        return;
    } else {
        user.style.border = "2px solid black";
    }

    if (email.value.indexOf("@") === -1) {
        email.style.border = "2px solid red";
        alert("Enter a valid email address!");
        return;
    } else {
        email.style.border = "2px solid black";
    }

    if (localStorage.getItem("email") === email.value) {
        alert("This email is already registered!");
        return;
    }

    if (password.value.length < 6) {
        password.style.border = "2px solid red";
        alert("The password must be at least 6 characters long!");
        return;
    } else {
        password.style.border = "2px solid black";
    }

    localStorage.setItem("name", user.value);
    localStorage.setItem("email", email.value);
    localStorage.setItem("password", password.value);

    alert("Registration Successful! Redirecting to Login...");

    setTimeout(() => {
        wrapper.classList.remove("active");
    }, 500);
}

document.querySelector(".Register .btn").addEventListener("click", getdata);

function login(event) {
    event.preventDefault(); 

    var useremail = document.querySelector(".Login input[type='email']");
    var userpassword = document.querySelector(".Login input[type='password']");

    var storageUser = localStorage.getItem("name");
    var storageMail = localStorage.getItem("email");
    var storagePass = localStorage.getItem("password");

    if (useremail.value === storageMail && userpassword.value === storagePass) {
        alert("Hello " + storageUser + ", Login Successful.");
        // تعديل مسار الصفحة الرئيسية
        window.open("../html/home.html", "_self");
    } else {
        alert("Invalid Email or Password, Please Try Again !");
    }
}

document.querySelector(".Login .btn").addEventListener("click", login);