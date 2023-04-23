import { lazy } from "react";

import Loadable from "../components/Loadable";
import MainLayout from "../layout/MainLayout";

import ProtectedRoute from "../controllers/protected-route";

const DashboardDefault = Loadable(lazy(() => import("../pages/dashboard")));
const AntIcons = Loadable(
  lazy(() => import("../pages/components-overview/AntIcons"))
);

const ProductCategories = Loadable(
  lazy(() => import("../pages/product-categories"))
);
const Markets = Loadable(lazy(() => import("../pages/markets")));
const Products = Loadable(lazy(() => import("../pages/products")));
const DeliveryFees = Loadable(lazy(() => import("../pages/delivery-fees")));
const Dishes = Loadable(lazy(() => import("../pages/dishes")));
const Users = Loadable(lazy(() => import("../pages/users")));
const Agents = Loadable(lazy(() => import("../pages/agents")));
const Riders = Loadable(lazy(() => import("../pages/riders")));
const AgentsFees = Loadable(lazy(() => import("../pages/agentsFees")));
const AgentsWallet = Loadable(lazy(() => import("../pages/agents-wallet")));
const RidersWallet = Loadable(lazy(() => import("../pages/riders-wallet")));
const Transactions = Loadable(
  lazy(() => import("../pages/client-transactions"))
);
const Supplierspayment = Loadable(
  lazy(() => import("../pages/supplierspayment"))
);
const SystemFees = Loadable(lazy(() => import("../pages/system-fees")));
const PackagingFees = Loadable(lazy(() => import("../pages/packagingFees")));
const Orders = Loadable(lazy(() => import("../pages/orders")));
const Profile = Loadable(lazy(() => import("../pages/profile")));
const TrackRiders = Loadable(lazy(() => import("../pages/track-rider")));

const MainRoutes = {
  path: "/dashboard",
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: "/dashboard",
      element: <DashboardDefault />,
    },
    {
      path: "/dashboard/markets",
      element: <Markets />,
    },
    {
      path: "/dashboard/productcategories",
      element: <ProductCategories />,
    },
    {
      path: "/dashboard/products",
      element: <Products />,
    },
    {
      path: "/dashboard/fees",
      element: <DeliveryFees />,
    },
    {
      path: "/dashboard/dishes",
      element: <Dishes />,
    },
    {
      path: "/dashboard/users",
      element: <Users />,
    },
    {
      path: "/dashboard/agents",
      element: <Agents />,
    },
    {
      path: "/dashboard/riders",
      element: <Riders />,
    },
    {
      path: "/dashboard/riders/:id",
      element: <TrackRiders />,
    },
    {
      path: "/dashboard/agentsfees",
      element: <AgentsFees />,
    },
    {
      path: "/dashboard/transactions",
      element: <Transactions />,
    },
    {
      path: "/dashboard/agentswallet",
      element: <AgentsWallet />,
    },
    {
      path: "/dashboard/riderswallet",
      element: <RidersWallet />,
    },
    {
      path: "/dashboard/riderswallet",
      element: <RidersWallet />,
    },
    {
      path: "/dashboard/supplierspayment",
      element: <Supplierspayment />,
    },
    {
      path: "/dashboard/systemfees",
      element: <SystemFees />,
    },
    {
      path: "/dashboard/packagingfees",
      element: <PackagingFees />,
    },
    {
      path: "/dashboard/orders",
      element: <Orders />,
    },
    {
      path: "/dashboard/profile",
      element: <Profile />,
    },
  ],
};

export default MainRoutes;
