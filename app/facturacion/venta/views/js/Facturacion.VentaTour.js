/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Super 
 * Fecha:        12-09-2018 20:09:30 
 * Descripcion : VentaTour.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.VentaTour = class VentaTour {

    main() {
        let tour = new Tour({
            steps: [
                {
                    element: `#ELEMENTO AL QUE SE LE APLICA EL TOUR`,
                    content: 'CONTENIDO DESDE ARRAY JS: APP_TOUR',
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }
            ]
        });
        tour.init();
        tour.restart();
    }

    formNewVenta() {
        let tour = new Tour({
            steps: [
                {
                    element: `#${this._alias}txt_numero_pedido`,
                    content: APP_TOUR._0001,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}d_tipo_doc`,
                    content: APP_TOUR._0002,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}d_serie`,
                    content: APP_TOUR._0003,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}txt_num_doc`,
                    content: APP_TOUR._0004,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}txt_fecha_vencimiento`,
                    content: APP_TOUR._0005,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}d_tipo_moneda`,
                    content: APP_TOUR._0006,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                },
                {
                    element: `#${this._alias}d_cliente`,
                    content: APP_TOUR._0007,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}btn_nw_cliente`,
                    content: APP_TOUR._0008,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}d_forma_pago`,
                    content: APP_TOUR._0009,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}txt_orden_compra`,
                    content: APP_TOUR._0010,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}txt_tipo_cambio`,
                    content: APP_TOUR._0011,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                },
                {
                    element: `#${this._alias}d_direccion`,
                    content: APP_TOUR._0012,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}txt_guia_remitente_tmp`,
                    content: APP_TOUR._0013,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}txt_guia_transportista`,
                    content: APP_TOUR._0016,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}pagado`,
                    content: APP_TOUR._0014,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                },
                {
                    element: `#${PREBTNCTXT}${this._alias}${APP_BTN.ITADD}`,
                    content: APP_TOUR._0015,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}txt_producto1`,
                    content: APP_TOUR._0017,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}txt_cantidad1`,
                    content: APP_TOUR._0018,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}lst_tipo_afecta1`,
                    content: APP_TOUR._0019,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}txt_precio1`,
                    content: APP_TOUR._0020,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}txt_subtotal1`,
                    content: APP_TOUR._0021,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${this._alias}txt_total_unitario1`,
                    content: APP_TOUR._0022,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                },
                {
                    element: `#${this._alias}btn_del1`,
                    content: APP_TOUR._0023,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                },
                {
                    element: `#${this._alias}txt_observaciones`,
                    content: APP_TOUR._0024,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },
                {
                    element: `#${PREBTNCTXT}${this._alias}${APP_BTN.GNC}`,
                    content: APP_TOUR._0025,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                }
            ]
        });
        tour.init();
        tour.restart();
    }

};