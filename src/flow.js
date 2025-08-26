import { SCREEN_RESPONSES } from "./screens.js";

export const getNextScreen = async (decryptedBody) => {
  const { screen, data, version, action, flow_token } = decryptedBody;
  // handle health check request
  if (action === "ping") {
    return {
      data: {
        status: "active",
      },
    };
  }

  // handle error notification
  if (data?.error) {
    console.warn("Received client error:", data);
    return {
      data: {
        acknowledged: true,
      },
    };
  }

  // handle initial request when opening the flow and display LOAN screen
  if (action === "INIT") {
    return {
      ...SCREEN_RESPONSES.SEL_MENU,
    };
  }

  if (action === "data_exchange") {
    // handle the request based on the current screen
    switch (screen) {
      case "SEL_MENU":
        return {
          ...SCREEN_RESPONSES.CANTIDADES,
        };

      case "CANTIDADES":
        return {
          ...SCREEN_RESPONSES.ADICIONALES,
        };

      case "ADICIONALES":
        return {
          ...SCREEN_RESPONSES.BEBIDAS,
        };

      case "BEBIDAS":
        return {
          ...SCREEN_RESPONSES.FINAL,
        };

      case "FINAL":
        return {
          ...SCREEN_RESPONSES.MET_ENTREGA,
        };

      default:
        break;
    }
  }

  console.error("Unhandled request body:", decryptedBody);
  throw new Error(
    "Unhandled endpoint request. Make sure you handle the request action & screen logged above."
  );
};
