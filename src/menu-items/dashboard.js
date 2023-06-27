// assets
import { DashboardOutlined, BellOutlined } from "@ant-design/icons";

// icons
const icons = {
  DashboardOutlined,
  BellOutlined,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: "group-dashboard",
  type: "group",
  children: [
    {
      id: "dashboard",
      title: "Dashboard",
      type: "item",
      url: "/dashboard",
      icon: icons.DashboardOutlined,
      breadcrumbs: false,
    },
    {
      id: "notifications",
      title: "Notifications",
      type: "item",
      url: "/dashboard/notifications",
      icon: icons.BellOutlined,
      breadcrumbs: false,
    },
  ],
};

export default dashboard;
