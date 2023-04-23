import { FILE_URL } from "../../constants";
import React, { useEffect, useState } from "react";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";
import { Spinner } from "react-bootstrap";

function DishItem({
  item,
  index,
  markets,
  setDeleteItem,
  setShowAlert,
  setShowModal2,
  setShowModal,
  setEditItem,
  isDeleting,
  setDishItem,
  deleteItem,
  allItems,
}) {
  const [marketName, setMarketName] = useState("");
  useEffect(() => {
    const nm = markets.find((i) => i.mId == item.marketId);
    if (nm) {
      setMarketName(nm.name);
    }
  }, [markets, allItems]);

  return (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>
        <img
          src={FILE_URL + item.image}
          alt=""
          style={{ width: 50, height: 40 }}
        />
      </td>
      <td>{item.name}</td>
      <td>{marketName}</td>
      <td>
        {item.utubeLink !== "" && (
          <a href={item.utubeLink} target="_blank">
            Visit Link
          </a>
        )}
      </td>
      <td>
        {deleteItem && deleteItem.id === item.id && isDeleting ? (
          <Spinner size="sm" />
        ) : (
          <>
            <EditOutlined
              style={{ cursor: "pointer" }}
              onClick={() => {
                setEditItem(item);
                setShowModal(true);
              }}
            />
            &nbsp; &nbsp;
            <span
              className="text-info"
              style={{
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => {
                setDishItem(item);
                setShowModal2(true);
              }}
            >
              Products
            </span>
            &nbsp; &nbsp;
            <CloseOutlined
              onClick={() => {
                setDeleteItem(item);
                setShowAlert(true);
              }}
              style={{ color: "red", cursor: "pointer" }}
            />
          </>
        )}
      </td>
    </tr>
  );
}

export default DishItem;
