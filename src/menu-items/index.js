// project import
import products from "./products";
import suppliers from "./suppliers";
import dashboard from "./dashboard";
import sales from "./sales";
import fees from "./fees";
import users from "./users";
import transactions from "./transactions";
import web from "./web";
// import payments from "./payments";

const menuItems = {
  items: [
    dashboard,
    suppliers,
    products,
    // payments,
    sales,
    web,
    fees,
    users,
    transactions,
  ],
};

export default menuItems;
