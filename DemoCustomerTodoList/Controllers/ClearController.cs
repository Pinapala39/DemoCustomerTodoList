using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DemoCustomerTodoList.Controllers
{
    public class ClearController : Controller
    {
        
        // GET: Clear
        public ActionResult Index()
        {
            var connection = new SqlConnection("data source=DESKTOP-P2IE2GN;initial catalog=TestDB;integrated security=True;multipleactiveresultsets=True;application name=EntityFramework&quot;");


            var command = new SqlCommand("sp_FullDelete", connection);
            command.CommandType = CommandType.StoredProcedure;
            connection.Open();
            command.ExecuteNonQuery();
            connection.Close();
            return RedirectToAction("Index", "Home");
        }


        //public ActionResult SearchFunc(string txtSearch)
        //{
        //    var connection = new SqlConnection("data source=DESKTOP-P2IE2GN;initial catalog=TestDB;integrated security=True;multipleactiveresultsets=True;application name=EntityFramework&quot;");

        //    var search = txtSearch;
        //    connection.Open();
            
        //        SqlDataAdapter Adp = new SqlDataAdapter("SELECT CustomerID,FirstName, LastName, DateofBirth " +
        //                            "FROM dbo.Customers " +
        //                            "WHERE LastName LIKE'%" + search + "%' OR " +
        //                            "FirstName LIKE'%" + search + "%' OR " +
        //                            "DateofBirth LIKE'%" + search + "%' " +
        //                            "ORDER BY LastName", connection);

        //        DataTable Dt = new DataTable();
        //        Adp.Fill(Dt);
        //    return RedirectToAction("Index", "Home");
        //}


    }

 
}