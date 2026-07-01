// assets
import {
  ProfileOutlined,
  AlignLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: "productsGroup",
  title: "Products",
  type: "group",
  children: [
    {
      id: "shopCategories",
      title: "Shop Categories",
      type: "item",
      url: "/dashboard/shopcategories",
      icon: AlignLeftOutlined,
    },
    {
      id: "productCategories",
      title: "Product Categories",
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
    {
      id: "createProduct",
      title: "Create Product",
      type: "item",
      url: "/dashboard/products/create",
      icon: PlusOutlined,
    },
  ],
};

export default pages;
