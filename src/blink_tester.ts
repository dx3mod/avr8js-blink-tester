import avr8js, { PinState } from "avr8js";

export function test(
  program: Uint16Array,
  opts: {
    ledPin: number;
    /// in millis
    blinkDelay: number;
    /// in millis
    timeout: number;
  }
) {
  const cpu = new avr8js.CPU(program);

  const peripherals = {
    ports: {
      d: new avr8js.AVRIOPort(cpu, avr8js.portDConfig),
    },
    timer0: new avr8js.AVRTimer(cpu, avr8js.timer0Config),
    clock: new avr8js.AVRClock(cpu, 16_000_000, avr8js.clockConfig),
  };

  let lastLedState: PinState | undefined = undefined;
  let lastBlinkTime = 0;

  let blinksCount = 0;
  const expectedBlinksCount = Math.floor(opts.timeout / (opts.blinkDelay * 2));

  peripherals.ports.d.addListener((x) => {
    const ledState = peripherals.ports.d.pinState(opts.ledPin);

    if (lastLedState === undefined) {
      lastBlinkTime = peripherals.clock.timeMillis;

      if (ledState === PinState.High) lastLedState = PinState.Low;

      return;
    }

    if (
      (ledState === PinState.High && lastLedState === PinState.Low) ||
      (ledState === PinState.Low && lastLedState === PinState.High)
    ) {
      const timeDifference = peripherals.clock.timeMillis - lastBlinkTime;

      if (
        timeDifference >= opts.blinkDelay &&
        timeDifference <= opts.blinkDelay + 100
      ) {
        blinksCount++;
      } else {
        throw `delay != ${opts.blinkDelay}`;
      }
    }

    if ((peripherals.ports.d.portConfig.DDR & (1 << opts.ledPin)) === 1) {
      throw `${opts.ledPin} not init as OUTPUT`;
    }

    lastLedState = ledState;
    lastBlinkTime = peripherals.clock.timeMillis;
  });

  while (true) {
    avr8js.avrInstruction(cpu);
    cpu.tick();

    if (peripherals.clock.timeMillis > opts.timeout) break;
  }

  if (blinksCount !== expectedBlinksCount)
    throw `expected ${expectedBlinksCount} blinks, but got ${blinksCount}`;

  console.log(peripherals.clock.timeMillis);
}
