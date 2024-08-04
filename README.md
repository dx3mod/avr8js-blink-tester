# avr8js-blink-tester

A minimal server to simulate (with [avr8js]) and test LED blinking.

The LED should blink at 1000ms intervals.

## Usage

Run the server.
```console
$ npm i # install dependencies
$ npm run start 
```

Test a firmware (in Intel HEX format).
```console
$ curl -X POST -F "data=@code.hex" "http://localhost:8000/test/blink?ledPin=7"
Ok.

$ curl -X POST -F "data=@code.hex" "http://localhost:8000/test/blink?ledPin=2"
Fail: expected 2 blinks, but got 0
```

[avr8js]: https://github.com/wokwi/avr8js