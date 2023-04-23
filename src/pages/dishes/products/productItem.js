import { FILE_URL } from "../../../constants";
import React, { useState, useEffect } from "react";

function ProductItem({
  index,
  item,
  products,
  deleteItem,
  setDeleteItem,
  setShowAlert,
  isDeleting,
}) {
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  useEffect(() => {
    const pr = products.find((i) => i.pId === item.productId);
    if (pr) {
      setProductName(pr.name);
      setProductImage(pr.image);
    }
  }, [item, products]);
  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <img
          src={FILE_URL + productImage}
          alt=""
          style={{ width: 50, height: 40 }}
        />
      </td>
      <td>{productName}</td>
      <td>
        {
          <>
            <span
              className="text-danger"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (!(isDeleting && deleteItem.ppId === item.ppId)) {
                  setDeleteItem(item);
                  setShowAlert(true);
                }
              }}
            >
              {isDeleting && deleteItem.ppId === item.ppId
                ? "Removing..."
                : "Remove"}
            </span>
          </>
        }
      </td>
    </tr>
  );
}

export default ProductItem;
