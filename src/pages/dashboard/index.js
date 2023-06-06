import { useState } from "react";

// material-ui
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

// project import
import OrdersTable from "./OrdersTable";
import IncomeAreaChart from "./IncomeAreaChart";
import MonthlyBarChart from "./MonthlyBarChart";
import ReportAreaChart from "./ReportAreaChart";
import SalesColumnChart from "./SalesColumnChart";
import MainCard from "../../components/MainCard";
import AnalyticEcommerce from "../../components/cards/statistics/AnalyticEcommerce";

// assets
import {
  GiftOutlined,
  MessageOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import avatar1 from "../../assets/images/users/avatar-1.png";
import avatar2 from "../../assets/images/users/avatar-2.png";
import avatar3 from "../../assets/images/users/avatar-3.png";
import avatar4 from "../../assets/images/users/avatar-4.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchOrders } from "../../actions/orders";
import { BACKEND_URL } from "../../constants";
import { currencyFormatter, errorHandler, setHeaders } from "../../helpers";
import axios from "axios";
import { fetchPaymentList } from "../../actions/supplierpayments";
import { fetchNotifications } from "../../actions/notifications";

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: "1rem",
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: "auto",
  right: "auto",
  alignSelf: "flex-start",
  transform: "none",
};

// sales report status
const status = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "month",
    label: "This Month",
  },
  {
    value: "year",
    label: "This Year",
  },
];

const DashboardDefault = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { orders, isLoading } = useSelector((state) => state.orders);
  const { payments } = useSelector((state) => state.supplierpayments);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [value, setValue] = useState("today");
  const [slot, setSlot] = useState("week");

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchPaymentList());
    dispatch(fetchNotifications());
    fetchUsers();
    fetchTransactions();
  }, []);

  const fetchUsers = () => {
    axios
      .get(BACKEND_URL + "/users/", setHeaders(token))
      .then((res) => {
        setUsers(res.data.clients);
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const fetchTransactions = () => {
    axios
      .get(BACKEND_URL + "/transactions/", setHeaders(token))
      .then((res) => {
        setTransactions(res.data.transactions);
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Orders"
          count={orders.length}
          extra="/dashboard/orders"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Users"
          count={users.length}
          extra="/dashboard/users"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Transactions"
          count={transactions.length}
          color="warning"
          extra="/dashboard/transactions"
        />
      </Grid>
      {/* <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Supplier Payments"
          count={
            payments.filter((item) => item.paymentStatus === "PENDING").length
          }
          color="warning"
          extra="/dashboard/supplierspayment"
        />
      </Grid> */}

      <Grid
        item
        md={8}
        sx={{ display: { sm: "none", md: "block", lg: "none" } }}
      />

      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Orders</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable orders={orders} isLoading={isLoading} />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Transaction History</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List
            component="nav"
            sx={{
              px: 0,
              py: 0,
              "& .MuiListItemButton-root": {
                py: 1.5,
                "& .MuiAvatar-root": avatarSX,
                "& .MuiListItemSecondaryAction-root": {
                  ...actionSX,
                  position: "relative",
                },
              },
            }}
          >
            {transactions.slice(0, 7).map((item, index) => (
              <ListItemButton divider key={index}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      color: "success.main",
                      bgcolor: "success.lighter",
                    }}
                  >
                    <GiftOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1">
                      {item.status} | {item.spTransactionId}
                    </Typography>
                  }
                  secondary={new Date(item.createdAt).toUTCString()}
                />
                <ListItemSecondaryAction>
                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" noWrap>
                      {currencyFormatter(item.paidAmount)} RWF
                    </Typography>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItemButton>
            ))}
          </List>
        </MainCard>
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Sales Report</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 1.75 }}>
          <SalesColumnChart transactions={transactions} orders={orders} />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
