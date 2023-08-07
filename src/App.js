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
import { selectSymbols } from "./features/symbols/symbolsSlice";

function App() {
  const [precision, setPrecision] = useState("P0");
  const [symbol, setSymbol] = useState("tBTCUSD");
  const [reconnect, setReconnect] = useState(0);
  const dispatch = useDispatch();
  const orderBook = useSelector(selectOrderBook);
  const symbols = useSelector(selectSymbols);
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
            console.log("snapShot", message);
            dispatch(createBookBySnapshot(message));
          } else {
            if (message[1] !== "hb") {
              console.log("change", message);
              if (message[1][1] > 0) {
                dispatch(updateOrderBook(message[1]));
              } else {
                dispatch(deleteFromOrderBook(message[1]));
              }
            }
          }
          receivedSnapshot = true;
        }
      } catch (err) {
        console.log(err);
      }
    };

    ws.onclose = function (e) {
      console.log(
        "Socket is closed. Reconnect will be attempted in 1 second.",
        e.reason
      );
      setTimeout(function () {
        setReconnect(reconnect + 1);
      }, 1000);
    };

    let msg = JSON.stringify({
      event: "subscribe",
      channel: "book",
      symbol: symbol,
      prec: precision,
      freq: "F0",
      len: "25",
    });

    ws.onopen = () => ws.send(msg);
    return () => ws.close();
  }, [precision, symbol, reconnect]);

  return (
    <div className="App">
      <div className="controllers">
        <p>Symbols: </p>
        <select
          className="symbols"
          onChange={(e) => setSymbol("t" + e.target.value)}
          value={symbol.slice(1)}
        >
          {symbols?.map((element) => (
            <option value={element}>{element}</option>
          ))}
        </select>
        <p>Precision: </p>
        <select
          className="precision"
          onChange={(e) => setPrecision(e.target.value)}
          value={precision}
        >
          <option value="P0">P0</option>
          <option value="P1">P1</option>
          <option value="P2">P2</option>
          <option value="P3">P3</option>
          <option value="P4">P4</option>
        </select>
      </div>
      <OrderBookTable bids={orderBook.bids} asks={orderBook.asks} />
    </div>
  );
}

export default App;
