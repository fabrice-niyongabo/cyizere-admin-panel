// assets
import { ShoppingOutlined } from "@ant-design/icons";

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: "feesGroup",
  type: "group",
  title: "Fees Config",
  children: [
    {
      id: "deliveryFees",
      title: "Delivery Fees",
      type: "item",
      url: "/dashboard/fees",
      icon: ShoppingOutlined,
      breadcrumbs: false,
    },
    {
      id: "systemfees",
      title: "System Fees",
      type: "item",
      url: "/dashboard/systemfees",
      icon: ShoppingOutlined,
      breadcrumbs: false,
    },
    {
      id: "packagingfees",
      title: "Packaging Fees",
      type: "item",
      url: "/dashboard/packagingfees",
      icon: ShoppingOutlined,
      breadcrumbs: false,
    },
  ],
};

export default dashboard;
