/**
 * "Fetch with HotUtils" for everyone: the HotUtils sign-in popup.
 *
 * When the current profile has no HotUtils session ID, the optimizer opens HotUtils' sign-in page in a popup. The
 * player signs in there with their EA account; HotUtils then posts
 *   { type: "hotutils-gi-link", linkId, allyCode, playerName }
 * back to this window (to this page's exact origin only) and closes the popup. `linkId` is the HotUtils session ID
 * the optimizer already stores per profile, so from there on the usual "Fetch with HotUtils" path runs.
 *
 * Security: a message is accepted ONLY when `event.origin` is exactly the HotUtils site's origin and the message has
 * the expected type and shape. Anything else is ignored.
 *
 * REACT_APP_HOTUTILS_SITE overrides the HotUtils site for development (e.g. http://localhost:5180 for a local HotUtils
 * site, or https://dev-v2.hotutils.com), the same way REACT_APP_API_BASE overrides the API.
 */
export const HOTUTILS_SITE =
  process.env.REACT_APP_HOTUTILS_SITE || "https://www.hotutils.com";

export const HOTUTILS_SIGN_IN_PATH = "/connect/grand-ivory";

export const HOTUTILS_MESSAGE_TYPE = "hotutils-gi-link";

const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLY_CODE = /^\d{9}$/;

/** The HotUtils site's origin (scheme://host[:port]). */
export function hotUtilsOrigin(site = HOTUTILS_SITE) {
  return new URL(site).origin;
}

/** The popup's address: HotUtils' sign-in page, told which origin to answer. */
export function hotUtilsSignInUrl(ownOrigin, site = HOTUTILS_SITE) {
  return `${hotUtilsOrigin(site)}${HOTUTILS_SIGN_IN_PATH}?origin=${encodeURIComponent(ownOrigin)}`;
}

/**
 * The sign-in result carried by `event`, or null when the event is not one we accept: wrong origin, wrong type, or a
 * malformed body.
 */
export function readHotUtilsSignIn(event, expectedOrigin = hotUtilsOrigin()) {
  if (!event || event.origin !== expectedOrigin) return null;
  const data = event.data;
  if (!data || typeof data !== "object" || data.type !== HOTUTILS_MESSAGE_TYPE) return null;
  if (typeof data.linkId !== "string" || !GUID.test(data.linkId)) return null;
  if (typeof data.allyCode !== "string" || !ALLY_CODE.test(data.allyCode)) return null;
  return {
    linkId: data.linkId,
    allyCode: data.allyCode,
    playerName: typeof data.playerName === "string" ? data.playerName : null,
  };
}

/**
 * Opens the HotUtils sign-in popup and calls `onSignedIn({ linkId, allyCode, playerName })` once, when HotUtils answers.
 * Must be called from a click handler, or the browser blocks the popup.
 *
 * @returns {boolean} false when the browser blocked the popup.
 */
export function openHotUtilsSignIn(onSignedIn, { site = HOTUTILS_SITE, win = window } = {}) {
  const expectedOrigin = hotUtilsOrigin(site);
  const popup = win.open(
    hotUtilsSignInUrl(win.location.origin, site),
    "hotutils-sign-in",
    "popup,width=480,height=720"
  );
  if (!popup) return false;

  let watcher = null;
  const stop = () => {
    win.removeEventListener("message", listener);
    if (watcher !== null) win.clearInterval(watcher);
  };
  function listener(event) {
    const signIn = readHotUtilsSignIn(event, expectedOrigin);
    if (!signIn) return;
    stop();
    onSignedIn(signIn);
  }
  win.addEventListener("message", listener);
  // Stop listening once the player closes the popup without finishing. The popup closes itself right after it posts
  // its answer, so wait one more tick after first seeing it closed: the message is never dropped for being late.
  let closedSeen = false;
  watcher = win.setInterval(() => {
    if (!popup.closed) return;
    if (closedSeen) stop();
    closedSeen = true;
  }, 1000);
  return true;
}
