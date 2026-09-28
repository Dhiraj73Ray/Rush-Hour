const SESSION_KEY = "rushhour.sessionActive";

export const isSessionActive = (): boolean =>
  sessionStorage.getItem(SESSION_KEY) === "1";

export const startSession = (): void => {
  sessionStorage.setItem(SESSION_KEY, "1");
};

export const endSession = (): void => {
  sessionStorage.removeItem(SESSION_KEY);
};