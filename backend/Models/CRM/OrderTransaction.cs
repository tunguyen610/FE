﻿using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace Novatic.Models.CRM
{
    public partial class OrderTransaction
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int TransactionId { get; set; }
        public int Active { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedTime { get; set; }


        [JsonIgnore]
        [IgnoreDataMember] 
        public virtual Orders Order { get; set; }
        public virtual Transactions Transaction { get; set; }
    }
}
