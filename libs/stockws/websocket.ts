// Allow blocks to call browser WebSocket
declare class WebSocket {
  constructor(url: string);
  onopen: () => void;
  onmessage: (ev: { data: string }) => void;
  send(msg: string): void;
  close(): void;
}

namespace stockws {
  let ws: WebSocket = null;

  /**
   * Connect to the Real-Time Finance WebSocket API
   */
  //% block="connect to $url"
  export function connect(url: string): void {
    ws = new WebSocket(url);
  }

  /**
   * Subscribe to a symbol
   */
  //% block="subscribe to %symbol"
  export function subscribe(symbol: string): void {
    if (!ws) return;
    const msg = JSON.stringify({ action: "add", market: "NASDAQ", stock: symbol });
    ws.send(msg);
  }

  /**
   * When a new price arrives
   */
  //% block="on price $handler"
  export function onPrice(handler: (price: number) => void): void {
    if (!ws) return;
    ws.onmessage = ev => {
      const data = JSON.parse(ev.data);
      if (data.price) handler(data.price);
    }
  }
}
