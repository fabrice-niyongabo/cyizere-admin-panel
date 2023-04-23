// assets
import { ProfileOutlined, AlignLeftOutlined } from "@ant-design/icons";

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: "productsGroup",
  title: "Products",
  type: "group",
  children: [
    {
      id: "productCategories",
      title: "Categories",
      type: "item",
      url: "/dashboard/productcategories",
      icon: AlignLeftOutlined,
    },
    {
      id: "products",
      title: "All Products",
      type: "item",
      url: "/dashboard/products",
      icon: ProfileOutlined,
    },
  ],
};

export default pages;
