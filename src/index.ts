import express from "express";
import bodyParser from "body-parser";

import * as blink_tester from "./blink_tester.js";
import parseIntelHex from "./intelhex.js";

const app = express();
const port = 8000;

app.use(
  bodyParser.text({
    limit: "1mb",
    type: "*/*",
  })
);

app.get("/", (req, res) => {
  res.send("This service works!");
});

app.post("/test/blink", (req, res) => {
  // req.params['']

  const ledPin = req.query.ledPin as string;

  try {
    blink_tester.test(new Uint16Array(parseIntelHex(req.body).buffer), {
      ledPin: Number.parseInt(ledPin) || 7,
      blinkDelay: 1000,
      timeout: 4000,
    });

    res.send("Ok.");
  } catch (e) {
    res.send("Fail: " + e);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
