import ReactPaginate from "react-paginate";
import "./index.css";

function Paginator(props) {
  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * props.itemsPerPage) % props.tableData.length;
    props.setItemOffset(newOffset);
  };
  return (
    <>
      {props.tableData.length > 0 && (
        <>
          <div className="pagination-main-container">
            <div>
              <select
                title="Items per page"
                className="form-select"
                value={props.itemsPerPage}
                onChange={(e) => props.setItemsPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={Number(props.tableData.length)}>Show All</option>
              </select>
            </div>
            <ReactPaginate
              breakLabel="..."
              nextLabel=">>"
              onPageChange={handlePageClick}
              pageRangeDisplayed={
                props.pageRangeDisplayed ? props.pageRangeDisplayed : 5
              }
              pageCount={props.pageCount}
              previousLabel="<<"
              renderOnZeroPageCount={null}
              containerClassName="paginationContainer"
              pageClassName="pageClassName"
              activeClassName="activeClassName"
              previousClassName="previousClassName"
              nextClassName="previousClassName"
              disabledLinkClassName="disabledLinkClassName"
            />
          </div>
        </>
      )}
    </>
  );
}

export default Paginator;
