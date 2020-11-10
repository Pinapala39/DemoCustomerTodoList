//function AppendRow(row, ContactID, contacttype, customerid, contactval) {

   
//    $(".ContactID", row).find(".label").html(ContactID);
//    $(".ContactID", row).find(".text").val(ContactID);

//    $(".TypeofContact", row).find(".label").html(contacttype);
//    $(".TypeofContact", row).find(".text").val(contacttype);

//    $(".CustomerID", row).find(".label").html(customerid);
//    $(".CustomerID", row).find(".text").val(customerid);


//    $(".ContactValue", row).find(".label").html(contactval);
//    $(".ContactValue", row).find(".text").val(contactval);

//    row.find(".link").show();
//    $("#WebGrid TBODY").append(row);
//};

//Appending a new row to the grid --End
//Add a new row in the grid

$("#btnAdd").click(function () {
    //Reference the WebGrid.
    var webGrid = $("#WebGrid");
    var row = webGrid.find("tr").eq(1);

    //Check if row is dummy, if yes then remove.
    if ($.trim(row.find("td").eq(0).html()) == "") {
        //row.remove();
    }
    row = row.clone(true);
    var contTyp = document.getElementById("ddlCnt");
   
    var exactConttype = contTyp.value;

    
    var contactval = document.getElementById("txtContactValue").value;
    
    $.ajax({
        type: "POST",
        dataType: "json",
        data: JSON.stringify({ contacttype: exactConttype, contactval: contactval }),
        url: "/Home/InsertContacts",
        contentType: "application/json; charset=utf-8",

        success: function (item) {
            window.location.reload();
        }

        
    });


});


//Edit event handler. --Start
$("body").on("click", "#WebGrid TBODY .Edit", function () {
    var row = $(this).closest("tr");
    $("td", row).each(function () {
        if ($(this).find(".text").length > 0) {
            $(this).find(".text").show();
            $(this).find(".label").hide();
        }
    });
    row.find(".Update").show();
    row.find(".Cancel").show();
    row.find(".Delete").hide();
    $(this).hide();
});
//Edit event handler. --End

//Update event handler. --Start
$("body").on("click", "#WebGrid TBODY .Update", function () {
    var row = $(this).closest("tr");
    $("td", row).each(function () {
        if ($(this).find(".text").length > 0) {
            var span = $(this).find(".label");
            var input = $(this).find(".text");
            span.html(input.val());
            span.show();
            input.hide();
        }
    });
    row.find(".Edit").show();
    row.find(".Delete").show();
    row.find(".Cancel").hide();
    $(this).hide();

    var contacts = {};
    contacts.ContactID = row.find(".ContactID").find(".label").html();
    contacts.TypeofContact = row.find(".TypeofContact").find(".label").html();
    contacts.CustomerID = row.find(".CustomerID").find(".label").html();
    contacts.ContactValue = row.find(".ContactValue").find(".label").html();

    $.ajax({
        type: "POST",
        url: "/Home/UpdateContacts",
        data: '{contacts:' + JSON.stringify(contacts) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });
});
$("body").on("click", "#WebGrid TBODY .Cancel", function () {
    var row = $(this).closest("tr");
    $("td", row).each(function () {
        if ($(this).find(".text").length > 0) {
            var span = $(this).find(".label");
            var input = $(this).find(".text");
            input.val(span.html());
            span.show();
            input.hide();
        }
    });
    row.find(".Edit").show();
    row.find(".Delete").show();
    row.find(".Update").hide();
    $(this).hide();
});

//Update event handler. --End

//Delete event handler. --Start
$("body").on("click", "#WebGrid TBODY .Delete", function () {
    if (confirm("Do you want to delete this row?")) {
        var row = $(this).closest("tr");
        var contactId = row.find(".label").html();
        $.ajax({
            type: "POST",
            url: "/Home/DeleteContact",
            data: '{contactId: ' + contactId + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if ($("#WebGrid TBODY tr").length == 1) {
                    row.find(".label").html("");
                    row.find(".text").val("");
                    row.find(".link").hide();
                } else {
                    //row.remove();
                }
            }
        });
    }
});
        //Delete event handler. --End