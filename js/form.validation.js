function validateLoginForm() {

    var error = false;
    var email = document.forms["login_form"].elements[0].value;
    var reg = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    //alert(email=='');
    if (email == null || email == "") {
        document.getElementById('emailErr').style.display = "block";
        emailErr.parentNode.getElementsByTagName('span')[0].innerHTML = "Je potrebné vyplniť políčko 'Email'.";
        error = true;

// login can be done not only by email but also with username
//    } else if (reg.test(email) == false) {
//        document.getElementById('emailErr').style.display = "block";
//        emailErr.parentNode.getElementsByTagName('span')[0].innerHTML = email + " nie je platná emailová adresa.";
//        error = true;
    } else {
        document.getElementById('emailErr').style.display = "none";
    }

    var pswd = document.forms["login_form"].elements[1].value;
    if (pswd == null || pswd == "") {
        document.getElementById('pswdErr').style.display = "block";

        error = true;
    } else {
        document.getElementById('pswdErr').style.display = "none";
    }
    if (error) {
        return false;
    }
}

function validateUserForm() {
    var error = false;
    var email = document.forms["register_form"].elements[0].value;
    var reg = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (email == null || email == "") {
        document.getElementById('emailErr').style.display = "block";
        emailErr.parentNode.getElementsByTagName('span')[1].innerHTML = "Je potrebné vyplniť políčko 'Email'.";
        error = true;
    } else if (reg.test(email) == false) {
        document.getElementById('emailErr').style.display = "block";
        emailErr.parentNode.getElementsByTagName('span')[1].innerHTML = email + " nie je platná emailová adresa.";
        error = true;
    } else {
        document.getElementById('emailErr').style.display = "none";
    }

    var name = document.forms["register_form"].elements[1].value;
    if (name == null || name == "") {
        document.getElementById('nameErr').style.display = "block";
        error = true;
    } else {
        document.getElementById('nameErr').style.display = "none";
    }

    var pswd = document.forms["register_form"].elements[2].value;
    if (pswd == null || pswd == "") {
        document.getElementById('pswdErr').style.display = "block";

        error = true;
    } else {
        document.getElementById('pswdErr').style.display = "none";
    }

    var confirmPswd = document.forms["register_form"].elements[3].value;
    if (confirmPswd == null || confirmPswd == "") {
        document.getElementById('confirmPswdErr').style.display = "block";
        confirmPswdErr.parentNode.getElementsByTagName('span')[0].innerHTML = "Je potrebné vyplniť políčko 'Overenie hesla'.";
        error = true;
    } else if (confirmPswd != pswd) {
        document.getElementById('confirmPswdErr').style.display = "block";
        confirmPswdErr.parentNode.getElementsByTagName('span')[0].innerHTML = "Nezadali ste rovnaké heslá.";
        error = true;
    } else {
        document.getElementById('confirmPswdErr').style.display = "none";
    }
    if (error) {
        return false;
    }

}

function validateRegisterRestaurantForm() {
    var error = false;
    var nazov = document.forms["register_restaurant_form"].elements[0].value;
    if (nazov == null || nazov == "") {
        document.getElementById('nazovErr').style.display = "block";
        error = true;
    } else {
        document.getElementById('nazovErr').style.display = "none";
    }

    var adresa = document.forms["register_restaurant_form"].elements[1].value;
    if (adresa == null || adresa == "") {
        document.getElementById('adresaErr').style.display = "block";
        error = true;
    } else {
        document.getElementById('adresaErr').style.display = "none";
    }

    var mesto = document.forms["register_restaurant_form"].elements[2].value;
    if (mesto == null || mesto == "") {
        document.getElementById('mestoErr').style.display = "block";
        error = true;
    } else {
        document.getElementById('mestoErr').style.display = "none";
    }

    var telefon = document.forms["register_restaurant_form"].elements[3].value;
    if (telefon == null || telefon == "") {
        document.getElementById('telefonErr').style.display = "block";
        error = true;
    } else {
        document.getElementById('telefonErr').style.display = "none";
    }

    var email = document.forms["register_restaurant_form"].elements[4].value;
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if ((reg.test(email) == false && email != "")) {
        document.getElementById('emailErr').style.display = "block";
        document.getElementById('emailErr').parentNode.getElementsByTagName('span')[0].innerHTML = email + " nie je platná emailová adresa.";
        error = true;
    } else {
        document.getElementById('emailErr').style.display = "none";
    }

    var vztah = document.forms["register_restaurant_form"].elements[6].value;
    if (vztah == null || vztah == "") {
        document.getElementById('vztahErr').style.display = "block";
        error = true;
    } else {
        document.getElementById('vztahErr').style.display = "none";
    }

    if (error) {
        return false;
    }
    //return false;
}

function validateChangeDataForm() {
    var error = false;
    var name = document.forms["change_data_form"]["menoTxt"].value;
    if (!(name != null || name != "")) {
        document.getElementById('nameErr').style.display = "block";
        error = true;
    } else {
        document.getElementById('nameErr').style.display = "none";
    }
    if (error) {
        return false;
    }
}