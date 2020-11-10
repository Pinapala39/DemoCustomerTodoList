
$("#btnSearch").click(function () {
    var webGrid = $("#WebGrid");

    var txtsearch = document.getElementById("txtSearch").value;
    if (jQuery.trim(txtsearch).length > 0) {

        $.ajax({
            type: "POST",
            dataType: "json",
            data: JSON.stringify({ txtsearch: txtsearch }),
            url: "/Home/SearchCustomerv",
            contentType: "application/json; charset=utf-8",
            success: function (response) {

                alert('hi');
               //window.location.reload();
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });

    }

});

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
    var txtFName = document.getElementById("txtFName").value;
    var txtLName = document.getElementById("txtLName").value;
    var txtDOB = document.getElementById("txtDOB").value;

    $.ajax({
        type: "POST",
        dataType: "json",
        data: JSON.stringify({ fname: txtFName, lname: txtLName, dob: txtDOB }),
        url: "/Home/InsertCustomer",
        contentType: "application/json; charset=utf-8",

        success: function (response) {
            window.location.reload();
            //var row = $("#WebGrid TBODY tr:last-child").clone();
            //if (row.find(".label").is(":empty")) {
            //    $("#WebGrid TBODY tr:last-child").remove();
            //}
            AppendRow(row, result.fname, result.lname, result.dob);
        }

    });


});


//Edit event handler.
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

//Update event handler.
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

    var customer = {};
    customer.CustomerId = row.find(".CustomerId").find(".label").html();
    customer.FirstName = row.find(".FirstName").find(".label").html();
    customer.LastName = row.find(".LastName").find(".label").html();
    customer.DateOfBirth = row.find(".DateOfBirth").find(".label").html();

    $.ajax({
        type: "POST",
        url: "/Home/UpdateCustomer",
        data: '{customer:' + JSON.stringify(customer) + '}',
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
//Delete event handler.
$("body").on("click", "#WebGrid TBODY .Delete", function () {
    if (confirm("Do you want to delete this row?")) {
        var row = $(this).closest("tr");
        var customerId = row.find(".label").html();
        $.ajax({
            type: "POST",
            url: "/Home/DeleteCustomer",
            data: '{customerId: ' + customerId + '}',
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