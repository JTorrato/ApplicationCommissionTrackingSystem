﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRS.BusinessEntities
{
    public class CardApplicantCriteria
    {

        public string LastName { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public DateTime DateOfBirth { get; set; }

    }
}