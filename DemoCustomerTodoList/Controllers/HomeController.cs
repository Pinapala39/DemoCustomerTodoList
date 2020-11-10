using DemoCustomerTodoList.Models;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity.Validation;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace DemoCustomerTodoList.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home Controller to load the Customers Grid--start
        
        public ActionResult Index(string searchtext)
        {
            TestDBEntities2 entities = new TestDBEntities2();
            List<Customer> customers = new List<Customer>();

           
            if (searchtext == null)
            {
                customers = entities.Customers.ToList();

            }
            else
            {
                customers = entities.Customers.Where(p => p.FirstName.
                Contains(searchtext)).ToList();
            }

            return View(customers);
        }

        
        [HttpPost]
        //Search Functionality for customer Grid--Start
        public ActionResult SearchCustomer(string txtsearch)
        {
            TestDBEntities2 entities = new TestDBEntities2();
            List<Customer> cst = entities.Customers.Where(p => p.FirstName.Contains(txtsearch)).ToList();
                return View(cst);
        }
        //Search Functionality for customer Grid--End


        //Inserting a new records into gridview by adding --start

        [HttpPost]
        public JsonResult InsertCustomer(string fname, string lname, string dob)
        {
            if (!String.IsNullOrEmpty(fname) && !String.IsNullOrEmpty(lname) && !String.IsNullOrEmpty(dob)) { 
            using (TestDBEntities2 entities = new TestDBEntities2())
            {


                Customer customer = new Customer();
                customer.FirstName = fname;
                customer.Lastname = lname;
                customer.DateofBirth = DateTime.Parse(dob);
                entities.Customers.Add(customer);
                entities.SaveChanges();

            } }

            return Json(fname,lname,null);
            
        }
        //Inserting a new records into gridview by adding --END

        //Updating the existing records into gridview --Start
        [HttpPost]
        public ActionResult UpdateCustomer(Customer customer)
        {
            using (TestDBEntities2 entities = new TestDBEntities2())
            {
                Customer updatedCustomer = (from c in entities.Customers
                                            where c.CustomerID == customer.CustomerID
                                            select c).FirstOrDefault();
                updatedCustomer.FirstName = customer.FirstName;
                updatedCustomer.Lastname = customer.Lastname;
                updatedCustomer.DateofBirth = customer.DateofBirth;
                entities.SaveChanges();
            }

            return new EmptyResult();
        }
        //Updating the existing records into gridview --END



        //Deleting the existing records into gridview --Start
        [HttpPost]
        public ActionResult DeleteCustomer(int customerId)
        {
            using (TestDBEntities2 entities = new TestDBEntities2())
            {
                Customer customer = (from c in entities.Customers
                                     where c.CustomerID == customerId
                                     select c).FirstOrDefault();
                entities.Customers.Remove(customer);
                entities.SaveChanges();
            }
           // return new EmptyResult();
            return Json(customerId, JsonRequestBehavior.AllowGet);

        }
        //Deleting the existing records into gridview --End

        //Customer Functionality Ends

        //Contact FUnctionality Begins

        //Contact Info Functionality grid load based on CustomerID-----Start
        [HttpGet]
        [Route("Home/ContactsInfo/{id:int}")] //made use of Attribute Routing by providing mvcroutes in routeconfig.cs page
        public ActionResult ContactsInfo(int id)
        {
            
            TestDBEntities5 entities = new TestDBEntities5();
            var contactsGrid = entities.ContactInformations.Where(d => d.CustomerID == id).ToList();
            
            return View(contactsGrid);
        }
        //Contact Info Functionality grid load based on CustomerID-----End

       
        //Inserting a new records into gridview by adding --Start
    
        [HttpPost]
        
        public void InsertContacts(string contacttype, string id, string contactval)
        {
            using (TestDBEntities5 entities = new TestDBEntities5())
            {
                ContactInformation contactsinformation = new ContactInformation();
                contactsinformation.TypeofContact = contacttype;
                contactsinformation.ContactValue = contactval;
                contactsinformation.CustomerID= Convert.ToInt32(Request.UrlReferrer.Segments.Last());
                entities.ContactInformations.Add(contactsinformation);
                entities.SaveChanges();
                RedirectToAction("ContactsInfo", Convert.ToInt32(Request.UrlReferrer.Segments.Last()));
            }
            // return Json(contacttype,contactval,JsonRequestBehavior.AllowGet);
        }
        //Inserting a new records into gridview by adding --END


        //Update a new records into gridview by adding --END
        [HttpPost]
        public ActionResult UpdateContacts(ContactInformation contacts)
        {
            using (TestDBEntities5 entities = new TestDBEntities5())
            {
                ContactInformation updatedContact = (from c in entities.ContactInformations
                                            where c.ContactID == contacts.ContactID
                                            select c).FirstOrDefault();
                updatedContact.TypeofContact = contacts.TypeofContact;
                updatedContact.ContactValue = contacts.ContactValue;
                entities.SaveChanges();
            }

            return new EmptyResult();
        }
         //Contact Info Functionality grid update-----End

        //Contact Info Functionality grid Delete-----Start
        [HttpPost]
        public ActionResult DeleteContact(int contactId)
        {
            using (TestDBEntities5 entities = new TestDBEntities5())
            {
                ContactInformation contact = (from c in entities.ContactInformations
                                     where c.ContactID == contactId
                                              select c).FirstOrDefault();
                entities.ContactInformations.Remove(contact);
                entities.SaveChanges();
            }
            return new EmptyResult();
        }
        //Contact Info Functionality grid Delete-----End

