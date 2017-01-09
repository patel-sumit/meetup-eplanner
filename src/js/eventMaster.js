var eventMaster = function () {}
eventMaster.prototype.createEvent = function () {

    var user=firebase.auth().currentUser;

    var event = $("#event").val();

    var eventType = $("#eventTypeText").val();
    var eventHost = $("#eventHost").val();
    var sdate = $("#sdate").val();
    var edate = $("#edate").val();
    var guest = $("#guest").val();
    var loc = $("#loc").val();
    var optMessage = $("#optMessage").val();

    var event = {
        eventname: event,
        eventtype: eventType,
        eventhost: eventHost,
        eventstartdate: sdate,
        eventenddate: edate,
        guest: guest,
        eventLoc: loc,
        optMessage:optMessage
    };

    $("#eventform")[0].reset();
    $('#eventbox').modal('hide');
    objEvent.addHtml(event);

    
    if(user){
        firebase.database().ref('/events').child(user.uid).push(event);
    }

}
eventMaster.prototype.bindLocation = function () {
    $('.dropdown-menu').width($('.ajax-typeahead').width());
    $('.ajax-typeahead').typeahead({
        source: function (query, process) {
            return $.ajax({
                url: "https://api.foursquare.com/v2/venues/search?client_id=GE1HP5N0Z1XSZZ0MEAK0N1W4RUQDIMIB1O524OZBTIR04UPK&client_secret=FODUE04DOSXSDCFNPVRUJGJ3SE5QB4VPPM2YW0RHY0VXJFOW&v=20130815&ll=40.7,-74&near=" + query + "",
                type: 'get',
                data: { query: query },
                dataType: 'json',
                success: function (json) {
                    var _html = "";
                    var LocationData = [];
                    $.each(json.response.venues, function (i, venues) {

                        if (venues.location != null) {
                            if (venues.location.formattedAddress.length > 0) {
                                _html += typeof venues.name != typeof undefined || venues.name != "" ? venues.name : "";   //Location name
                                _html += " - " + venues.location.formattedAddress.join();  //Whole location address
                            }
                            else if (venues.location.address != "" && venues.location.crossStreet != "" && venues.location.city != "" && venues.location.country != "") {
                                _html += venues.location.address + ", ";
                                _html += venues.location.crossStreet + ", ";
                                _html += venues.location.city + ", ";
                                _html += venues.location.country;
                            }
                            LocationData.push(_html);
                        }
                    });
                    return typeof LocationData.length == 0 ? false : process(LocationData);
                },
                error: function (xhr, status, err) {

                }
            });
        }
    });
}
eventMaster.prototype.getEvent = function (userId) {
    $("#loader")[0].style.display="";
    var fb = new Firebase("https://meetup-eplanner.firebaseio.com");
    var user = firebase.auth().currentUser;

    if (user) {
        var arr = [];

        firebase.database().ref('events/' + user.uid).once('value', function (userSnap) {
            arr = $.map(userSnap.val(), function (value, index) {
                return [value];
            });

            var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            var strVar = "";
            strVar += "<div class=\"row\">"

            for (var i = 0; i < arr.length; i++) {

                var item = arr[i];
                var strDate = item.eventstartdate;
                var datetime = new Date(strDate);
                var day = datetime.getDate();
                var month = datetime.getMonth() + 1; //month: 0-11
                var year = datetime.getFullYear();
                var date = year + "-" + day + "-" + month;
                var hours = datetime.getHours();
                var minutes = datetime.getMinutes();
                var seconds = datetime.getSeconds();
                var ampm = hours >= 12 ? 'PM' : 'AM';
                var time = hours + ":" + minutes + ' ' + ampm;
                var monthshort = monthShortNames[datetime.getMonth()];



                strVar += " <div class=\"[ col-xs-12 col-sm-offset-2 col-sm-8 ]\">";
                strVar += "                        <ul class=\"event-list\">";
                strVar += "                            <li>";
                strVar += "                                <time datetime=" + strDate + ">";
                strVar += "                                    <span class=\"day\">" + day + "<\/span>";
                strVar += "                                    <span class=\"month\">" + monthshort + "<\/span>";
                strVar += "                                    <span class=\"year\">" + year + "<\/span>";
                strVar += "                                    <span class=\"time\">" + time + "<\/span>";
                strVar += "                                <\/time>";
                strVar += "                                <div class=\"info\">";
                strVar += "                                    <h2 class=\"title\">" + item.eventname + "<\/h2>";
                strVar += "                                    <p class=\"desc\">" + item.eventtype + "<\/p>";
                strVar += "                                    <p class=\"desc\">" + item.eventLoc + "<\/p>";
                strVar += "                                    <p class=\"desc\">" + item.guest + "<\/p>";
                strVar += "                                <\/div>";
                strVar += "                            <\/li>";
                strVar += "                        <\/ul>";
                strVar += "                    <\/div>";

            }
            strVar += "</div>";
            var cont = $("#eventList");
            cont.empty();;
            cont.html(strVar);
            $("#loader")[0].style.display="none";
        });
        // var data = ref.child('events').child(user.uid);
    }
}
eventMaster.prototype.addHtml = function (event) {

            var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            var strVar = "";




                var item = event;
                var strDate = item.eventstartdate;
                var datetime = new Date(strDate);
                var day = datetime.getDate();
                var month = datetime.getMonth() + 1; //month: 0-11
                var year = datetime.getFullYear();
                var date = year + "-" + day + "-" + month;
                var hours = datetime.getHours();
                var minutes = datetime.getMinutes();
                var seconds = datetime.getSeconds();
                var ampm = hours >= 12 ? 'PM' : 'AM';
                var time = hours + ":" + minutes + ' ' + ampm;
                var monthshort = monthShortNames[datetime.getMonth()];



                strVar += " <div class=\"[ col-xs-12 col-sm-offset-2 col-sm-8 ]\">";
                strVar += "                        <ul class=\"event-list\">";
                strVar += "                            <li>";
                strVar += "                                <time datetime=" + strDate + ">";
                strVar += "                                    <span class=\"day\">" + day + "<\/span>";
                strVar += "                                    <span class=\"month\">" + monthshort + "<\/span>";
                strVar += "                                    <span class=\"year\">" + year + "<\/span>";
                strVar += "                                    <span class=\"time\">" + time + "<\/span>";
                strVar += "                                <\/time>";
                strVar += "                                <div class=\"info\">";
                strVar += "                                    <h2 class=\"title\">" + item.eventname + "<\/h2>";
                strVar += "                                    <p class=\"desc\">" + item.eventtype + "<\/p>";
                strVar += "                                    <p class=\"desc\">" + item.eventLoc + "<\/p>";
                strVar += "                                    <p class=\"desc\">" + item.guest + "<\/p>";
                strVar += "                                <\/div>";
                strVar += "                            <\/li>";
                strVar += "                        <\/ul>";
                strVar += "                    <\/div>";
            var cont = $("#eventList");
            var rowCont=cont.find(".row")
            rowCont.prepend(strVar);
        // var data = ref.child('events').child(authData.uid);

}
eventMaster.prototype.validateEvent = function () {
    $('#eventform')
        .find('[name="guest"]')
        // Revalidate the color when it is changed
        .change(function (e) {
            $('#eventform').bootstrapValidator('revalidateField', 'guest');
        })
        .end()
        .find('[name="sdate"]')
        // Revalidate the color when it is changed
        .change(function (e) {
            $('#eventform').bootstrapValidator('revalidateField', 'sdate');
        })
        .end()
        .find('[name="edate"]')
        // Revalidate the color when it is changed
        .change(function (e) {
            $('#eventform').bootstrapValidator('revalidateField', 'edate');
        })
        .end()
        .bootstrapValidator({
               framework: 'bootstrap',
               excluded: ':disabled',
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
                   event: {
                       row: '.col-xs-5',
                       validators: {
                           notEmpty: {
                               message: 'The name is required'
                           }
                       }
                   },
                   eventType: {
                       row: '.col-xs-5',
                       validators: {
                           notEmpty: {
                               message: 'Please select Event Type.'
                           }
                       }
                   },
                   eventHost: {
                       row: '.col-xs-5',
                       validators: {
                           notEmpty: {
                               message: 'Event Host is required'
                           }
                       }
                   },
                   guest: {
                       row: '.col-xs-5',
                       validators: {
                           callback: {
                               message: 'Please enter minimum 2 guest.',
                               callback: function (value, validator) {
                                   // Get the entered elements
                                   var options = validator.getFieldElements('guest').tagsinput('items');
                                   return (options !== null && options.length > 1 );
                               }
                           }

                       }
                   },
                   loc: {
                       row: '.col-xs-5',
                       validators: {
                           notEmpty: {
                               message: 'Please add location.'
                           }
                       }
                   },
                   sdate: {
                       row: '.col-xs-5',
                       validators: {
                           notEmpty: {
                               message: 'The start date (mm/dd/yy:hh:mm:ss) is required'
                           },
                           callback: {
                               callback: function (value, validator) {

                                   if (value === '') {
                                       return true;
                                   }
                                   var currdate= new Date();
                                   var endDate = new Date($("#edate")[0].value);
                                   var startDate= new Date(value);
                                   if(startDate != ''&& startDate < currdate){
                                       return{
                                           valid:false,
                                           message:'start Date  must be grater than or equal to current Date'
                                       }
                                   }
                                   else if(startDate != '' && endDate != '' && startDate >= endDate)
                                   {
                                       return{
                                           valid:false,
                                           message:'Start Date must be less than  End Date'
                                       }
                                   }
                                   else{return true;}
                                   // Get the entered elements

                               }
                           }
                       }
                   },
                   edate: {
                       row: '.col-xs-3',
                       validators: {
                           notEmpty: {
                               message: 'The end date (mm/dd/yy:hh:mm:ss) is required'
                           },
                           callback: {
                               callback: function (value, validator) {
                                   if (value === '') {
                                       return true;
                                   }

                                   var endDate = new Date(value);
                                   var startDate= new Date($("#sdate")[0].value);
                                   var currdate= new Date();

                                   if(startDate != '' && endDate != '' && startDate >= endDate)
                                   {
                                       return{
                                           valid:false,
                                           message:'End Date must be grater than Start Date'
                                       }
                                   }
                                   else{return true;}
                               }
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
            objEvent.createEvent();
            e.preventDefault();
        }
    });



}
