"use strict";
$$.System.RolRsc = class RolRsc extends Resource {

    constructor() {
        super();

        this._renderRoles = function (data, parent) {
            let li = '', text, btns, irm, evts;

            $.each(data, (i, v) => {
                if (parent == v.parent) {
                    irm = (!$.isEmptyObject(v.id_rolmenu)) ? `data-irm="${v.id_rolmenu}"` : '';
                    text = (v.childs > 0) ? `<i class="fa fa-folder"></i> ${Tools.traslate(v.nombre_menu)}` : `<label class="checkbox inline-block"><input type="checkbox" data-k="${v.id_menu}" data-in="${i}" ${irm} ${(v.assigned == 0) ? '' : 'checked'}><i></i> ${Tools.traslate(v.nombre_menu)}</label>`;
                    btns = (v.childs > 0) ? '' : `<span class="${this._alias}d_btn_conf"></span>`;
                    evts = (v.childs > 0) ? '' : `<div><div id="${this._alias}${i}d_evts" class="d_evts" style="width:435px;position: absolute;right: -480px;top: 8px;"></div></div>`;

                    li += `
                            <li style="${(parent == 0) ? '' : 'display:none;'}width:300px;">
                                <span>${text}</span> ${btns} ${evts}`;
                    if (v.childs > 0) {
                        li += `
                                <ul>${this._renderRoles.call(this, data, v.id_menu)}</ul>`;
                    }
                    li += `
                            </li>`;
                }
            });
            return li;
        };

        this._renderButtonsRol = function (data) {
            let btns = '<ul>';
            $.each(data, (i, v) => {
                btns += `<li style="display:none">${Tools.traslate(v.nboton)}</li>`;
            });
            btns += '</ul>';
            return btns;
        };

        this._renderRolesPreview = function (data, parent) {
            let li = '', tmp = 'x', botones,d;

            $.each(data, (i, v) => {
                if (parent == v.parent) {
                    if (tmp != v.nombre_menu) {
                        botones = $.grep(data, function (e) {
                            return e.id_menu == v.id_menu && !$.isEmptyObject(v.nboton);
                        });

                        d = (parent != 0)?'style="display:none"':'';
                        li += `
                            <li ${d}>
                                <span style="border-bottom:1px solid #7C7C7C">${Tools.traslate(v.nombre_menu)}</span>
                                ${(botones.length > 0)?this._renderButtonsRol(botones):''}`;
                        if (v.childs > 0) {
                            li += `
                                <ul style="list-style: none">${this._renderRolesPreview.call(this, data, v.id_menu)}</ul>`;
                        }
                        li += `</li>`;
                    }
                    tmp = v.nombre_menu;
                }
            });
            return li;
        };

        this._disableBtnConfg = () => {
            let li;

            $(`#${this._alias}d_tree`).find('button').prop('disabled', true);
            $(`#${this._alias}d_tree`).find('input:checkbox:checked').each(function (i, v) {
                li = $(v).parent().parent().parent('li');
                li.find('button').prop('disabled', false);
                li.find('button').data('k', $(v).data('k'));
                li.find('button').data('irm', $(v).data('irm'));
                li.find('button').data('in', $(v).data('in'));
            });
        };

        this._addEvtBtnConf = () => {
            $(`#${this._alias}d_tree`).find('button').off('click');
            $(`#${this._alias}d_tree`).find('button').click(function () {
                Obj.System.RolAx.getEventsOpcion(this, _tk_);//trae botones del server para configurarlos
            });
            //quitar eventos a botones disabled
            $(`#${this._alias}d_tree`).find('button:disabled').off('click');
        };

        this._dragDropEvents = () => {

            $(`#${this._alias}_noAss`).sortable({
                connectWith: `#${this._alias}_siAss`,
                stop: function (ev, ui) {
                    Obj.System.RolAx.postEvent(1, $(ui.item).data('k'), _tk_);
                }
            });

            $(`#${this._alias}_siAss`).sortable({
                connectWith: `#${this._alias}_noAss`,
                stop: function (ev, ui) {
                    Obj.System.RolAx.postEvent(2, $(ui.item).data('k'), _tk_);
                }
            });
        };
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
    
    addButtonsFormView() {
        $.fn.appButton.get({
            container: `#${this._alias}foot_btns`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.IMP, evts: [{click: 'Obj.System.RolAx.printAccess'}]}]
        });
    }

    setRol(obj) {
        var data = obj.data;
        Tools.setDataForm(this._formEdit, {
            alias: this._alias,
            elements: [
                {item: 'txt_descripcion', value: data.nrol, callback: () => {
                        Tools.tagsInput(obj);
                    }},
                {item: 'chk_activo', value: data.activo, type: 'checkbox'}
            ]
        });
    }

    setAccess(data) {
        let ul = `<ul>${this._renderRoles.call(this, data, 0)}</ul>`;

        $(`#${this._alias}d_tree`).html(ul);

        Tools.tree(`#${this._alias}d_tree`);

        $(`#${this._alias}d_tree`).find('input:checkbox').click(function () {
            Obj.System.RolAx.postOpcion(this, _tk_);
        });

        //agregando botones CONFIGURAR
        $.fn.appButton.get({
            container: `.${this._alias}d_btn_conf`,
            keymnu: this._alias,
            btns: [{keybtn: APP_BTN.CFG}]
        }, function (oSettings) {
            $(oSettings.container).find('button').css({
                padding: '3px 5px 3px 5px'
            });
        });

        //deshabilitando botones para opciones que no esten asignadas
        this._disableBtnConfg.call(this);

        //agregando eventos a botones habilitados
        this._addEvtBtnConf.call(this);

    }

    setAccessPreview(data) {
        let ul = `<ul style="border: 1px solid #7C7C7C;background: #FAFAFA;list-style: none;margin: 0;padding: 5px;">
                    ${this._renderRolesPreview.call(this, data, 0)}
                </ul>`;

        $(`#${this._alias}d_access`).html(ul);
        Tools.tree(`#${this._alias}d_access`);
    }

    renderEvents(data, indice) {
        var uAss = $('<ul></ul>'), uNoAss = $('<ul></ul>'), da = '', dna = '';

        $.each(data, function (i, v) {
            if (v.assigned == 0) {
                dna += `<li data-k="${v.id_boton}" class="move-cursor"><span>${Tools.traslate(v.nboton)}</span></li>`;
            } else {
                da += `<li data-k="${v.id_boton}" class="move-cursor"><span>${Tools.traslate(v.nboton)}</span></li>`;
            }
        });

        uAss.addClass('si-access');
        uAss.attr('id', `${this._alias}_siAss`);
        uAss.html(da);


        uNoAss.addClass('no-access');
        uNoAss.attr('id', `${this._alias}_noAss`);
        uNoAss.html(dna);

        let sch = `<i class="fa fa-search" style="position: absolute;top: -25px;left: 5px;"></i><input type="text" class="form-control" style="width:194px;margin-top:-35px;padding-left:20px;" placeholder="${APP_ETIQUET.search_sensitive}">`;

        $('.d_evts').html('');

        $(`#${this._alias}${indice}d_evts`).html(sch);
        $(`#${this._alias}${indice}d_evts`).append(uAss);
        $(`#${this._alias}${indice}d_evts`).append(uNoAss);


        $(`#${this._alias}${indice}d_evts`).find('input:text').off('keyup');
        $(`#${this._alias}${indice}d_evts`).find('input:text').keyup(function () {
            $('.no-access li').hide();
            $('.no-access li:contains("' + this.value + '")').show();

        });

        $.expr[":"].contains = $.expr.createPseudo(function (arg) {
            return function (elem) {
                return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
            };
        });

        this._dragDropEvents.call(this);
    }

};  