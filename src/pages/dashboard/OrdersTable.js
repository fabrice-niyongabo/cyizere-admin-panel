import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

// material-ui
import {
  Box,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

// third-party
import NumberFormat from "react-number-format";

// project import
import Dot from "../../components/@extended/Dot";
import Loader from "../loader";

function createData(trackingNo, name, fat, fat2, carbs, protein) {
  return { trackingNo, name, fat, fat2, carbs, protein };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
  {
    id: "Order ID",
    align: "left",
    disablePadding: false,
    label: "Tracking No.",
  },
  {
    id: "name",
    align: "left",
    disablePadding: true,
    label: "Client Names",
  },
  {
    id: "fat",
    align: "right",
    disablePadding: false,
    label: "Total Products",
  },
  {
    id: "fat2",
    align: "right",
    disablePadding: false,
    label: "Date",
  },
  {
    id: "carbs",
    align: "left",
    disablePadding: false,

    label: "Status",
  },
  {
    id: "protein",
    align: "right",
    disablePadding: false,
    label: "Total Amount",
  },
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string,
};

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 0:
      color = "warning";
      title = "Pending";
      break;
    case 1:
      color = "success";
      title = "PAID";
      break;
    case 2:
      color = "error";
      title = "Failed";
      break;
    default:
      color = "primary";
      title = "None";
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.number,
};

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable({ orders, isLoading }) {
  const [order] = useState("asc");
  const [orderBy] = useState("trackingNo");
  const [selected] = useState([]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const rw = [];
    for (let i = 0; i < orders.length; i++) {
      if (i > 9) {
        break;
      }
      rw.push(
        createData(
          orders[i].id,
          orders[i].client?.names,
          orders[i]?.cartItems?.length,
          new Date(orders[i].createdAt).toLocaleDateString(),
          orders[i].paymentStatus === "PENDING"
            ? 0
            : orders[i].paymentStatus === "FAILED"
            ? 2
            : 1,
          Number(orders[i].cartTotalAmount) +
            Number(orders[i].systemFees) +
            Number(orders[i].deliveryFees) +
            Number(orders[i].agentFees) +
            Number(orders[i].packagingFees)
        )
      );
    }
    setRows(rw);
  }, [orders]);

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          <TableContainer
            sx={{
              width: "100%",
              overflowX: "auto",
              position: "relative",
              display: "block",
              maxWidth: "100%",
              "& td, & th": { whiteSpace: "nowrap" },
            }}
          >
            <Table
              aria-labelledby="tableTitle"
              sx={{
                "& .MuiTableCell-root:first-child": {
                  pl: 2,
                },
                "& .MuiTableCell-root:last-child": {
                  pr: 3,
                },
              }}
            >
              <OrderTableHead order={order} orderBy={orderBy} />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy)).map(
                  (row, index) => {
                    const isItemSelected = isSelected(row.trackingNo);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.trackingNo}
                        selected={isItemSelected}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          align="left"
                        >
                          <Link color="secondary" component={RouterLink} to="">
                            {row.trackingNo}
                          </Link>
                        </TableCell>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="right">{row.fat}</TableCell>
                        <TableCell align="right">{row.fat2}</TableCell>
                        <TableCell align="left">
                          <OrderStatus status={row.carbs} />
                        </TableCell>
                        <TableCell align="right">
                          <NumberFormat
                            value={row.protein}
                            displayType="text"
                            thousandSeparator
                            prefix="RWF"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
}
