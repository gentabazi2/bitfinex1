import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBookBySnapshot,
  unsubscribe,
  selectOrderBook,
  updateOrderBook,
  deleteFromOrderBook,
} from "./features/orderbook/orderBookSlice";
import OrderBookTable from "./features/orderbook/OrderBookTable";
import { selectSymbols } from "./features/symbols/symbolsSlice";
import {
  FREQUENCY,
  PRECISION,
  CHANNEL,
  WS_EVENT,
  WS_EVENT_RESPONSE,
  LENGTH,
} from "./constants/requestModel";
function App() {
  const webSocket = useRef(null);
  const [precision, setPrecision] = useState(PRECISION.P0);
  const [symbol, setSymbol] = useState("tBTCUSD");
  const [frequency, setFrequency] = useState(FREQUENCY.F0);
  const [reconnect, setReconnect] = useState(false);
  const [connect, setConnect] = useState(true);
  const [channelId, setChannelId] = useState("");
  const dispatch = useDispatch();
  const orderBook = useSelector(selectOrderBook);
  const symbols = useSelector(selectSymbols);
  const [requestMessage, setRequestMessage] = useState({
    event: WS_EVENT.SUBSCRIBE,
    channel: CHANNEL.BOOK,
    symbol: symbol,
    prec: precision,
    freq: frequency,
    len: LENGTH[100],
  });
  let receivedSnapshot = false;

  const handleMessage = (msg) => {
    let timeOutIds = [];
    const message = JSON.parse(msg.data);
    try {
      switch (message.event) {
        case WS_EVENT_RESPONSE.SUBSCRIBED:
          setChannelId(message.chanId);
          break;
        case WS_EVENT_RESPONSE.INFO:
          break;
        case WS_EVENT_RESPONSE.UNSUBSCRIBED:
          dispatch(unsubscribe());
          timeOutIds.forEach((id) => {
            clearTimeout(id);
          });
          receivedSnapshot = false;
          break;
        default:
          if (message.event) {
          } else {
            if (!receivedSnapshot && message[1] !== "hb") {
              dispatch(createBookBySnapshot(message));
              receivedSnapshot = true;
            } else if (message[1] !== "hb" && receivedSnapshot) {
              timeOutIds.push(
                setTimeout(() => {
                  if (message[1][1] > 0) {
                    dispatch(updateOrderBook(message[1]));
                  } else {
                    dispatch(deleteFromOrderBook(message[1]));
                  }
                }, 0)
              );
            }
          }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    webSocket.current = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
    const ws = webSocket.current;

    ws.onmessage = handleMessage;

    ws.onclose = function (e) {
      console.log(
        "Socket is closed. Reconnect will be attempted in 1 second.",
        e
      );
      receivedSnapshot = false;
      setTimeout(function () {
        if (connect) {
          setReconnect(!reconnect);
        }
      }, 1000);
    };

    ws.onopen = () => {
      ws.send(JSON.stringify(requestMessage));
    };

    return () => ws.close();
  }, [reconnect]);

  useEffect(() => {
    let ws = webSocket.current;
    if (!connect) {
      ws.send(
        JSON.stringify({ event: WS_EVENT.UNSUBSCRIBE, chanId: channelId })
      );
    } else {
      if (ws !== null && ws.readyState !== 0) {
        ws.send(
          JSON.stringify({ event: WS_EVENT.UNSUBSCRIBE, chanId: channelId })
        );

        ws.send(JSON.stringify(requestMessage));
      }
    }
  }, [connect, requestMessage]);

  useEffect(() => {
    setRequestMessage({
      event: WS_EVENT.SUBSCRIBE,
      channel: CHANNEL.BOOK,
      symbol: symbol,
      prec: precision,
      freq: frequency,
      len: LENGTH[100],
    });
  }, [symbol, precision, frequency]);

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
            <option key={element} value={element}>
              {element}
            </option>
          ))}
        </select>
        <p>Precision: </p>
        <select
          className="precision"
          onChange={(e) => setPrecision(e.target.value)}
          value={precision}
        >
          {Object.keys(PRECISION).map((precision, i) => (
            <option key={i} value={precision}>
              {precision}
            </option>
          ))}
        </select>
        <p>Frequency: </p>
        <select
          className="frequency"
          onChange={(e) => setFrequency(e.target.value)}
          value={frequency}
        >
          {Object.keys(FREQUENCY).map((frequency, i) => (
            <option key={i} value={frequency}>
              {frequency}
            </option>
          ))}
        </select>
        <button className="connect" onClick={() => setConnect(true)}>
          Connect
        </button>
        <button className="disconnect" onClick={() => setConnect(false)}>
          Disconnect
        </button>
        <p className="connection-status">
          Status:{" "}
          {connect && orderBook.bids.length > 0 && orderBook.asks.length > 0
            ? "Connected"
            : "Disconnected"}
        </p>
      </div>
      {orderBook.bids.length > 0 && orderBook.asks.length > 0 ? (
        <OrderBookTable bids={orderBook.bids} asks={orderBook.asks} />
      ) : connect ? (
        <p className="loading">Loading...</p>
      ) : (
        <p className="loading">Disconnected...</p>
      )}
    </div>
  );
}

export default App;
