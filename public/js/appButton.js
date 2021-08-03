"use strict";
var OBJBTNS = [];
var PREBTNCTXT = 'BCTXT_'; /*prefijo de ID para los botones con texto*/
var PREBTNSTXT = 'BSTXT_'; /*prefijo de ID para los botones sin texto*/
var PREBTNLI = 'BSLI_'; /*prefijo de ID para los botones tipo <li>*/

(function ($) {

    let BTNSYSCTXT = [];    /*los botones con texto*/
    let BTNSYSSTXT = [];    /*los botones sin texto*/
    let BTNSLI = [];    /*los botones en <li>*/

    $.fn.extend({

        appButton: {
            add: function (opt) {

                let defaults = {
                    data: []
                };

                var options = $.extend(defaults, opt);
                /*=========================================METODOS PRIVADOS=========================================*/
                var _private = {

                    createButton: function (oSettings) {
                        let v = oSettings.data;
                        let b = `<button id="${PREBTNCTXT}${v.alias + v.alias_btn}" type="button" class="${v.css}"><i class="${v.icono}"></i> ${Tools.traslate(v.nboton)}</button>`;
                        BTNSYSCTXT.push({keymnu: v.alias, keybtn: v.alias_btn, btn: b});

                        b = `<button id="${PREBTNSTXT}${v.alias + v.alias_btn}" type="button" class="${v.css}" title="${Tools.traslate(v.nboton)}"><i class="${v.icono}"></i></button>`;
                        BTNSYSSTXT.push({keymnu: v.alias, keybtn: v.alias_btn, btn: b});

                        b = `<li><a id="${PREBTNLI}${v.alias + v.alias_btn}" href="javascript:;" style="color:#333"><i class="${v.icono}"></i> ${Tools.traslate(v.nboton)}</a></li>`;
                        BTNSLI.push({keymnu: v.alias, keybtn: v.alias_btn, btn: b});
                        OBJBTNS[`${v.alias}${v.alias_btn}`] = v;
                    }

                };
                /*=========================================FIN METODOS PRIVADOS=====================================*/

//                return this.each(function () {

                var oSettings = options;

                let method = {

                    init: function () {
                        _private.createButton(oSettings);
                    }

                };

                method.init.call(this);


//                });
            },
            /*
             * 
             * @param {type} opt
             * @param {type} callback
             * @returns {undefined}
             * 
             *  $.fn.appButton.get({
                    container: `#${this._alias}tools_btn`,
                    keymnu: this._alias,
                    btns: [
                        {keybtn: APP_BTN.NEW, evts: [{click: 'Exe.MenuDom.formNewMenu'}]}
                    ]
                });
             */
            get: function (opt, callback = null) {

                let defaults = {
                    keymnu: null, /*alias del menu*/
                    btns: [], /*botones*/
                    notext: false, /*indica que se retornara el boton con sus descripcion*/
                    container: null,
                    type: 'button',
                    forceBtnXs: false,
                    aliasBtn: null  /*aplicable solo para <li>*/
                };

                var options = $.extend(defaults, opt);
                /*=========================================METODOS PRIVADOS=========================================*/
                var _private = {

                    render: function (oSettings) {
                        let data = (oSettings.notext) ? BTNSYSSTXT : BTNSYSCTXT;
                        let idbtn = (oSettings.notext) ? PREBTNSTXT : PREBTNCTXT;
                        let typebtn = null;
 
                        /*verificar si se generara <li>*/
                        data = (oSettings.type == 'li') ? BTNSLI : data;
                        idbtn = (oSettings.type == 'li') ? PREBTNLI : idbtn;

                        if (oSettings.type == 'li') {
                            $(oSettings.container).append('<ul class="dropdown-menu"></ul>');
                        }

                        /*recorrido de botones requeridos*/
                        $.each(oSettings.btns, function (i, v) {
                            typebtn = (v.type == undefined) ? 'button' : v.type;

                            /*recorrido de todos botones generados*/
                            $.each(data, function (ii, vv) {
                                let kbtn = null;
                                if (oSettings.keymnu == vv.keymnu && v.keybtn == vv.keybtn) {

                                    if (oSettings.type == 'li') {
                                        $(oSettings.container).find('ul').append(vv.btn);
                                    } else {
                                        $(oSettings.container).append(vv.btn);
                                        if (oSettings.forceBtnXs) {
                                            $(oSettings.container).find('button').addClass('btn-xs');
                                        }
                                    }

                                    kbtn = `${idbtn}${oSettings.keymnu}${vv.keybtn}`;

                                    /*agregar type de boton*/
                                    if (oSettings.type == 'button') {
                                        $(oSettings.container).find(`#${kbtn}`).attr('type', typebtn);
                                    }

                                    /*cambiando id de li si se envia aliasbtn*/
                                    if (oSettings.aliasBtn != undefined) {
                                        $(oSettings.container).find(`#${kbtn}`).attr('id', kbtn + oSettings.aliasBtn);
                                        kbtn = kbtn + oSettings.aliasBtn;
                                    }

                                    /*recorrido de eventos*/
                                    $.each(v.evts, function (a, b) {
                                        $.each(b, function (x, y) {
                                            eval(`
                                                setTimeout(function(){
                                                    $(oSettings.container).find('#${kbtn}').off('${x}');
                                                    $(oSettings.container).find('#${kbtn}').${x}(function(){
                                                        ${y}(this,'${_sys_sg}');
                                                    });
                                                },500);
                                        `);
                                        });
                                    });
                                }
                            });
                        });

                        if (typeof callback === 'function') {
                            callback(oSettings);
                        }
                    }

                };
                /*=========================================FIN METODOS PRIVADOS=====================================*/

                var oSettings = options;

                _private.render(oSettings);

            },
            
            create: function(obj){
                let btn = null;
                $.each(BTNSYSSTXT,function(i,v){
                    if(obj.keymnu == v.keymnu && obj.keybtn == v.keybtn){ console.log(v.btn)
                        btn = v.btn;
                    }
                });
                return btn;
            }
        }
    });

})(jQuery);