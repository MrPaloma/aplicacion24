/*
 * CREADO POR:      RDCC
 * FECHA:           09-12-2015
 */
(function ($) {

    "use strict";

    var COUNT_FORM_CLICK = [];          /*almacena evento addClickForm, se ejecuta varias veces, solo debe funcionar en valor 1*/

    $.fn.extend({
        arbol: function (opt) {

            var defaults = {
                tObjectContainer: $(this), /*identificador del contenedor*/
                sData: null, /*data para el tree*/
                fnCaptureKey: null, /*funcion que capturara el dato seleccionado*/
                parent: null, /*campo padre de nodos*/
                enterSearch: false, /*determina si la busqueda sera mediante enter o sensible*/
                minLength: 3, /*minimo de caracteres para busqueda*/
                clickHide: '', /*para agregar evento de tree al container tabb y no al formulario, se hizo esto porq causaba error al momento aplicar validate()*/
                defaultEtiquet: null,
                onClick: null,
                selectAll: false,
                selectText: true
            };

            var options = $.extend(defaults, opt);

            var _private = {};
            
            _private.spinner = '<i class="fa fa-spinner fa-pulse fa-1x fa-fw margin-bottom"></i>';

            /*
             * Click en form se ejecuta dos veces y solo es necesario una vez
             * este evento controla que click se ejecute en la vez 1
             * @param {type} idform
             * @param {type} v
             * @returns {Number|v}
             */
            _private.counterCickForm = function (idform, v) {
                if (COUNT_FORM_CLICK[idform] === undefined) {
                    COUNT_FORM_CLICK[idform] = 1;
                } else {
                    COUNT_FORM_CLICK[idform]++;
                }
                if (v !== undefined) {
                    COUNT_FORM_CLICK[idform] = v;
                }

                return COUNT_FORM_CLICK[idform];
            };

            /*
             * Agrega evento click a form para ocultar tree
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.addClickForm = function (oSettings) {

                setTimeout(function () {
                    var mismo = true;
                    var idform = '#' + oSettings.tObjectTree;//'#' + oSettings.tObjectContainer.parents('form').attr('id');

                    /*verificar si click va a formulario o a otro elemento*/
                    if (oSettings.clickHide != '') {
                        idform = oSettings.clickHide;
                        mismo = false;
                    }

                    $(idform).off("click");

                    $(idform).click(function (e) {
//                        $('.arbol').removeClass("chosen-with-drop");
//                        //solo se quita el css q da el efevto activo, si da click en cualquier parte del dom menos en el tree
//                        $('.arbol').removeClass("chosen-container-active");



                        /*cuando la busqueda es mediante enter se oculta el tree, esto evita que se oculte*/
                        if ($(e.target).prop('tagName') == 'BUTTON' || $.trim($(e.target).html()) == 'x')
                            return false;


                        var veces = _private.counterCickForm(idform);

                        if (veces == 2 && $(e.target).prop('tagName') !== 'INPUT') {
                            _private.counterCickForm(idform, 1);
                            veces = 1;
                        }

                        if (veces === 1) {
                            var hide = true;

                            if ($(e.target).data("tree") == "arbol") {
                                hide = false;
                            }

                            if ($(e.target).attr("class") == "spanTree" || $(e.target).hasClass("treeToogle")) {

                                if ($("#" + oSettings.tObjectTree).hasClass("chosen-with-drop")) {
                                    hide = true;
                                } else {
                                    hide = false;
                                }
                            }

                            if (hide) {
                                $("#" + oSettings.tObjectTree).removeClass("chosen-with-drop");

                                //solo se quita el css q da el efevto activo, si da click en cualquier parte del dom menos en el tree
                                if (!$(e.target).hasClass("spanTree") && $("#" + oSettings.tObjectTree).hasClass("chosen-container-active") || mismo) {
                                    $("#" + oSettings.tObjectTree).removeClass("chosen-container-active");
                                }
                            } else {
                                $("#" + oSettings.tObjectTree).addClass("chosen-container-active");
                                $("#" + oSettings.tObjectTree).addClass("chosen-with-drop");
                            }
                        } else {
                            _private.counterCickForm(idform, 0);
                        }
                    });

                }, 500);
            };

            /*
             * Oculta el tree mediante ESC
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.escHide = function (oSettings) {
                //agregando esc a text, para ocultar el tree
                $("#" + oSettings.tObjectInput).off("keypress");
                $("#" + oSettings.tObjectInput).keypress(function (e) {
                    if (e.keyCode == 27 && $("#" + oSettings.tObjectTree).length > 0) {
                        $("#" + oSettings.tObjectTree).removeClass("chosen-with-drop");
                    }
                });
            };

            /*
             * Construye el tree
             * @returns {String}
             */
            _private.buildTree = function (oSettings) {
                /*div contenedor*/
                var d = $('<div></div>');
                d.attr('id', oSettings.tObjectTree);
                d.addClass('spanTree');
                d.addClass('arbol');
                d.addClass('chosen-container');
                d.addClass('chosen-container-single');
                d.addClass('noblur');
                d.css({'width': '100%', 'margin-left': '0px'});

                /*elemento <a>*/
                var ael = $('<a></a>');
                ael.addClass('spanTree');
                ael.addClass('arbol');
                ael.addClass('chosen-single');
                ael.addClass('etiquetTree');
                ael.addClass('noblur');
                ael.css({'width': '100%', 'margin-left': '0px'});

                /*elemento <span>*/
                var sp = $('<span></span>');
                sp.addClass('spanTree');
                sp.addClass('arbol');
                sp.addClass('treeToogle');
                sp.addClass('noblur');
                sp.addClass('chosen-default');
                sp.css({'width': '100%', 'margin-left': '0px'});
                sp.html(SYS_LANG_LABELS.seleccionar);

                ael.append(sp);

                /*elemento <div>*/
                var ds = $('<div></div>');
                ds.addClass('spanTree');
                ds.addClass('arbol');
                ds.addClass('noblur');
                ds.html('<b class="spanTree"></b>');

                ael.append(ds);

                d.append(ael);

                /*div objtree*/
                var dobj = $('<div></div>');
                dobj.addClass('objtree_' + oSettings.tObjectInput);
                dobj.addClass('chosen-drop');
                dobj.addClass('arbol');
                dobj.addClass('arbol');
                dobj.addClass('noblur');
                dobj.attr('data-tree', 'arbol');

                /*div chosen*/
                var dchosen = $('<div></div>');
                dchosen.addClass('chosen-search');
                dchosen.addClass('arbol');
                dchosen.addClass('noblur');
                dchosen.attr('data-tree', 'arbol');

                /*elemento <input>*/
                var inp = $('<input>');
                inp.attr('id', oSettings.tObjectInput);
                inp.attr('name', oSettings.tObjectInput);
                inp.attr('autocomplete', 'off');
                inp.attr('type', 'text');
                inp.attr('data-tree', 'arbol');
                inp.addClass('arbol');

                dchosen.append(inp);

                dobj.append(dchosen);

                /*elemento <ul>*/
                var eul = $('<ul></ul>');
                eul.addClass('chosen-results');
                eul.addClass('arbol');
                eul.addClass('arbol');
                eul.addClass('novertical');
                eul.addClass('noblur');
                eul.attr('data-tree', 'arbol');

                /*texto SELECCIONAR*/
                if (oSettings.selectText) {
                    /*elemento <li> seleccionar*/
                    var li1 = $('<li></li>');
                    li1.addClass('active-result');
                    li1.addClass('noblur');
                    li1.addClass('nohide');
                    li1.addClass('arbol');
                    li1.attr('data-tree', 'arbol');

                    /*elemento <span>*/
                    var spl = $('<span></span>');
                    spl.addClass('noblur');
                    spl.addClass('arbol');
                    spl.attr('data-tree', 'arbol');

                    /*elemento <i>*/
                    var ii = $('<i></i>');
                    ii.addClass('noblur');
                    ii.addClass('arbol');
                    ii.attr('data-tree', 'arbol');

                    spl.append(ii);

                    /*elemento <label>*/
                    var lbl = $('<label></label>');
                    lbl.addClass('selectable_1');
                    lbl.addClass('pointer');
                    lbl.addClass('noblur');
                    lbl.addClass('arbol');
                    lbl.attr('data-tree', 'arbol');
                    lbl.attr('data-item', '0');
                    lbl.css({
                        'margin-left': '15px'
                    });
                    lbl.html(SYS_LANG_LABELS.seleccionar);

                    spl.append(lbl);

                    li1.append(spl);

                    var ld = $('<div></div>');
                    ld.addClass('text-center');
                    ld.addClass('spinner');
                    ld.html(_private.spinner);
                    ld.css({
                        display: 'none'
                    });
                    li1.append(ld);

                    eul.append(li1);
                }

                /*texto TODOS*/
                if (oSettings.selectAll) {
                    /*elemento <li> seleccionar*/
                    var li2 = $('<li></li>');
                    li2.addClass('active-result');
                    li2.addClass('noblur');
                    li2.addClass('arbol');
                    li2.addClass('nohide');
                    li2.attr('data-tree', 'arbol');

                    /*elemento <span>*/
                    var spll = $('<span></span>');
                    spll.addClass('noblur');
                    spll.addClass('arbol');
                    spll.attr('data-tree', 'arbol');

                    /*elemento <i>*/
                    var iii = $('<i></i>');
                    iii.addClass('noblur');
                    iii.addClass('arbol');
                    iii.attr('data-tree', 'arbol');

                    spll.append(iii);

                    /*elemento <label>*/
                    var lbll = $('<label></label>');
                    lbll.addClass('selectable_1');
                    lbll.addClass('pointer');
                    lbll.addClass('arbol');
                    lbll.addClass('noblur');
                    lbll.attr('data-tree', 'arbol');
                    lbll.attr('data-item', 'ALL');
                    lbll.css({'margin-left': '15px'});
                    lbll.html('Todos');

                    spll.append(lbll);

                    li2.append(spll);

                    eul.append(li2);
                }
                /*agregando <li>*/
                _private.renderData(eul, oSettings.parent, oSettings, false);

                dobj.append(eul);

                d.append(dobj);

                /*container aun no ha sido renombrado*/
                if ($('#' + oSettings.tObjectContainer.attr('id') + '_tree_container').attr('id') === undefined) {
                    /*renombrar id de elemento contenedor del tree*/
                    oSettings.tObjectContainer.attr('id', oSettings.tObjectContainer.attr('id') + '_tree_container');
                    oSettings.tObjectContainer.html(d);
                } else {
                    /*container ya se renombro, el html va a el renombrado*/
                    $('#' + oSettings.tObjectContainer.attr('id') + '_tree_container').html(d);
                }

            };

            /*
             * Crea la lista para el tree
             * @param {type} oSettings
             * @returns {String}
             */
            _private.renderData = function (eul, parent, oSettings, ul) {
                var circle, clitable, mr;

                if (ul) {
                    var uul = $('<ul></ul>');
                    uul.css({padding: '0px'});
                    uul.addClass('noblur');
                }

                var data = oSettings.sData;
                $.each(data, function (i, row) {
                    if (parent == row.parent) {
                        var ch = _private.counter(data, row.key); /* verificar si tiene hijos */

                        circle = '';
                        clitable = '';
                        mr = 'padding-left:15px;'; /*si no tiene hijos darle padding porq ya no se mostrara la img de +*/

                        if (ch > 0) {
                            circle = 'arbol-plus-square';
                            clitable = 'clicktree';
                            mr = 'display:inline-block;top:5px;position:absolute;';
                        }
                        if (!ul && ch == 0) {
                            //nada, solo para el primer nivel
                        } else {
                            var li = $('<li></li>');
                            li.addClass('active-result');
                            li.addClass('noblur');
                            li.attr('data-tree', 'arbol');

                            /*elemento <span>*/
                            var sp = $('<span></span>');
                            sp.addClass('noblur');
                            sp.attr('data-tree', 'arbol');

                            /*elemento <i>*/
                            var ii = $('<i></i>');
                            ii.addClass(clitable);
                            ii.addClass(circle);
                            ii.addClass('noblur');
                            ii.attr('data-tree', 'arbol');

                            sp.append(ii);

                            /*elemento <label>*/
                            var lb = $('<label></label>');
                            lb.attr('data-tree', 'arbol');
                            lb.addClass('noblur');
                            lb.addClass(clitable);
                            lb.addClass('selectable_' + row.selectable);
                            lb.addClass((row.selectable) ? 'pointer' : '');
                            lb.attr('data-item', row.key);
                            lb.attr('style', mr + 'margin:0px');
                            lb.html(row.value);

                            sp.append(lb);

                            li.append(sp);

                            _private.renderData(li, row.key, oSettings, true);

                            if (ul) {
                                li.css({display: 'none', position: 'relative'});

                                uul.append(li);
                                eul.append(uul);
                            } else {
                                li.css({display: 'block', position: 'relative'});
                                eul.append(li);
                            }

                        }
                    }
                });
            };

            /*
             * Retorna las coincidencias de un dato en array
             * @param {type} data
             * @param {type} p
             * @returns {Number}
             */
            _private.counter = function (data, p) {
                var count = 0;

                $.each(data, function (i, row) {
                    if (p == row.parent) {
                        count++;
                    }
                });

                return count;
            };

            /*
             * Activa efecto tree
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.effectTree = function (oSettings) {
                //para colocar img de cierre a tree
                $("#" + oSettings.tObjectTree + " ul li:last-child").addClass("cierre");

                //para dar efecto tree
                $(".objtree_" + oSettings.tObjectInput + " > ul").attr("role", "tree").find("ul").attr("role", "group"),
                        $(".objtree_" + oSettings.tObjectInput).find("li:has(ul)")
                        .addClass("parent__li")
                        .attr("role", "treeitem")
                        .find(" > span > .clicktree")
                        .attr("title", "Collapse this branch")
                        .on("click", function (a) {
                            var b = $(this).parent().parent("li.parent__li").find(" > ul > li");
                            b.is(":visible") ?
                                    (b.hide("fast"), $(this).parent().attr("title", "Expand this branch").find(" > i").addClass("arbol-plus-square").removeClass("arbol-minus-square"))
                                    : (b.show("fast"), $(this).parent().attr("title", "Collapse this branch").find(" > i").addClass("arbol-minus-square").removeClass("arbol-plus-square")), a.stopPropagation()
                        });
            };

            /*
             * agrega evento click a li seleccionable
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.addSelectable = function (oSettings) {
                //agregando evento click a selectable_1
                $("#" + oSettings.tObjectTree).find(".selectable_1").click(function () {
                    var h = $(this).html();
                    var itemm = $(this).attr("data-item");
                    $("#" + oSettings.tObjectTree).find(".etiquetTree").find("span").html(h);

                    setTimeout(function () {
                        //$("#"+oSettings.tObjectTree).removeClass("chosen-container-active");
                        $("#" + oSettings.tObjectTree).removeClass("chosen-with-drop");

                        /*si no no se pudo agregar evento para ocultar tree desde cualquier parte, quitar efecto activo*/
                        if (oSettings.clickHide === '') {
                            $("#" + oSettings.tObjectTree).removeClass("chosen-container-active");
                        }

                        /*verificar si existe funcion que captura el item seleccionado*/
                        if (oSettings.fnCaptureKey !== null) {
                            eval(oSettings.fnCaptureKey + '("' + itemm + '")');
                        }
                        /*verificar si existe funcion click*/
                        if (oSettings.onClick !== null) {
                            eval(oSettings.onClick + '("' + itemm + '")');
                        }
                    }, 50);
                });


            };

            /*
             * Selecciona la etiqueta default
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.selectDefaultEtiquet = function (oSettings) {
                /*seleccionando dato defaultEtiquet*/
                if (!$.isEmptyObject(oSettings.defaultEtiquet)) {
                    /*seteando dato default*/
                    eval(oSettings.fnCaptureKey + '("' + oSettings.defaultEtiquet + '")');

                    /*mostrando data default*/
                    $('#' + oSettings.tObjectTree).find('ul').find('li').each(function () {
                        var li = $(this).find('.selectable_1');
                        var h = $(li).html();
                        var itemm = $(li).attr("data-item");

                        if (itemm == oSettings.defaultEtiquet) {
                            $("#" + oSettings.tObjectTree).find(".etiquetTree").find("span").html(h);
                            return false;
                        }
                    });
                }
            };

            /*
             * busqueda sensible en tree
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.sensitiveSearch = function (oSettings) {
                $("#" + oSettings.tObjectInput).off("keyup");

                $("#" + oSettings.tObjectInput).keyup(function (e) {
                    var cadena = $.trim(this.value), cadenaLB, arrShow = [];
                    arrShow[oSettings.tObjectInput] = [];

                    if (e.keyCode !== 27 && cadena.length >= oSettings.minLength) {
                        $('#' + oSettings.tObjectTree).find("div ul li").css({display: "none"});
                        $('#' + oSettings.tObjectTree).find("div ul .nohide").css({display: "block"});
                        $('#' + oSettings.tObjectTree).find(".spinner").attr('style', 'display:block;');
                        $('#' + oSettings.tObjectTree).find(".spinner").html(_private.spinner);

                        Concurrent.Thread.create(function (oSettings, cadena, arrShow) {
                            $('#' + oSettings.tObjectTree).find("div ul li span label").each(function () {
                                cadenaLB = $.trim($(this).html());
                                if (cadenaLB.toLowerCase().indexOf(cadena.toLowerCase()) > -1) {
                                    arrShow.push({
                                        t: cadena,
                                        a: $(this).parent().parent('li').parents().find("span").find("i.clicktree"),
                                        b: $(this).parent().parent('li').parents(),
                                        c: $(this).parent().parent('li')
                                    });
                                }
                            });
                            $.each(arrShow, function (i, v) {
                                v.a.removeClass("arbol-plus-square").addClass("arbol-minus-square");
                                v.b.css({display: "block"});
                                v.c.css({display: "block"});
                            });
                            if (arrShow.length > 0) {
                                $('#' + oSettings.tObjectTree).find(".spinner").attr('style', 'display:none;');
                            }else{
                                $('#' + oSettings.tObjectTree).find(".spinner").attr('style', 'display:block;color: red ');
                                $('#' + oSettings.tObjectTree).find(".spinner").html(SYS_LANG_LABELS.not_exist);
                            }
                        }, oSettings, cadena, arrShow[oSettings.tObjectInput]);
                    }

                    if (e.keyCode !== 27 && cadena.length === 0) {
                        $('#' + oSettings.tObjectTree).find("div ul li").css({display: "none"});
                        $('#' + oSettings.tObjectTree).find("div ul li.parent__li").css({display: "block"});
                        $('#' + oSettings.tObjectTree).find("div ul .nohide").css({display: "block"});

                        $(".objtree_" + oSettings.tObjectInput).find(".arbol-minus-square").addClass("arbol-plus-square").removeClass("arbol-minus-square");
                    }
                });
            };

            /*
             * busqueda mediante enter en tree
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.enterSearch = function (oSettings) {
                $("#" + oSettings.tObjectInput).off("keyup");
                $("#" + oSettings.tObjectInput).keyup(function (e) {

                    var cadena = $.trim(this.value), cadenaLB, arrShow;

                    if (e.keyCode === 13 && cadena.length >= oSettings.minLength) {
                        arrShow = [];
                        $('#' + oSettings.tObjectTree).find("div ul li").css({display: "none"});
                        $('#' + oSettings.tObjectTree).find("div ul .nohide").css({display: "block"});
                        $('#' + oSettings.tObjectTree).find(".spinner").attr('style', 'display:block;');
                        $('#' + oSettings.tObjectTree).find(".spinner").html(_private.spinner);

                        Concurrent.Thread.create(function (oSettings, cadena, arrShow) {
                            $('#' + oSettings.tObjectTree).find("div ul li span label").each(function () {
                                cadenaLB = $.trim($(this).html());
                                if (cadenaLB.toLowerCase().indexOf(cadena.toLowerCase()) > -1) {
                                    arrShow.push({
                                        t: cadena,
                                        a: $(this).parent().parent('li').parents().find("span").find("i.clicktree"),
                                        b: $(this).parent().parent('li').parents(),
                                        c: $(this).parent().parent('li')
                                    });
                                }
                            });
                            $.each(arrShow, function (i, v) {
                                v.a.removeClass("arbol-plus-square").addClass("arbol-minus-square");
                                v.b.css({display: "block"});
                                v.c.css({display: "block"});
                            });
                            if (arrShow.length > 0) {
                                $('#' + oSettings.tObjectTree).find(".spinner").attr('style', 'display:none;');
                            }else{
                                $('#' + oSettings.tObjectTree).find(".spinner").attr('style', 'display:block;color: red ');
                                $('#' + oSettings.tObjectTree).find(".spinner").html(SYS_LANG_LABELS.not_exist);
                            }
                        }, oSettings, cadena, arrShow);
                    }

                    if (e.keyCode === 13 && cadena.length === 0) {
                        $('#' + oSettings.tObjectTree).find("div ul li").css({display: "block"});
                    }

                });
                $("#" + oSettings.tObjectInput).keypress(function (e) {
                    if (e.keyCode === 13) {
                        return false;
                    }
                });
            };

            /*
             * Asigna el placeholder a input de busqueda
             * @param {type} oSettings
             * @returns {undefined}
             */
            _private.addPlaceholder = function (oSettings) {
                $("#" + oSettings.tObjectInput).attr('placeholder', oSettings.placeholderInput);
            };

            return this.each(function () {

                var oSettings = options;

                /*generando id de objeto div*/
                oSettings.tObjectTree = oSettings.tObjectContainer.attr('id') + '_tree';

                /*id de input:text*/
                oSettings.tObjectInput = oSettings.tObjectContainer.attr('id');

                /*placeholder de input search*/
                oSettings.placeholderInput = SYS_LANG_LABELS.press_enter;

                var methodArbol = {
                    init: function (o, p) {
                        p.buildTree(o);

                        p.addClickForm(o);

                        p.escHide(o);

                        p.effectTree(o);

                        p.addSelectable(o);

                        if (o.enterSearch) {
                            p.enterSearch(o);
                            o.placeholderInput = SYS_LANG_LABELS.press_enter;
                        } else {
                            p.sensitiveSearch(o);
                        }

                        p.addPlaceholder(o);

                        p.selectDefaultEtiquet(o);

                        $('body').click(function (e) {
                            if (!$(e.target).hasClass('arbol')) {
                                $('.arbol').removeClass("chosen-with-drop");
                                //solo se quita el css q da el efevto activo, si da click en cualquier parte del dom menos en el tree
                                $('.arbol').removeClass("chosen-container-active");
                            }
                        });

                    }

                };

                Concurrent.Thread.create(methodArbol.init, oSettings, _private);
            });

        }

    });

})(jQuery); 