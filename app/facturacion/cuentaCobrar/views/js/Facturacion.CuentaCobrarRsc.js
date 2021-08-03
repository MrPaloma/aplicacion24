/* 
 * ---------------------------------------
 * --------- CREATED BY LV ----------
 * Autor:        Admin A Art A 
 * Fecha:        21-09-2018 05:09:33 
 * Descripcion : CuentaCobrarRsc.js
 * ---------------------------------------
 */
"use strict";

$$.Facturacion.CuentaCobrarRsc = class CuentaCobrarRsc extends Resource {

    constructor() {
        super();
    }

    setCuenta(data) {
        let tr = '', e, t1 = 0, t2 = 0;
        let st = 'style="color: #fff;font-weight: bold;text-align: center;font-size: 11px;"';
        $.each(data, (i, v) => {
            e = (v.saldo == 0) ? `<label class="label label-success" ${st}>${APP_ETIQUET._071}</label>` : `<label class="label label-danger" ${st}>${APP_ETIQUET._070}</label>`;
            tr += `
            <tr class="_trcta lv-pointer" data-k="${v.id_cta_entidad}" data-sl="${v.saldo}">
                <td class="text-center"><a href="javascript:;" class="_doccta" data-v="${v.id_venta}">${v.serie}-${v.numero_documento}</a></td>
                <td class="text-center">${v.fecha_emision}</td>
                <td class="text-right">${v.deuda}</td>
                <td class="text-right">${v.saldo}</td>
                <td>${e}</td>
            </tr>`;
            t1 += parseFloat(v.deuda);
            t2 += parseFloat(v.saldo);
        });
        tr += `
            <tr>
                <td class="text-right" colspan="2"><b>${APP_ETIQUET._017}</b></td>
                <td class="text-right"><b>${t1.toFixed(2)}</b></td>
                <td class="text-right"><b>${t2.toFixed(2)}</b></td>
                <td></td>
            </tr>`;

        $(`#${this._alias}tb_cuenta`).html(tr);
        $('._doccta').off('click').click((e) => {
            this.formPDF(_tk_, $(e.currentTarget).data('v'));
        });
        $('._trcta').off('click').click((e) => {
            let r = $(e.currentTarget);
            this._ketCta = r.data('k');

            //debe tener saldo para realizar el pago
            if (parseFloat(r.data('sl')) > 0) {
                this.toogleGrabar(false);
                this.setPagar(r);
            } else {
                $(`#${this._alias}d_ndoc`).html('');
                this.toogleGrabar(true);
            }
            $(`#${this._alias}d_det_pagos`).html(r.find('a').html());
            this._getPagos(_tk_);
        });
    }

    addButtons() {
        $.fn.appButton.get({
            container: `#${this._alias}tool_btn`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GRB, type: 'submit'}]
        }, () => {
            this.toogleGrabar(true);
        });
    }
    
     addButtonsFormNew() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GRB, type: 'submit'}]
        });
    }

    setPagar(r) {
        $(`#${this._alias}d_ndoc`).html(r.find('a').html());
    }

    toogleGrabar(t) {
        $(`#${PREBTNCTXT}${this._alias}${APP_BTN.GRB}`).attr('disabled', t);
    }

    evtBtnCancelar() {
        this.toogleGrabar(true);
        this._ketCta = null;
        $(`#${this._alias}d_ndoc`).html('');
        $(`#${this._alias}txt_importe`).val('');
        $(`#${this._alias}txt_fecha`).val('');
    }

    setPagos(data) {
        let tr = '', t = 0, b;
        $.each(data, (i, v) => {
            b = $.fn.appButton.create({
                keymnu: this._alias,
                keybtn: APP_BTN.DEL,
                type: 'button'
            });
            tr += `
            <tr data-k="${v.id_cta_entidad_pago}" data-kk="${v.id_cta_entidad}">
                <td>${b}</td>
                <td class="text-center">${v.fecha_pago}</td>
                <td class="text-right">${v.importe_pago}</td>
            </tr>`;
            t += parseFloat(v.importe_pago);
        });
        tr += `
            <tr>
                <td class="text-right" colspan="2"><b>${APP_ETIQUET._017}</b></td>
                <td class="text-right"><b>${t.toFixed(2)}</b></td>
            </tr>`;

        $(`#${this._alias}tb_pagos`).html(tr);
        $(`#${this._alias}tb_pagos`).find('.btn-danger').css({padding: '3px'});
        $(`#${this._alias}tb_pagos`).find('.btn-danger').off('click').click((e)=>{
            this._ketCta = $(e.currentTarget).parent().parent().data('kk');
            this.postDeletePago($(e.currentTarget),_tk_,$(e.currentTarget).parent().parent().data('k'));
        });
    }

    //------------------------------------------------------------------------
    setCobrar(data) {
        Tools.setDataForm(this._idFormCobrar, {
            alias: this._alias,
            elements: [
                //Datos info
                {item: 'txt_cliente', value: data.razon_social, },
            ]
        });          
    }
};