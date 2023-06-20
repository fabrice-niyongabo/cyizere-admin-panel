import React, { useEffect, useState } from "react";
import Loader from "../../loader";
import { Modal } from "react-bootstrap";
import { FILE_URL } from "../../../constants";
function Products({ showModal, setShowModal, order, products, isLoading }) {
  const [productsToShow, setProductsToShow] = useState([]);

  useEffect(() => {
    if (showModal) {
      const lst = [];
      for (let i = 0; i < order.cartItems.length; i++) {
        const prod = products.find(
          (item) => item.pId == order.cartItems[i].productId
        );
        if (prod) {
          lst.push(prod);
        }
      }
      setProductsToShow(lst);
    }
  }, [showModal]);

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <table style={{ maxWidth: "100%" }}>
                <thead>
                  <tr>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {productsToShow.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={FILE_URL + item.image}
                          alt={item.name}
                          width={70}
                        />
                      </td>
                      <td>{item.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Products;
