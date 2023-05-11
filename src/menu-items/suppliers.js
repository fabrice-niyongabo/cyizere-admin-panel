// assets
import { ShoppingOutlined } from "@ant-design/icons";

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: "marketsGroup",
  type: "group",
  title: "Suppliers",
  children: [
    {
      id: "suppliers",
      title: "All Suppliers",
      type: "item",
      url: "/dashboard/suppliers",
      icon: ShoppingOutlined,
      breadcrumbs: false,
    },
  ],
};

export default dashboard;
