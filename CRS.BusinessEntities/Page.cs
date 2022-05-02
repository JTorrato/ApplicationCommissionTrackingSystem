﻿using System;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.ComponentModel;

namespace CRS.BusinessEntities
{
    public class Page : ICRSBase 
    {
        public string Code
        {
            get;set;
            
        }

        public string Name
        {
            get;set;
            
        }

        public DateTime DateModified
        {
            get;set;
            
        }

        public DateTime DateCreated
        {
            get;
            
            set;
            
        }

        public string ModifiedBy
        {
            get;

            set;

        }

        public string CreatedBy
        {
            get;set;
            
        }

        public int ID
        {
            get;set;
            
        }

        public string Title { get; set; }


        public bool Validate()
        {
            return true;
        }
    }
}
