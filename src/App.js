import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBookBySnapshot,
  selectOrderBook,
  updateOrderBook,
  deleteFromOrderBook,
} from "./features/orderbook/orderBookSlice";
import OrderBookTable from "./features/orderbook/OrderBookTable";

function App() {
  const dispatch = useDispatch();
  const orderBook = useSelector(selectOrderBook);
  useEffect(() => {
    let receivedSnapshot = false;
    const ws = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
    ws.onmessage = (msg) => {
      const message = JSON.parse(msg.data);
      try {
        if (message.event === "subscribed") {
          console.log("subscribed", msg);
        } else if (message.event === "info") {
          console.log("info", message);
        } else if (!message.event) {
          if (
            !receivedSnapshot &&
            message[1] !== undefined &&
            message[1] !== "hb"
          ) {
            console.log("snapShoti", message);
            dispatch(createBookBySnapshot(message));
          } else {
            if (message[1] !== "hb") {
              console.log("change", message);
              //add or update if count > 0
              //amount > 0 add/update bids
              //amunt < 0 add/update asks
              if (message[1][1] > 0) {
                dispatch(updateOrderBook(message[1]));
              } else {
                dispatch(deleteFromOrderBook(message[1]));
                console.log("delete");
              }
            }
          }
          receivedSnapshot = true;
        }
      } catch (err) {
        console.log(err);
      }
    };

    let msg = JSON.stringify({
      event: "subscribe",
      channel: "book",
      symbol: "tBTCUSD",
      prec: "P0",
      freq: "F0",
      len: "25",
    });

    ws.onopen = () => ws.send(msg);
    return () => ws.close();
  }, []);

  return (
    <div className="App">
      <OrderBookTable bids={orderBook.bids} asks={orderBook.asks} />
    </div>
  );
}

export default App;
