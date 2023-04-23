// assets
import { ProfileOutlined, AlignLeftOutlined } from "@ant-design/icons";

const pages = {
  id: "salesGroup",
  title: "Sales",
  type: "group",
  children: [
    {
      id: "orders",
      title: "Orders",
      type: "item",
      url: "/dashboard/orders",
      icon: ProfileOutlined,
    },
  ],
};

export default pages;
