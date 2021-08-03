"use strict";
$$.System.UsuarioRsc = class UsuarioRsc extends Resource {

    constructor() {
        super();
    }

    addButtonsFormSeries() {
        $.fn.appButton.get({
            container: `#${this._alias}btn_add`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.ADD, type: 'button', evts: [{click: 'Obj.System.UsuarioAx.postAddSerie'}]}]
        });

        $.fn.appButton.get({
            container: `#${this._alias}btn_remove`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.QUI, type: 'button', evts: [{click: 'Obj.System.UsuarioAx.postRemoveSerie'}]}]
        });
    }

    addButtonsFormNew() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GRB, type: 'submit'}]
        });
        $.fn.appButton.get({
            container: `#${this._alias}btn_new_lk`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.LKADD, type: 'button', evts: [{click: 'Obj.Facturacion.LocalAx.formNew'}]}]
        }, (o) => {
            $(`#${PREBTNCTXT}${this._alias}${APP_BTN.LKADD}`).css({
                padding: '5px'
            });
        });
    }

    addButtonsFormUpdate() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.UPD, type: 'submit'}]
        });
    }

    setUsuario(data) {
        let u = data.user;
        let r = data.roles;

        Tools.setDataForm(this._formEdit, {
            alias: this._alias,
            elements: [
                {item: 'txt_apellido_paterno', value: u.apellido_paterno},
                {item: 'txt_apellido_materno', value: u.apellido_materno},
                {item: 'txt_primer_nombre', value: u.primer_nombre},
                {item: 'txt_segundo_nombre', value: u.segundo_nombre},
                {item: 'txt_celular', value: u.celular},
                {item: 'txt_email', value: u.email},
                {item: 'chk_activo', value: u.activo, type: 'checkbox'}
            ]
        });

        $.each(r, (i, v) => {
            if ($(`#${this._alias}chk_rol${v.id_rol}`).length == 1) {
                $(this._formEdit).find(`#${this._alias}chk_rol${v.id_rol}`).prop('checked', true);
            }
        });
    }

    setSeries(data) {
        let hS = '', hN = '';

        $.each(data, (i, v) => {
            if (v.marcado == 1) {
                hS += `
                <label class="checkbox">
                    <input type="checkbox" id="chk_serie${v.id_serie}" name="chk_serie[]" value="${v.id_serie}" ckecked="ckecked"/> 
                    <i></i> ${v.serie}
                </label>`;
            } else {
                hN += `
                <label class="checkbox">
                    <input type="checkbox" id="chk_serie${v.id_serie}" name="chk_serie[]" value="${v.id_serie}"/> 
                    <i></i> ${v.serie}
                </label>`;
            }
        });

        $(`#${this._alias}no_asign`).html(hN);
        $(`#${this._alias}si_asign`).html(hS);
    }

    getListBoxs(form, data = false) {
        $(form).appList({
            items: [
                {
                    data: 'local',
                    container: `#${this._alias}d_local`,
                    required: true,
                    attr: {
                        id: `${this._alias}lst_local`,
                        name: `${this._alias}lst_local`,
                        class: 'form-control _local'
                    },
                    default: (data) ? data.id_local : null
                }
            ]
        });
    }

    setRoles(data) {
        let hS = '', hN = '';

        $.each(data, (i, v) => {
            if (v.marcado == 1) {
                hS += `
                <label class="checkbox">
                    <input type="checkbox" id="chk_rol${v.id_rol}" name="chk_rol[]" value="${v.id_rol}" checked="1"/> 
                    <i></i> <span style="margin-top:-8px;display:block">${Tools.traslate(v.nrol)}</span>
                </label>`;
            } else {
                hN += `
                <label class="checkbox">
                    <input type="checkbox" id="chk_rol${v.id_rol}" name="chk_rol[]" value="${v.id_rol}"/> 
                    <i></i> <span style="margin-top:-8px;display:block">${Tools.traslate(v.nrol)}</span>
                </label>`;
            }
        });

        $(`#${this._alias}d_rol`).html(hS + hN);
    }

};  