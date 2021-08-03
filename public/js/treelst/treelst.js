/*
 * CREADO POR:      RDCC
 * FECHA:           16-04-2018
 */
(function ($) {

    "use strict";

    $.fn.extend({
        treelst: function (opt) {

            var defaults = {
                data: null, /*data para el tree*/
                callBack: null, /*funcion que capturara el dato seleccionado y otras funciones*/
                parent: 0, /*campo padre de nodos*/
                searchSensitive: false, /*determina si la busqueda sera mediante enter o sensible*/
                minSearch: 3, /*minimo de caracteres para busqueda*/
                defaultItem: null,
                selectAll: false,
                selectText: true,
                placeholderSearch: 'Escriba y presione [enter] para buscar'
            };

            var options = $.extend(defaults, opt);

            var _private = {

                createLi: (oSettings, data, display = 'block') => {
                    let h = '', circle, clitable, childrens, mr;
                    let ml = (display == 'none') ? '-40px' : '-4px';

                    let getChildrens = (oSettings, data) => {
                        if (data.length > 0) {
                            return `<ul>${_private.createLi(oSettings, data, 'none')}</ul>`;
                        }
                        return '';
                    };

                    $.each(data, function (i, row) {
                        childrens = $.grep(oSettings.data, function (e) {
                            return e.parent == row.item;
                        });

                        circle = '';
                        clitable = '';

                        mr = 'padding-left:15px;'; /*si no tiene hijos darle padding porq ya no se mostrara la img de +*/

                        if (childrens.length > 0) {
                            circle = 'plus-icon';
                            clitable = 'clicktree';
                            mr = `top:-4px;position:relative;`;
                        }

                        h += `
                        <li class="active-result" style="margin-left:${ml};display:${display};">
                            <span>
                                <i class="${circle} ${clitable}"></i>
                                <label data-item="${row.item}" class="selectable_${row.selectable} ${clitable}" style="${mr}">${row.etiqueta}</label>
                            </span>
                            ${getChildrens(oSettings, childrens)}
                        </li>`;

                    });
                    return h;
                },

                buildTree: (oSettings) => {

                    let txtSelect = () => {
                        /*texto SELECCIONAR*/
                        if (oSettings.selectText) {
                            return '<li class="active-result" data-item="0" style="padding-left:23px;margin-left:-4px">Seleccionar</li>';
                        }
                        return '';
                    };

                    let txtTodos = () => {
                        /*texto SELECCIONAR*/
                        if (oSettings.selectAll) {
                            return '<li class="active-result" data-item="ALL" style="padding-left:23px;margin-left:-4px">Todos</li>';
                        }
                        return '';
                    };

                    let childrens = $.grep(oSettings.data, function (e) {
                        return e.parent == oSettings.parent;
                    });

                    let dTree = `
                    <div id="${oSettings.objTree}" class="treelst-container treelst-container-single treelst" style="width:100%">
                        <a class="chosen-single">
                            <span class="chosen-default">Seleccionar</span> <div><b></b></div>
                        </a>
                        <div class="chosen-drop">
                            <div class="chosen-search">
                                <input id="${oSettings.objSearch}" autocomplete="off" type="text" placeholder="${oSettings.placeholderSearch}">
                            </div>
                            <ul class="chosen-results">
                                ${txtSelect()}
                                ${txtTodos()}
                                ${_private.createLi(oSettings, childrens)}
                            </ul>
                        </div>
                    </div>`;
                    $(this).html(dTree);
                },
                /*
                 * Activa efecto tree
                 * @param {type} oSettings
                 * @returns {undefined}
                 */
                effectTree: (oSettings) => {
                    //para colocar img de cierre a tree
                    $(`#${oSettings.objTree} ul li:last-child`).addClass("cierre");

                    //para dar efecto tree
                    $(`#${oSettings.objTree}`).find('.chosen-drop > ul').attr("role", "tree").find("ul").attr("role", "group");
                    $(`#${oSettings.objTree}`).find('.chosen-drop').find("li:has(ul)")
                            .addClass("parent__li")
                            .find(" > span > .clicktree")
                            .on("click", function (a) {
                                var b = $(this).parent().parent("li.parent__li").find(" > ul > li");
                                b.is(":visible") ?
                                        (b.hide("fast"), $(this).parent().find(" > i").addClass("plus-icon").removeClass("minus-icon"))
                                        : (b.show("fast"), $(this).parent().find(" > i").addClass("minus-icon").removeClass("plus-icon")), a.stopPropagation();
                            });
                },

                /*
                 * Agrega evento click a tree para mostrar/ocultar <li>
                 * @param {type} oSettings
                 * @returns {undefined}
                 */
                addClick: (oSettings) => {
                    //solo se quita el css q da el efecto activo, si da click en cualquier parte del dom menos en el tree
                    $(document).click(function (e) {
                        if ($(e.target).prop('tagName') == 'HTML') {
                            $('.treelst').removeClass("treelst-container-active");
                            $('.treelst').removeClass("chosen-with-drop");
                            $('.treelst').data('open', 0);
                        }
                    });

                    $(`#${oSettings.objTree}`).off("click").click(function (e) {
                        if ($(e.target).prop('tagName') == 'SPAN') {
                            if ($(this).data('open')) {
                                $(this).data('open', 0);//estado de tree se cambia a cerrado
                                $(this).removeClass("chosen-with-drop");
                            } else {
                                $('.treelst').data('open', 0);
                                $(this).data('open', 1);//estado de tree se cambia a abierto
                                $('.treelst').removeClass("treelst-container-active");
                                $('.treelst').removeClass("chosen-with-drop");
                                $(this).addClass("treelst-container-active");
                                $(this).addClass("chosen-with-drop");
                                $(`#${oSettings.objSearch}`).focus();
                            }
                        }
                    });
                },

                /*
                 * agrega evento click a <li> seleccionable
                 * @param {type} oSettings
                 * @returns {undefined}
                 */
                addSelectable: (oSettings) => {
                    //agregando evento click a selectable_1
                    $(`#${oSettings.objTree}`).find(".selectable_1").click(function () {
                        let h = $(this).html();
                        let itemm = $(this).attr("data-item");
                        $(`#${oSettings.objTree}`).find(".chosen-default").html(h);

                        $(`#${oSettings.objTree}`).data('open', 0);
                        $(`#${oSettings.objTree}`).removeClass("chosen-with-drop");

                        /*verificar si existe funcion que captura el item seleccionado*/
                        if (oSettings.callBack !== null) {
                            oSettings.callBack(itemm);
                        }
                    });
                },

                /*
                 * Oculta el tree mediante ESC
                 * @param {type} oSettings
                 * @returns {undefined}
                 */
                escHide: (oSettings) => {
                    //agregando esc a text, para ocultar el tree
                    $(`#${oSettings.objSearch}`).off("keypress").keypress(function (e) {
                        if (e.keyCode == 27) {
                            $(`#${oSettings.objTree}`).data('open', 0);//estado de tree se cambia a cerrado
                            $(`#${oSettings.objTree}`).removeClass("chosen-with-drop");
                        }
                    });
                },

                /*
                 * Selecciona la etiqueta default
                 * @param {type} oSettings
                 * @returns {undefined}
                 */
                selectDefaultEtiquet: (oSettings) => {
                    /*seleccionando dato defaultEtiquet*/
                    if (!$.isEmptyObject(oSettings.defaultItem)) {
                        /*seteando dato default*/
                        /* y verificar si existe funcion que captura el item seleccionado*/
                        /*if (oSettings.callBack !== null) {
                            oSettings.callBack(oSettings.defaultItem);
                        }*/
                        let el = $(`#${oSettings.objTree}`).find('ul').find('li').find(`label[data-item="${oSettings.defaultItem}"]`);
                        $(`#${oSettings.objTree}`).find(".chosen-default").html(el.html());
                    }
                },

                /*
                 * busqueda mediante enter en tree
                 * @param {type} oSettings
                 * @returns {undefined}
                 */
                enterSearch: (oSettings) => {
                    $("#" + oSettings.objSearch).off("keyup").keyup(function (e) {
                        var cadena = $.trim(this.value);

                        if (e.keyCode === 13 && cadena.length >= oSettings.minSearch) {
                            $('#' + oSettings.objTree).find("div ul li").css({display: "none"});

                            $('#' + oSettings.objTree).find("div ul li span label:contains('" + cadena + "')").each(function () {
                                $(this).parent().parent('li').parents().find("span").find("i.clicktree").removeClass("plus-icon").addClass("minus-icon");
                                $(this).parent().parent('li').parents().css({display: "block"});
                                $(this).parent().parent('li').css({display: "block"});
                            });
                        }
                        //si no se busca nada se muestra todos los <li> parent 0
                        if (e.keyCode === 13 && cadena.length === 0 && $.isEmptyObject(cadena)) {
                            $('#' + oSettings.objTree).find("div > ul > li").css({display: "none"});
                            $('#' + oSettings.objTree).find("div > ul:eq(0) > li").css({display: "block"});
                            $('#' + oSettings.objTree).find("div > ul > li").find("i.clicktree").removeClass("minus-icon").addClass("plus-icon");
                        }
                    });
                },
                /*
                 * busqueda sensible en tree
                 * @param {type} oSettings
                 * @returns {undefined}
                 */
                sensitiveSearch: (oSettings) => {
                    $("#" + oSettings.objSearch).off("keyup");
                    $("#" + oSettings.objSearch).keyup(function (e) {
                        var cadena = $.trim(this.value);

                        if (e.keyCode !== 27 && cadena.length >= oSettings.minSearch) {
                            $('#' + oSettings.objTree).find("div ul li").css({display: "none"});

                            $('#' + oSettings.objTree).find("div ul li span label:contains('" + cadena + "')").each(function () {
                                $(this).parent().parent('li').parents().find("span").find("i.clicktree").removeClass("plus-icon").addClass("minus-icon");
                                $(this).parent().parent('li').parents().css({display: "block"});
                                $(this).parent().parent('li').css({display: "block"});
                            });

                        }
                    });
                }

            };
            return this.each(function () {

                var oSettings = options;

                oSettings.objTree = `${this.id}_treelst`;

                oSettings.objSearch = `${this.id}_treelst_search`;

                _private.buildTree.call(this, oSettings);

                _private.effectTree(oSettings);

                _private.addClick(oSettings);

                _private.addSelectable(oSettings);

                _private.escHide(oSettings);

                _private.selectDefaultEtiquet(oSettings);

                if (oSettings.searchSensitive) {
                    _private.sensitiveSearch(oSettings);
                } else {
                    _private.enterSearch(oSettings);
                }

            });
        }

    });
})(jQuery); 