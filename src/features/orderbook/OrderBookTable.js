import React from "react";
import "./style.css";

const OrderBookTable = ({ bids, asks }) => {
  return (
    <div className="tableContainer">
      <div id="bid" className="columnsDescription bid">
        <div className="row">
          <div className="cell">Price</div>
          <div className="cell">Count</div>
          <div className="cell">Amount</div>
        </div>
        {bids?.map((row) => (
          <div className="row">
            <div className="cell">{row.price}</div>
            <div className="cell">{row.count}</div>
            <div className="cell">{row.amount}</div>
          </div>
        ))}
      </div>
      <div id="ask" className="columnsDescription">
        <div className="row">
          <div className="cell">Price</div>
          <div className="cell">Count</div>
          <div className="cell">Amount</div>
        </div>
        {asks?.map((row) => (
          <div className="row">
            <div className="cell">{row.price}</div>
            <div className="cell">{row.count}</div>
            <div className="cell">{row.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBookTable;