//Contact FUnctionality Ends

   
            

//TodoList FUnctionality Begins



        //ToDo list Functionality --Load grid according to CustomerID selection -Start
         [HttpGet]
        [Route("Home/TodoList/{id:int}")] // made use of Attribute Routing by providing mvcroutes in routeconfig.cs page
        public ActionResult TodoList(int id)
        {
            TestDBEntities6 entities = new TestDBEntities6();
            var TodolistGrid = entities.TODOLists.Where(d => d.CustomerID == id).ToList();
            return View(TodolistGrid);
            
        }
        //ToDo list Functionality --Load grid according to CustomerID selection -END


        

        //Inserting a new records into gridview by adding --Start

        [HttpPost]
        public JsonResult InsertTodoList(string description, DateTime? Creationdt, string Resolved) 
        {
            using (TestDBEntities6 entities = new TestDBEntities6())
            {

                string custID = Request.UrlReferrer.Segments.Last();
                    //Request.QueryString["CustomerID"];
                TODOList tODO = new TODOList();
                tODO.Description = description;
                tODO.CreationDate = Convert.ToDateTime(Creationdt);
                tODO.CustomerID =Convert.ToInt32(custID);
                tODO.Resolved = Resolved=="on"?true:false;
                entities.TODOLists.Add(tODO);
                entities.SaveChanges();
             
            }


            return Json(description, null, null);
        }
        //Inserting a new records into gridview by adding --END

        //Updating the existing records into gridview --Start
        [HttpPost]
        public ActionResult UpdateTdlistInfo(TODOList tlist)
        {
            using (TestDBEntities6 entities = new TestDBEntities6())
            {
                TODOList tdlist = (from c in entities.TODOLists
                                                     where c.TdlistID == tlist.TdlistID
                                   select c).FirstOrDefault();
                tdlist.Description = tlist.Description;
                tdlist.CreationDate = tlist.CreationDate;
                tdlist.Resolved = tlist.Resolved;
                entities.SaveChanges();
            }

            return new EmptyResult();
        }
        //TodoList functionality --Update operation -Start//

        //TodoList functionality --Delete operation -Start//
        [HttpPost]
        public ActionResult DeleteTodolist(int tdlist)
        {
            using (TestDBEntities6 entities = new TestDBEntities6())
            {
                TODOList tODO = (from c in entities.TODOLists
                                              where c.TdlistID == tdlist
                                   select c).FirstOrDefault();
                entities.TODOLists.Remove(tODO);
                entities.SaveChanges();
            }
            return new EmptyResult();
        }
        //TodoList functionality --Delete operation -End//

        //Todolist FUnctionality Ends


        
            
            
        //Bulk insert into sql Table --Start
        [HttpPost]
        public ActionResult Index(HttpPostedFileBase file)
        {
            string filePath = string.Empty;
            if (file != null)
            {
                string path = Server.MapPath("~/New Folder/Test.xlsx");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                filePath = path + Path.GetFileName(file.FileName);
                string extension = Path.GetExtension(file.FileName);
                file.SaveAs(filePath);

                string conString = string.Empty;
                switch (extension)
                {
                   
                    case ".xlsx": //Excel 07 and above.
                        conString = ConfigurationManager.ConnectionStrings["Excel07ConString"].ConnectionString;
                        break;
                }

                DataTable dt = new DataTable();
                conString = string.Format(conString, filePath);

                using (OleDbConnection connExcel = new OleDbConnection(conString))
                {
                    using (OleDbCommand cmdExcel = new OleDbCommand())
                    {
                        using (OleDbDataAdapter odaExcel = new OleDbDataAdapter())
                        {
                            cmdExcel.Connection = connExcel;

                            //Get the name of First Sheet.
                            connExcel.Open();
                            DataTable dtExcelSchema;
                            dtExcelSchema = connExcel.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                            string sheetName = dtExcelSchema.Rows[0]["TABLE_NAME"].ToString();
                            connExcel.Close();

                            //Read Data from First Sheet.
                            connExcel.Open();
                            cmdExcel.CommandText = "SELECT * From [" + sheetName + "]";
                            odaExcel.SelectCommand = cmdExcel;
                            odaExcel.Fill(dt);
                            connExcel.Close();
                        }
                    }
                }

                conString = "data source=DESKTOP-P2IE2GN;initial catalog=TestDB;integrated security=True;multipleactiveresultsets=True;application name=EntityFramework&quot;";
                using (SqlConnection con = new SqlConnection(conString))
                {
                    using (SqlBulkCopy sqlBulkCopy = new SqlBulkCopy(con))
                    {
                        //Set the database table name.
                        sqlBulkCopy.DestinationTableName = "dbo.Customers";

                        //[OPTIONAL]: Map the Excel columns with that of the database table
                        sqlBulkCopy.ColumnMappings.Add("CustomerID", "CustomerID");
                        sqlBulkCopy.ColumnMappings.Add("FirstName", "FirstName");
                        sqlBulkCopy.ColumnMappings.Add("Lastname", "Lastname");
                        sqlBulkCopy.ColumnMappings.Add("DateofBirth", "DateofBirth");
                        con.Open();
                        sqlBulkCopy.WriteToServer(dt);
                        con.Close();
                    }
                }
            }
            ViewBag.Success = "File Imported and excel data saved into database";

            return RedirectToAction("Index", "Home");
        }
        //Bulk insert into sql Table --End


      

    }

}
