export const ws = new WebSocket("wss://api-pub.bitfinex.com/ws/2");

ws.on("message", (msg) => console.log(msg));

let msg = JSON.stringify({
  event: "subscribe",
  channel: "book",
  symbol: "tBTCUSD",
});

ws.on("open", () => w.send(msg));

ws.on("subscribed", (data) => {
  console.log(data);
});
