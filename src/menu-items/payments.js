// assets
import { ShoppingOutlined } from "@ant-design/icons";

const dashboard = {
  id: "paymentsGroup",
  type: "group",
  title: "Payments",
  children: [
    {
      id: "suppliersPayments",
      title: "Suppliers Payments",
      type: "item",
      url: "/dashboard/supplierspayment",
      icon: ShoppingOutlined,
      breadcrumbs: false,
    },
  ],
};

export default dashboard;
