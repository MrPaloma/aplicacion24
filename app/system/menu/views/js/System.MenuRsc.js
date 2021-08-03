"use strict";
$$.System.MenuRsc = class MenuRsc extends Resource {

    constructor() {
        super();

        this._txtEval = '';

        /*
         * Retorna las coincidencias de un dato en array
         * @param {type} data
         * @param {type} p
         * @returns {Number}
         */
        this._counter = function (data, p) {
            var count = 0;

            $.each(data, function (i, row) {
                if (p == row.parent) {
                    count++;
                }
            });

            return count;
        };


        this._childrensMenu = function (data, parent, display = true) {
            var tthis = this, uul = '', icon = '', c = 0, dp, btnNw = '';

            dp = (!display) ? 'style="display:none;"' : '';

            $.each(data, function (i, row) {
                if (parent == row.parent) {
                    c = tthis._counter(data, row.id_menu);
                    icon = (c > 0) ? '<i class="fa fa-folder"></i>' : '';
                    uul += `<li data-orden="${row.id_menu}" ${dp}>
                                <span class="label label-success">${icon} ${row.nombre_menu}</span>
                                <div class="btn-group" id="btng_${row.id_menu}" data-k="${row.id_menu}"></div>
                                <ul id="ulmnu_${row.id_menu}">${tthis._childrensMenu(data, row.id_menu, false)}</ul>
                            </li>`;
                    if(row.evt_ajax == 'not'){
                        //si no tiene evento ajax se activa el boton NUEVO
                        btnNw = `{keybtn: APP_BTN.NEW, evts: [{click: 'Obj.System.MenuAx.formNewMenu'}]},`;
                    }
                    if (c > 0) {
                        tthis._txtEval += `
                            $('#ulmnu_${row.id_menu}').sortable({
                                update: function () {
                                    let ordenElements = $(this).sortable("toArray", {attribute: 'data-orden'}).toString();
                                    Obj.System.MenuAx.postOrdenarMenu(ordenElements, '${_tk_}');
                                }
                            });
                        `;
                    }
                    //botones
                    tthis._txtEval += `
                        $.fn.appButton.get({
                            aliasBtn: '${row.id_menu}',
                            container: '#btng_${row.id_menu}',
                            keymnu: '${tthis._alias}',
                            notext: true,
                            forceBtnXs: true,
                            btns: [
                                {keybtn: APP_BTN.EDT, evts: [{click: 'Obj.System.MenuAx.formEditMenu'}]},
                                ${btnNw}
                                {keybtn: APP_BTN.DEL, evts: [{click: 'Obj.System.MenuAx.postDelete'}]}
                            ]
                        });
                    `;
                }
            });

            return uul;
        };
    }

    addBtnNew() {
        $.fn.appButton.get({
            container: `#${this._alias}tools_btn`,
            keymnu: this._alias,
            btns: [
                {keybtn: APP_BTN.NEW, evts: [{click: 'Obj.System.MenuAx.formNewMenu'}]}
            ]
        });
    }

    renderMenu(data) {
        let cnt = null, that = `#${this._alias}d_menu`, cssenable = '', tthis = this;
        $(that).html('');
        this._txtEval = '';
        $.each(data, function (i, v) {
            if (v.parent == 0) {
                cssenable = (v.activo == '0') ? 'style="color:red;background: #fadbd8 ;"' : '';
                cnt = `
                <div class="col-lg-4" data-orden="${v.id_menu}">
                    <div class="panel panel-warning">
                        <div class="panel-heading" ${cssenable}>
                            <i class="${v.icono}"></i> ${Tools.htmlEntities(v.nombre_menu)}
                            <div class="pull-right">
                                <div class="btn-group">
                                    <div id="btns_${i}" class="btn-group _prt">
                                        <button data-toggle="dropdown" class="btn btn-primary btn-xs dropdown-toggle" aria-expanded="false"><span class="caret"></span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="panel-body" ${cssenable}>
                            <div id="mnux_${i}" class="text-left lv-arbol" style="height:200px;overflow:auto"></div>
                        </div>
                    </div>
                </div>`;
                $(that).append(cnt);
                $(`#btns_${i}`).data('keymnu', v.id_menu);
                $(`#btns_${i}`).data('parent', '0');



                $(`#mnux_${i}`).html(`<ul id="ulmnu_${v.id_menu}">${tthis._childrensMenu(data, v.id_menu)}</ul>`);
                /*sortable a cada ul*/
                $(`#ulmnu_${v.id_menu}`).sortable({
                    update: function () {
                        let ordenElements = $(this).sortable("toArray", {attribute: 'data-orden'}).toString();
                        tthis.postOrdenarMenu(ordenElements, _tk_);
                    }
                });

                $.fn.appButton.get({
                    aliasBtn: i,
                    container: `#btns_${i}`,
                    keymnu: tthis._alias,
                    type: 'li',
                    btns: [
                        {keybtn: APP_BTN.EDT, evts: [{click: 'Obj.System.MenuAx.formEditMenu'}]},
                        {keybtn: APP_BTN.NEW, evts: [{click: 'Obj.System.MenuAx.formNewMenu'}]},
                        {keybtn: APP_BTN.DEL, evts: [{click: 'Obj.System.MenuAx.postDelete'}]}
                    ]
                });
                Tools.tree(`#ulmnu_${v.id_menu}`);
            }
        });

        $(that).sortable({
            update: function () {
                let ordenElements = $(this).sortable("toArray", {attribute: 'data-orden'}).toString();
                tthis.postOrdenarMenu(ordenElements, _tk_);
            }
        });

        eval(this._txtEval);
    }

    addButtonsFormNew() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.GRB, type: 'submit'}]
        });
    }

    addButtonsFormUpdate() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.UPD, type: 'submit'}]
        });
    }

    setMenu(obj) {
        var data = obj.data;
        Tools.setDataForm(this._formEditMenu, {
            alias: this._alias,
            elements: [
                {item: 'txt_descripcion', value: data.nombre_menu, callback: () => {
                        Tools.tagsInput(obj);
                    }},
                {item: 'txt_icono', value: data.icono},
                {item: 'txt_alias', value: data.alias},
                {item: 'txt_ajax', value: (data.evt_ajax == 'not') ? '' : data.evt_ajax},
                {item: 'chk_activo', value: data.activo, type: 'checkbox'}
            ]
        });
    }

};  