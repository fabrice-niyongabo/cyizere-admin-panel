// assets
import { ProfileOutlined, AlignLeftOutlined } from "@ant-design/icons";

const pages = {
  id: "usersGroup",
  title: "App Users",
  type: "group",
  children: [
    {
      id: "users",
      title: "Users",
      type: "item",
      url: "/dashboard/users",
      icon: AlignLeftOutlined,
    },
    {
      id: "riders",
      title: "Riders",
      type: "item",
      url: "/dashboard/riders",
      icon: ProfileOutlined,
    },
  ],
};

export default pages;
