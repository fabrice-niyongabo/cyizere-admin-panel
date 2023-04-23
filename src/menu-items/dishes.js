// assets
import { ShoppingOutlined } from "@ant-design/icons";

const dashboard = {
  id: "dishesGroup",
  type: "group",
  title: "Dishes",
  children: [
    {
      id: "dishes",
      title: "Manage dishes",
      type: "item",
      url: "/dashboard/dishes",
      icon: ShoppingOutlined,
      breadcrumbs: false,
    },
  ],
};

export default dashboard;
