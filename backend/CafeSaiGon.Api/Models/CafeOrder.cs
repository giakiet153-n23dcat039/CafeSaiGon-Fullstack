namespace CafeSaiGon.Api.Models;
public class CafeOrder
{
 public int Id {get;set;}
 public int CustomerId {get;set;}
 public AppUser? Customer {get;set;}
 public int? StaffId {get;set;}
 public AppUser? Staff {get;set;}
 public string CustomerName {get;set;} = "";
 public string Phone {get;set;} = "";
 public string Address {get;set;} = "";
 public string Note {get;set;} = "";
 public string Status {get;set;} = "PendingApproval";
 public DateTime CreatedUtc {get;set;} = DateTime.UtcNow;
 public DateTime? ApprovedUtc {get;set;}
 public List<CafeOrderItem> Items {get;set;} = new();
}
public class CafeOrderItem
{
 public int Id {get;set;}
 public int CafeOrderId {get;set;}
 public CafeOrder? CafeOrder {get;set;}
 public int ProductId {get;set;}
 public string ProductName {get;set;} = "";
 public int Quantity {get;set;}
 public long UnitPrice {get;set;}
}
