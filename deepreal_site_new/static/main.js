var passwords = [
    {name:"Erica", password:"erica"},
    {name:"Noah", password:"noah"},
    {name:"Nic", password:"nic"},
    {name:"Joe", password:"joe"},
    {name:"Sebas", password:"sebas"},

];

var current_user;

document.addEventListener("DOMContentLoaded", function(event) {

    let submitButton = document.getElementById("submit_button");
    //let DOMbutton = document.getElementById("submit_button_DOM");
    let loginForm = document.getElementById("login-form");
    let loginErrorMsg = document.getElementById("login-error-msg");
    let jsValue = document.getElementById("jsValue");
    
    hidePassword();
    showView("session");

    // document.addEventListener("keydown", function(event){
    //     if (event.defaultPrevented){
    //         return;
    //     }
    //     switch(event.code) {
    //         case "Enter":
    //             document.getElementById("submit_button").click();
    //     }
    //     event.preventDefault();
    // },true);

    // input.addEventListener("keyup", function(event) {
    //     if (event.keyCode === 13) {
    //         event.preventDefault();
    //         document.getElementById("submit_button").click();
    //     }
    // });

    submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        let password = loginForm.password.value;
        let login_success = checkPassword(password);

        jsValue.innerHTML = current_user;

        if (login_success) {
            setupWebcam();
            showView("webcam");
        } else {
            loginErrorMsg.style.opacity = 1;
        }
    })

    // DOMButton.addEventListener("click", (e) => {
    //     e.preventDefault();
    //     let password = loginForm.password.value;
    //     let login_success = checkPassword(password);

    //     jsValue.innerHTML = current_user;

    //     if (login_success) {
    //         setupWebcam();
    //         showView("webcam");
    //     } else {
    //         loginErrorMsg.style.opacity = 1;
    //     }
    // })

    // let args = {
    //     session_id: "1606783991269",
    //     avail_inputs: ["Deeper and Faker", "Seashells", "Mitochondria", "Don't do drugs"],
    //     avail_models: ["Wav2Lip", "First Order Model"],
    //     src_vid_url: "test.mp4"
    // };
    // toSessionView(args);
    // showView("session");
});

document.addEventListener("sessionStarted", function (event) {
    let args = event.detail;
    toSessionView(args);
    showView("session");
});

document.addEventListener("retakeVideo", function (event) {
    startingView();
    showView("webcam");
});

function hidePassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
}

function checkPassword(password){
    let success = false;
    passwords.forEach(function(obj){
        if (obj.password === password){
            success = true;
            current_user = obj.name;
        }
    });

    if (success === true){
        return true;
    }

    else if (success === false) {
        return false;
    }

}

function showView(view) {
    let login = document.getElementById("login");
    let input = document.getElementById("input");
    let session = document.getElementById("session");
    if (view === "webcam") {
        login.style.display = "none";
        input.style.display = "flex";
        session.style.display = "none";
    } else if (view === "session") {
        login.style.display = "none";
        input.style.display = "none";
        session.style.display = "flex";
    } else if (view === "login") {
        login.style.display = "flex";
        input.style.display = "none";
        session.style.display = "none";
    } else {
        throw Error(`unknown view ${view}`);
    }
}