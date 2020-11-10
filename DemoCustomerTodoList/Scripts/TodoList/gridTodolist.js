


$(function () {
    $('.chkActive').click(function () {
        alert($(this).val() + ' ' + (this.checked ? 'checked' : 'unchecked'));
    });
});//Appending a new row to the grid --Start
function AppendRow(row, tdlist, description, Creationdt, Resolved) {

    $(".TdlistID", row).find(".label").html(tdlist);
    $(".TdlistID", row).find(".text").val(tdlist);

    $(".Description", row).find(".label").html(description);
    $(".Description", row).find(".text").val(description);

    $(".CreationDate", row).find(".label").html(Creationdt);
    $(".CreationDate", row).find(".text").val(Creationdt);

    $(".Resolved", row).find(".label").html(Resolved);
    $(".Resolved", row).find(".text").val(Resolved);
    

    row.find(".link").show();
    $("#WebGrid TBODY").append(row);
};
//Appending a new row to the grid --End



//Add event handler. --Start

$("#btnAdd").click(function () {
    //Reference the WebGrid.
    var webGrid = $("#WebGrid");
    var row = webGrid.find("tr").eq(1);

    //Check if row is dummy, if yes then remove.
    if ($.trim(row.find("td").eq(0).html()) == "") {
        //row.remove();
    }
    row = row.clone(true);
    var txtDesc = document.getElementById("txtDescription").value;
    var txtCreatedt = document.getElementById("txtCreationdt").value;
    var chkupdate = $(document.getElementById("chkresolved")).prop('checked');
$.ajax({
        type: "POST",
        dataType: "json",
        data: JSON.stringify({ description: txtDesc, Creationdt: txtCreatedt, Resolved: chkupdate }),
        url: "/Home/InsertTodoList",
        contentType: "application/json; charset=utf-8",

        success: function (item) {
          window.location.reload();
            //AppendRow(row, r.fname, r.lname, r.dob);
        }

    });
});

//Edit event handler.--Start
$("body").on("click", "#WebGrid TBODY .Edit", function () {
    var row = $(this).closest("tr");
    $("td", row).each(function () {
        if ($(this).find(".text").length > 0) {
            $(this).find(".text").show();
            $(this).find(".label").hide();
            $("edit-mode").attr("disabled", true);
            //document.getElementById("submitchkbox").disabled = false;
            
        }
    });
    row.find(".Update").show();
    row.find(".Cancel").show();
    row.find(".Delete").hide();
    $(this).hide();
});
//Edit event handler.--End



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
    document.getElementById("submitchkbox").disabled = true;
    $(this).hide();

    var tlist = {};
    tlist.TdlistID = row.find(".TdlistID").find(".label").html();
    tlist.Description = row.find(".Description").find(".label").html();
    tlist.CreationDate = row.find(".CreationDate").find(".label").html();
    tlist.Resolved = document.getElementById("submitchkbox").checked;

    $.ajax({
        type: "POST",
        url: "/Home/UpdateTdlistInfo",
        data: '{tlist:' + JSON.stringify(tlist) + '}',
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
    document.getElementById("submitchkbox").disabled = true;
    $(this).hide();
});


//Update event handler. --END


//Delete event handler. --Start
$("body").on("click", "#WebGrid TBODY .Delete", function () {
    if (confirm("Do you want to delete this row?")) {
        var row = $(this).closest("tr");
        var tdlist = row.find(".label").html();
        $.ajax({
            type: "POST",
            url: "/Home/DeleteTodolist",
            data: '{tdlist: ' + tdlist + '}',
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