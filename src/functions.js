import { menu, adicionales, bebidas } from "./menu.js";

export function generarDatosPedido(data) {
  let valorProductos = 0;
  let cantidadEmpaques = 0;
  let valorEmpaques = 0;
  let valorAdicionales = 0;
  let valorBebidas = 0;
  let resumen = [];

  for (const producto in data.productos) {
    const cantidad = Number(data.productos[producto]);
    if (!cantidad) continue;

    const precioUnitario = menu[producto] || 0;
    const subtotal = precioUnitario * cantidad;
    valorProductos += subtotal;
    cantidadEmpaques += cantidad;
    valorEmpaques += cantidad * 1000;

    resumen.push({
      tipo: "Producto",
      producto: producto,
      cantidad,
      precio: subtotal,
    });
  }

  for (const adicional in data.adicionales) {
    const cantidad = Number(data.adicionales[adicional]);
    if (!cantidad) continue;

    const precioUnitario = adicionales[adicional] || 0;
    const subtotal = precioUnitario * cantidad;
    valorAdicionales += subtotal;

    resumen.push({
      tipo: "Adicional",
      producto: adicional,
      cantidad,
      precio: subtotal,
    });
  }

  for (const bebida in data.bebidas) {
    const cantidad = Number(data.bebidas[bebida]);
    if (!cantidad) continue;

    const precioUnitario = bebidas[bebida] || 0;
    const subtotal = precioUnitario * cantidad;
    valorBebidas += subtotal;

    resumen.push({
      tipo: "Bebida",
      producto: bebida,
      cantidad,
      precio: subtotal,
    });
  }

  const totalGeneral =
    valorProductos + valorEmpaques + valorAdicionales + valorBebidas;

  const formatCOP = (valor) =>
    `$${valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

  let texto = "";
  resumen.forEach((item) => {
    if (item.tipo === "Producto") {
      texto += `Productos:\n`;
      texto += `${item.cantidad} x ${item.producto}\n`;
      texto += `Subtotal: ${formatCOP(item.precio)}\n\n`;
    }

    if (item.tipo === "Adicional") {
      texto += `Adicionales:\n`;
      texto += `${item.cantidad} x ${item.producto}\n`;
      texto += `Subtotal: ${formatCOP(item.precio)}\n\n`;
    }

    if (item.tipo === "Bebida") {
      texto += `Bebidas:\n`;
      texto += `${item.cantidad} x ${item.producto}\n`;
      texto += `Subtotal: ${formatCOP(item.precio)}\n\n`;
    }
  });

  texto += `Cantidad de empaques: ${cantidadEmpaques}\n`;
  texto += `Valor empaques: ${formatCOP(valorEmpaques)}`;

  const totalGeneralStr = formatCOP(totalGeneral);

  return {
    valorProductos,
    valorAdicionales,
    valorBebidas,
    totalGeneral,
    totalGeneralStr,
    resumen,
    resumenStr: texto.trim(),
  };
}
