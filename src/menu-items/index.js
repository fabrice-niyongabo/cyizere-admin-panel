// project import
import products from "./products";
import suppliers from "./suppliers";
import dashboard from "./dashboard";
import sales from "./sales";
import fees from "./fees";
import dishes from "./dishes";
import users from "./users";
import transactions from "./transactions";
import payments from "./payments";

const menuItems = {
  items: [
    dashboard,
    suppliers,
    products,
    payments,
    sales,
    fees,
    dishes,
    users,
    transactions,
  ],
};

export default menuItems;
