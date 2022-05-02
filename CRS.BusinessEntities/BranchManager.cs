﻿using System;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.ComponentModel;

namespace CRS.BusinessEntities
{
    public class BranchManager : ICRSPayee, ICRSBase
    {
        public string FirstName
        {
            get;
            set;
            
        }

        public string LastName
        {
            get;
            set;
        }

        public string MiddleName
        {
            get;
            set;
        }

        public DateTime DateOfBirth
        {
            get;
            set;
        }

        public string Code
        {
            get;
            set;

        }

        public char Gender
        {
            get;
            set;
            
        }

        public CivilStatus CivilStatus
        {
            get;
            set;
        }

        public string Address
        {
            get;
            set;
        }

        public string ZipCode
        {
            get;
            set;

        }

        public string ContactNumber
        {
            get;
            set;
        }

      

        public string Name
        {
            get;
            set;
        }

        public DateTime DateModified
        {
            get;
            set;
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
            get;
            set;

        }

        public int ID
        {
            get;
            set;
        }

        public RedemptionTransactionCollection RedemptionTransactions
        {
            get
            {
                throw new System.NotImplementedException();
            }
            set
            {
            }
        }

        public bool Validate()
        {
            
            return true;
        }

        
    }
}
