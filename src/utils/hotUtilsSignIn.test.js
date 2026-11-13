import {
  hotUtilsOrigin,
  hotUtilsSignInUrl,
  openHotUtilsSignIn,
  readHotUtilsSignIn,
} from "./hotUtilsSignIn";

const SITE = "https://www.hotutils.com";
const LINK = "5b0b1c3e-1111-2222-3333-444455556666";
const good = {
  type: "hotutils-gi-link",
  linkId: LINK,
  allyCode: "834846171",
  playerName: "Hotsauce",
};

describe("readHotUtilsSignIn", () => {
  it("accepts the HotUtils message from the HotUtils origin", () => {
    expect(readHotUtilsSignIn({ origin: SITE, data: good }, SITE)).toEqual({
      linkId: LINK,
      allyCode: "834846171",
      playerName: "Hotsauce",
    });
  });

  it("ignores any other origin, even a look-alike", () => {
    [
      "https://evil.example",
      "http://www.hotutils.com",
      "https://www.hotutils.com.evil.example",
      "https://dev-v2.hotutils.com",
    ].forEach((origin) => {
      expect(readHotUtilsSignIn({ origin, data: good }, SITE)).toBeNull();
    });
  });

  it("ignores other message types and malformed bodies", () => {
    [
      null,
      "hotutils-gi-link",
      { ...good, type: "something-else" },
      { ...good, linkId: "not-a-guid" },
      { ...good, allyCode: "123-456-789" },
      { ...good, allyCode: 834846171 },
    ].forEach((data) => {
      expect(readHotUtilsSignIn({ origin: SITE, data }, SITE)).toBeNull();
    });
  });

  it("tolerates a missing player name", () => {
    expect(
      readHotUtilsSignIn({ origin: SITE, data: { ...good, playerName: null } }, SITE)
        .playerName
    ).toBeNull();
  });
});

describe("hotUtilsSignInUrl", () => {
  it("names the sign-in page and this page's origin", () => {
    expect(hotUtilsOrigin("https://dev-v2.hotutils.com/")).toBe(
      "https://dev-v2.hotutils.com"
    );
    expect(hotUtilsSignInUrl("http://localhost:3030", SITE)).toBe(
      "https://www.hotutils.com/connect/grand-ivory?origin=http%3A%2F%2Flocalhost%3A3030"
    );
  });
});

describe("openHotUtilsSignIn", () => {
  function fakeWindow(popup) {
    const listeners = [];
    return {
      location: { origin: "https://mods-optimizer.swgoh.grandivory.com" },
      open: jest.fn(() => popup),
      addEventListener: jest.fn((type, fn) => listeners.push(fn)),
      removeEventListener: jest.fn((type, fn) => {
        const i = listeners.indexOf(fn);
        if (i >= 0) listeners.splice(i, 1);
      }),
      setInterval: jest.fn(() => 7),
      clearInterval: jest.fn(),
      dispatch: (event) => listeners.slice().forEach((fn) => fn(event)),
      listeners,
    };
  }

  it("opens the popup, answers once for the right origin, then stops listening", () => {
    const win = fakeWindow({ closed: false });
    const onSignedIn = jest.fn();

    expect(openHotUtilsSignIn(onSignedIn, { site: SITE, win })).toBe(true);
    expect(win.open.mock.calls[0][0]).toBe(
      "https://www.hotutils.com/connect/grand-ivory?origin=https%3A%2F%2Fmods-optimizer.swgoh.grandivory.com"
    );

    win.dispatch({ origin: "https://evil.example", data: good });
    expect(onSignedIn).not.toHaveBeenCalled();

    win.dispatch({ origin: SITE, data: good });
    win.dispatch({ origin: SITE, data: good });
    expect(onSignedIn).toHaveBeenCalledTimes(1);
    expect(win.listeners).toHaveLength(0);
    expect(win.clearInterval).toHaveBeenCalledWith(7);
  });

  it("reports a blocked popup", () => {
    const win = fakeWindow(null);
    expect(openHotUtilsSignIn(jest.fn(), { site: SITE, win })).toBe(false);
    expect(win.addEventListener).not.toHaveBeenCalled();
  });
});
