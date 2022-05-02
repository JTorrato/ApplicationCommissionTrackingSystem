﻿using System;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;



namespace CRS.BusinessEntities
{
    public class ProductivityReportYearly
    {


        public string SourceName {get;set;}
        
        public int GroupYear { get; set; }

        public int GroupCount { get; set; }

        

        public bool Validate()
        {
            return true;
        }
    }
}
