// assets
import { ShoppingOutlined } from "@ant-design/icons";

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: "marketsGroup",
  type: "group",
  title: "Markets",
  children: [
    {
      id: "markets",
      title: "Markets",
      type: "item",
      url: "/dashboard/markets",
      icon: ShoppingOutlined,
      breadcrumbs: false,
    },
  ],
};

export default dashboard;
