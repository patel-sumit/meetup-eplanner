var user = function () {}
user.prototype.loginClick = function () {
    var email = $("#login-username").val();
    var password = $("#login-password").val();
    var loginalert = $("#login-alert")[0];

    firebase.auth().signInWithEmailAndPassword(
         email,
         password).then(
     function (authData) {
            var uname = authData.email.split("@")[0];
            //console.log("Authenticated successfully with payload:", authData);
            $('#loginform')[0].reset();
            $('#loginbox').hide();
            $("#eventList").show();
            $("#liSignOut").show();
            $("#liLogin").hide();
            $("#liSignUp").hide();
           $("#userNameHeader").show();
            var uHead = $("#userNameHeader")[0];
            uHead.innerHTML = uname + " <b class='caret'></b>";
            $("#login-alert").hide();
            objEvent.getEvent();

    }).catch(function(error){
            switch (error.code) {
                case "INVALID_PASSWORD":
                    loginErrMsg = "Error: The specified password is incorrect.";
                    break;
                case "INVALID_USER":
                    loginErrMsg = "Error: The specified user does not exist.";
                    break;
                case "INVALID_EMAIL":
                    loginErrMsg = "Error: The specified email is not valid.";
                    break;
                default:
                    loginErrMsg = error.code;
            }
            loginalert.style.display = "";
            loginalert.innerText = error.message;
            //console.log("Login Failed!", error);
    });
    return false;
}
user.prototype.signUpClick = function () {
    var name = $("#name").val();
    var employer = $("#employer").val();
    var bdate = $("#bdate").val();
    var jobTitle = $("#jobTitle").val();
    var email = $("#email").val();
    var password = $("#pwd").val();
    var signupAlert = $("#signupalert")[0];
    var newUser = {
        name:name,
        email: email,
        employer:employer,
        bdate:bdate,
        jobTitle:jobTitle,
        password: password,
        id:'',
    };
    firebase.auth().createUserWithEmailAndPassword(email,password).then(function (userData) {
        $('#signupform')[0].reset();
        $('#signupbox').hide();
        $('#loginbox').show();
        console.log("Successfully created user account with uid:", userData.uid);
        newUser.id=userData.uid;
        firebase.database().ref('/users').push(newUser);
        return;
    }).catch(function (error) {
        console.log(error);
        var loginErrMsg = "";
        switch (error.code) {
            case "EMAIL_TAKEN":
                loginErrMsg = "Error: The specified email is already in use.";
                break;

            default:
                loginErrMsg = error.code;
        }

        //console.log("Error creating user:", error);
        signupAlert.style.display = "";
        signupAlert.innerText = loginErrMsg;
        $('#signupform')[0].reset();
    });
}
user.prototype.validateSignUp = function () {
    $('#signupform')
           .bootstrapValidator({
               framework: 'bootstrap',
               icon: {
                   valid: 'glyphicon glyphicon-ok',
                   invalid: 'glyphicon glyphicon-remove',
                   validating: 'glyphicon glyphicon-refresh'
               },
               fields: {
                   name:{
                       row: '.col-xs-5',
                       validators: {
                           notEmpty: {
                               message: 'Name is required'
                           }
                       }

                   },
                   email: {
                       row: '.col-xs-5',
                       validators: {
                           notEmpty: {
                               message: 'The Email is required'
                           },
                           regexp: {
                               regexp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                               message: 'The specified email is not valid.'
                           }
                       }
                   },
                   password: {
                       row: '.col-xs-5',
                       validators: {
                           callback: {
                               callback: function (value, validator, $field) {

                                   var password = $("#pwd").val();

                                   var symbol = /[\!\@\#\$\%\^\&\*]/g;
                                   var numb = /\d/g;
                                   var smallLett = /[a-z]/g;
                                   var capLett = /[A-Z]/g;
                                   if (password == "") {
                                       return {
                                           valid: false,
                                           message: "The password is required"
                                       }
                                   }

                                   if (password.length < 8) {
                                       return {
                                           valid: false,
                                           message: "The password must be at least 8 characters long"
                                       }
                                   }
                                   if (!numb.test(password)) {
                                       return {
                                           valid: false,
                                           message: "missing a number"
                                       }

                                   }

                                   if (!smallLett.test(password)) {
                                       return {
                                           valid: false,
                                           message: "missing a lowercase letter"
                                       }

                                   }

                                   if (!capLett.test(password)) {
                                       return {
                                           valid: false,
                                           message: "missing an uppercase letter"
                                       }
                                   }


                                   if (!symbol.test(password)) {
                                       return {
                                           valid: false,
                                           message: "missing a symbol (!, @, #, $, %, ^, &, *)"
                                       }

                                   }
                                   return true;
                               }
                           }
                       }
                   },
                   confirmPassword: {
                       row: '.col-xs-3',
                       validators: {
                           notEmpty: {
                               message: 'The confirm password is required and cannot be empty'
                           },
                           identical: {
                               field: 'password',
                               message: 'The password and its confirm must be the same'
                           }
                       }

                   }
               },
           })
        .on('submit', function (e, data) {
            var $form = $(e.target);
            if (e.isDefaultPrevented()) {
                // handle the invalid form...               
                $form.bootstrapValidator('disableSubmitButtons', false);
            } else {
                objUser.signUpClick();
                e.preventDefault();
            }
        })
     .on('keyup', '[name="password"]', function () {
         var isEmpty = $(this).val() == '';
         $('#signupform')
                 .bootstrapValidator('enableFieldValidators', 'password', !isEmpty)
                 .bootstrapValidator('enableFieldValidators', 'confirmPassword', !isEmpty);

         // Revalidate the field when user start typing in the password field
         if ($(this).val().length == 1) {
             $('#signupform').bootstrapValidator('validateField', 'password')
                             .bootstrapValidator('validateField', 'confirmPassword');
         }
     })


}
user.prototype.validateLogin = function () {
    $('#loginform')
        .bootstrapValidator({
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            row: {
                valid: 'field-success',
                invalid: 'field-error'
            },
            fields: {
                username: {
                    row: '.col-xs-5',
                    validators: {
                        notEmpty: {
                            message: 'The User Name is required'
                        }
                    }
                },
                password: {
                    row: '.col-xs-5',
                    validators: {
                        notEmpty: {
                            message: 'Password is required'
                        }
                    }
                }
            },
        })
        .on('submit', function (e, data) {
            var $form = $(e.target);
            if (e.isDefaultPrevented()) {
                // handle the invalid form...
                $form.bootstrapValidator('disableSubmitButtons', false);
            } else {
                objUser.loginClick();
                e.preventDefault();
            }
        })
}
user.prototype.showHideElements = function () {
    var user = firebase.auth().currentUser;
    if (user) {
        var uname = user.email.split("@")[0];
        $("#loginbox").hide();
        $("#signupbox").hide();
        $("#eventList").show();
        $("#liSignOut").show();

        var uHead = $("#userNameHeader")[0];
        uHead.innerHTML = uname + " <b class='caret'></b>";
        //$("#userNameHeader")[0].innerHtml = uname + " <b class='caret'></b>";

        $("#liLogin").hide();
        $("#liSignUp").hide();
        objEvent.getEvent();
    }
    else {
        $("#loginbox").show();
        $("#signupbox").hide();
        $("#eventList").hide();
        $("#liSignOut").hide();
        $("#liLogin").show();
        $("#liSignUp").show();
    }

}
user.prototype.onMenuItemClick = function (name) {
    var user = firebase.auth().currentUser;
    if (name == "login") {
        $('#signupbox').hide();
        $('#loginbox').show();
        $('#eventList').hide();
        $("#liSignOut").show();
        $("#userNameHeader").hide();
        $("#login-alert").hide();
        $("#login-username").focus();
    }
    else if (name == "signUp") {
        $('#signupbox').show(); $('#loginbox').hide(); $('#eventList').hide(); $("#userNameHeader").hide();
        $("#name").focus();
    }
    else if (name == "signOut") {
        firebase.auth().signOut().then(function() {
            $('#signupbox').hide(); $('#loginbox').hide(); $('#eventList').hide(); $("#userNameHeader").hide();
            console.log('Sign Out');
        }, function(error) {
            console.log('Sign Out Error', error);
        });
    }
    else if (name == "createEvent") {
        if (user) {
            $("#event").focus();
            $('#signupbox').hide();
            $('#loginbox').hide();
            $('#eventbox').modal('show');
        }
        else {
            $('#signupbox').hide();
            $('#loginbox').show();
            $("#login-alert").show();
            $("#login-alert")[0].innerText = "Please login to create Event";
            $("#login-username").focus();
        }
    }

}
user.prototype.displayFloatingLabel = function () {
    $(document).on('shown.bs.modal', function (e) {
        $('[autofocus]', e.target).focus();
    });
    if($('.bs-float-label input').length){
        var bs_float_on_class = "on";
        var bs_float_show_class = "show";

        $('.float-input').on('bs-check-value', function(){
            var _bs_label = $(this).closest('.bs-float-label').find('.float-label');
            if (this.value !== ''){
                _bs_label.addClass(bs_float_show_class);
            } else {
                _bs_label.removeClass(bs_float_show_class);
            }
        })
            .on("keyup",function(){
                $(this).trigger("bs-check-value");
            })
            .on("focus",function(){
                $(this).closest(".bs-float-label").find('.float-label').addClass(bs_float_on_class);
            })
            .on("blur",function(){
                $(this).closest(".bs-float-label").find('.float-label').removeClass(bs_float_on_class);
            }).trigger("bs-check-value");
        ;
    }

}