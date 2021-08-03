"use strict";
var APP_MENU = [];
(function ($) {

    $.fn.extend({

        appMenu: function (opt) {

            let defaults = {
                data: []
            };

            var options = $.extend(defaults, opt);

            /*=========================================METODOS PRIVADOS=========================================*/
            var _private = {

                buildButton: function (selfmenu) {
                    $.each(selfmenu, function (i, v) {
                        $(this).appButton.add({
                            data: v
                        });
                    });
                },

                /*
                 * Crea los subniveles del menu
                 * @param {type} id_menu
                 * @param {type} oSettings
                 * @returns {undefined}
                 */
                subItem: function (id_menu, oSettings, root) {
                    let li = null, cont = [], selfmenu = [], name = null, rot = root, icon = null, sp = null;
                    $.each(oSettings.data, function (i, v) {
                        if (v.parent == id_menu) {
                            if (JSON.stringify(cont).indexOf(v.id_menu) == -1) {
                                name = Tools.traslate(v.nombre_menu);
                                rot = `${root} / ${name}`;

                                icon = (v.evt_ajax != 'not') ? 'fa fa-bars' : 'fa fa-folder-open';
                                sp = (v.evt_ajax != 'not') ? '&nbsp;' : '';

                                li = `
                                <li id="li_${v.id_menu}">
                                    <a href="javascript:;" data-root="${rot}" title="${name}"><span class="text-menu-sm">${name}</span></a>`;
                                if (v.evt_ajax == 'not') {
                                    li += `<ul id="mnu_${v.id_menu}"></ul>`;
                                }
                                li += `
                                </li>`;
                                cont.push(v.id_menu);
                                $(`#mnu_${id_menu}`).append(li);

                                if (v.evt_ajax != 'not') {

                                    $(`#li_${v.id_menu}`).find('a').data('a', v.alias);

                                    $(`#li_${v.id_menu}`).find('a').click(function () {
                                        $('body').removeClass('hidden-menu');
                                        $('#process-general').fadeIn();
                                        eval(Tools.htmlEntities(v.evt_ajax).replace("')","',this)"));
                                    });
                                    selfmenu = $.grep(oSettings.data, function (e) {
                                        return e.id_rolmenu == v.id_rolmenu && e.access == 1;
                                    });
                                    /*agregar botones del menu*/
                                    _private.buildButton(selfmenu);
                                    APP_MENU.push({label: name, evento: Tools.htmlEntities(v.evt_ajax), title: name, alias: v.alias, root: rot});
                                } else {
                                    /*si no tiene evento ajax, entonces tine subniveles*/
                                    _private.subItem(v.id_menu, oSettings, rot);
                                }
                            }
                        }
                    });

                },

                render: function (oSettings) {
                    var li = null, t = this, cont = [], selfmenu = [], name = null;
                    $.each(oSettings.data, function (i, v) {
                        /*nivel inicial sin evento, tiene subniveles*/
                        if (v.parent == 0 && v.evt_ajax == 'not') {
                            if (!cont.includes(v.id_menu)) {
                                name = Tools.traslate(v.nombre_menu);
                                li = `
                                <li>
                                    <a href="javascript:;" data-root="${name}" title="${name}"><i class="${v.icon}"></i> <span class="menu-item-parent text-menu-sm">${name}</span></a>
                                    <ul id="mnu_${v.id_menu}"></ul>
                                </li>`;
                                cont.push(v.id_menu);

                                $(t).append(li);
                                _private.subItem(v.id_menu, oSettings, name);
                            }
                        }

                        /*nivel inicial con evento, no tiene subniveles*/
                        if (v.parent == 0 && v.evt_ajax != 'not') {
                            if (!cont.includes(v.id_menu)) {
                                name = Tools.traslate(v.nombre_menu);
                                li = `
                                <li id="li_${v.id_menu}">
                                    <a href="javascript:;" data-root="${name}" title="${name}"><i class="${v.icon}"></i> <span class="menu-item-parent text-menu-sm">${name}</span></a>
                                </li>`;
                                cont.push(v.id_menu);

                                $(t).append(li);

                                $(`#li_${v.id_menu}`).find('a').data('a', v.alias);
                                $(`#li_${v.id_menu}`).find('a').click(function () {
                                    $('body').removeClass('hidden-menu');
                                    $('#process-general').fadeIn();
                                    eval(Tools.htmlEntities(v.evt_ajax).replace("')","',this)"));
                                });

                                selfmenu = $.grep(oSettings.data, function (e) {
                                    return e.id_rolmenu == v.id_rolmenu && e.access == 1;
                                });
                                /*agregar botones del menu*/
                                _private.buildButton(selfmenu);

                                APP_MENU.push({label: name, evento: Tools.htmlEntities(v.evt_ajax), title: name, alias: v.alias, root: name});
                            }
                        }

                    });

                    setTimeout(function () {
                        topmenu || $("nav ul").jarvismenu({
                            "accordion": menu_accordion || !0,
                            "speed": menu_speed || !0,
                            "closedSign": '<em class="fa fa-caret-down"></em>',
                            "openedSign": '<em class="fa fa-caret-up"></em>'
                        })
                    }, 200);
                }

            };

            /*=========================================FIN METODOS PRIVADOS=====================================*/

            return this.each(function () {

                var oSettings = options;

                let method = {

                    init: function () {

                        _private.render.call(this, oSettings);

                    }

                };

                method.init.call(this);

            });

        }

    });

})(jQuery);