import { SCREEN_RESPONSES } from "./screens.js";
import { generarDatosPedido } from "./functions.js";

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
        let chkProducts = false;

        for (const key in data) {
          if (key.startsWith("chk_") && data[key] === true) {
            chkProducts = true;
            break;
          }
        }

        if (chkProducts) {
          return {
            ...SCREEN_RESPONSES.CANTIDADES,
            data: {
              ...SCREEN_RESPONSES.CANTIDADES.data,
              ...data,
            },
          };
        } else {
          return {
            ...SCREEN_RESPONSES.ADICIONALES,
            data: {
              ...SCREEN_RESPONSES.ADICIONALES.data,
              ...data,
            },
          };
        }

      case "CANTIDADES":
        return {
          ...SCREEN_RESPONSES.ADICIONALES,
          data: {
            ...SCREEN_RESPONSES.ADICIONALES.data,
            ...data,
          },
        };

      case "ADICIONALES":
        return {
          ...SCREEN_RESPONSES.BEBIDAS,
          data: {
            ...SCREEN_RESPONSES.BEBIDAS.data,
            ...data,
          },
        };

      case "BEBIDAS":
        const { resumenStr, totalGeneral, totalGeneralStr } =
          generarDatosPedido(data);
        const { obs_productos, obs_adicionales } = data;
        return {
          ...SCREEN_RESPONSES.FINAL,
          data: {
            resumen: resumenStr,
            valorTotal: totalGeneral,
            valorTotalStr: totalGeneralStr,
            obsProductos: obs_productos,
            obsAdcionales: obs_adicionales,
          },
        };

      case "FINAL":
        return {
          ...SCREEN_RESPONSES.MET_ENTREGA,
          data: {
            chk_recoge: false,
            ...data,
          },
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
