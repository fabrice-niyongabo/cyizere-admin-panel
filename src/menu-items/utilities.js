// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: "utilities",
  title: "Utilities",
  type: "group",
  children: [
    {
      id: "util-typography",
      title: "Typography",
      type: "item",
      url: "/dashboard/typography",
      icon: FontSizeOutlined,
    },
    {
      id: "util-color",
      title: "Color",
      type: "item",
      url: "/dashboard/color",
      icon: BgColorsOutlined,
    },
    {
      id: "util-shadow",
      title: "Shadow",
      type: "item",
      url: "/dashboard/shadow",
      icon: BarcodeOutlined,
    },
    {
      id: "ant-icons",
      title: "Ant Icons",
      type: "item",
      url: "/dashboard/icons/ant",
      icon: AntDesignOutlined,
      breadcrumbs: false,
    },
  ],
};

export default utilities;
