import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-GTC0NVVNY1", {
    gaOptions: {
      debug_mode: true
    }
  });
};

export const trackEvent = (name, params = {}) => {
  ReactGA.event(name, params);
};