import React from "react";
import "./style.css";
import { formatArrayNumbers } from "../../utils/numberFormatter";
import PropTypes from "prop-types";

const OrderBookTable = ({ bids, asks }) => {
  return (
    <>
      <div className="tableContainer">
        <div id="bid" className="columnsDescription bid">
          <div className="row">
            <div className="cell">
              {" "}
              <b>PRICE</b>
            </div>
            <div className="cell">
              <b>COUNT</b>
            </div>
            <div className="cell">
              {" "}
              <b>AMOUNT</b>
            </div>
            <div className="cell">
              {" "}
              <b>TOTAL</b>
            </div>
          </div>
          {bids?.map(
            (row, key) =>
              key < 25 && <Row isBid={true} row={row} key={row[0] + "-bids"} />
          )}
        </div>
        <div id="ask" className="columnsDescription">
          <div className="row">
            <div className="cell">
              {" "}
              <b>PRICE</b>
            </div>
            <div className="cell">
              <b>COUNT</b>
            </div>
            <div className="cell">
              {" "}
              <b>AMOUNT</b>
            </div>
            <div className="cell">
              {" "}
              <b>TOTAL</b>
            </div>
          </div>
          {asks?.map(
            (row, key) =>
              key < 25 && <Row isBid={false} row={row} key={row[0] + "-asks"} />
          )}
        </div>
      </div>
    </>
  );
};

const Row = ({ isBid, row }) => {
  let formattedRow = formatArrayNumbers(row);
  return (
    <div className="row" id={row[0]}>
      <div className="cell">{formattedRow[0]}</div>
      <div className="cell">{formattedRow[1]}</div>
      <div className="cell">{formattedRow[2]}</div>
      <div className="cell">{formattedRow[3]}</div>
    </div>
  );
};

OrderBookTable.propTypes = {
  bids: PropTypes.array.isRequired,
  asks: PropTypes.array.isRequired,
};

export default OrderBookTable;
