import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBookBySnapshot,
  selectOrderBook,
} from "./features/orderbook/orderBookSlice";

function App() {
  // const [snapshotReceived, setSnapshotReceived] = useState(false);

  const dispatch = useDispatch();
  const orderBook = useSelector(selectOrderBook);
  // console.log("oooo", orderBook);
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
            console.log("change", message);
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
      {orderBook[0] && <p> {orderBook[0]}</p>}
      {orderBook[1] &&
        orderBook[1]?.map((item, key) => (
          <p key={key}>
            {item?.map((el, key) =>
              key === 0
                ? " Price " + el
                : key === 1
                ? " Count " + el
                : " Amount " + el
            )}
          </p>
        ))}
    </div>
  );
}

export default App;
