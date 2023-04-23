// assets
import { ProfileOutlined, AlignLeftOutlined } from "@ant-design/icons";

const pages = {
  id: "transactionsGroup",
  title: "Transactions",
  type: "group",
  children: [
    {
      id: "clientTransactions",
      title: "Client Transactions",
      type: "item",
      url: "/dashboard/transactions",
      icon: AlignLeftOutlined,
    },
    {
      id: "agentsWallet",
      title: "Agents Wallet",
      type: "item",
      url: "/dashboard/agentswallet",
      icon: ProfileOutlined,
    },
    {
      id: "ridersWallet",
      title: "Riders Wallet",
      type: "item",
      url: "/dashboard/riderswallet",
      icon: ProfileOutlined,
    },
  ],
};

export default pages;
