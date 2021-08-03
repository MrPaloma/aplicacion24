"use strict";
class Tools_ {

    constructor() {
        this._tabs = $("#cont-general-tabs-sys").tabs();
        this._tabTemplate = `<li style='position:relative;border-radius: 3px 3px 0 0;-moz-border-radius: 3px 3px 0 0;-webkit-border-radius: 3px 3px 0 0;' id='#{idli}'> 
                                <span class='delete-tab' style='top:2px; left:2px;position:absolute;'>
                                    <button class='btn btn-xs font-xs btn-default hover-transparent'><i class='fa fa-times'></i></button>
                                </span>
                                <a href='#{href}'>&nbsp;&nbsp;&nbsp; #{label}</a>
                            </li>`;
        this._idsTMP = [];
    }

    getWs() {
        return {
            //rootDocs: 'https://fae.corporacion3v.com/UBL21/archivos_xml_sunat/cpe_xml/produccion/'
            //rootDocs: 'http://api.corporacion3v.com/UBL21/archivos_xml_sunat/cpe_xml/produccion/'
            rootDocs: 'http://localhost/UBL21/archivos_xml_sunat/cpe_xml/beta/'
        };
    }

    addTab(obj) {
        /*verificar si tab existe.*/
        if ($('#cont-general-tabs-sys').find('#' + obj.id + '_CONTAINER').length > 0) {
            $('#li-' + obj.id).remove();
            $('#cont-general-tabs-sys').find('#' + obj.id + '_CONTAINER').remove();
        }

        let li = $(this._tabTemplate.replace(/#\{href\}/g, "#" + obj.id + '_CONTAINER').replace(/#\{label\}/g, obj.label).replace(/#\{idli\}/g, 'li-' + obj.id));
        let tabContentHtml = (obj.content !== undefined) ? obj.content : `<h1><i class="fa fa-cog fa-spin"></i> Cargando...</h1>`;

        this._tabs.find("#cont-tabs-sys").append(li);
        this._tabs.find('#cont-main-sys').append("<div id='" + obj.id + "_CONTAINER' class='tab-pane'><p>" + tabContentHtml + "</p></div>");
        this._tabs.tabs("refresh");

        if (obj.breadCrumb) {
            $(obj.context._dmain).html(this.breadCrumb(obj.breadCrumb));
        } else {
            console.log('[breadCrumb] es requerido en Tools.addTab');
        }

        if (obj.fnCallback !== undefined) {
            if (obj.context == undefined) {
                console.log('[context] no definido.');
            }
            obj.fnCallback(obj.context);
            $('#process-general').fadeOut();
        }

        $('#li-' + obj.id).find('a').click();
        $("html, body").animate({scrollTop: 0}, 100);
    }

    closeTabs() {
        let t = this;
        $("#cont-general-tabs-sys").on("click", 'span.delete-tab', function () {
            /*detecto id de tab dentro del contenedro del aplicativo*/
            let panelId = $(this).closest("li").remove().attr("aria-controls");
            $("#" + panelId).remove();
            t._tabs.tabs("refresh");
        });
    }

    /*
     * 
     * @param {type} e
     * @returns {undefined}
     * Tools.closeTab(`${this._alias}-NWV`);
     */
    closeTab(e) {
        $(`#li-${e}`).find('.delete-tab').click();
        $('html,body').animate({scrollTop: 0}, '100');
    }

    /*
     * mensajes
     */
    notify() {
        let m = {
            ok: function (obj) {
                $.smallBox({
                    title: (obj.title !== undefined) ? obj.title : APP_MSN.msn_sys,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    color: (obj.color !== undefined) ? obj.color : "#739E73",
                    iconSmall: (obj.icon !== undefined) ? obj.icon : "fa fa-check shake animated",
                    timeout: (obj.timeout !== undefined) ? obj.timeout : 6000
                });
                if (obj.callback !== undefined) {
                    obj.callback();
                }
            },
            error: function (obj) {
                $.smallBox({
                    title: (obj.title !== undefined) ? obj.title : APP_MSN.msn_sys,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    color: (obj.color !== undefined) ? obj.color : "#C46A69",
                    iconSmall: (obj.icon !== undefined) ? obj.icon : "fa fa-warning shake animated",
                    timeout: (obj.timeout !== undefined) ? obj.timeout : 6000
                });
                if (obj.callback !== undefined) {
                    obj.callback();
                }
            },
            info: function (obj) {
                $.bigBox({
                    title: (obj.title !== undefined) ? obj.title : APP_MSN.msn_sys,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    color: (obj.color !== undefined) ? obj.color : "#3276B1",
                    timeout: (obj.timeout !== undefined) ? obj.timeout : 6000,
                    icon: (obj.icon !== undefined) ? obj.icon : "fa fa-bell swing animated",
                    number: (obj.number !== undefined) ? obj.number : "1"
                });
                if (obj.callback !== undefined) {
                    obj.callback();
                }
            },
            warning: function (obj) {
                $.bigBox({
                    title: (obj.title !== undefined) ? obj.title : APP_MSN.msn_sys,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    color: (obj.color !== undefined) ? obj.color : "#C79121",
                    timeout: (obj.timeout !== undefined) ? obj.timeout : 6000,
                    icon: (obj.icon !== undefined) ? obj.icon : "fa fa-shield fadeInLeft animated",
                    number: (obj.number !== undefined) ? obj.number : "1"
                });
                if (obj.callback !== undefined) {
                    obj.callback();
                }
            },
            msn: function (obj) {
                $.smallBox({
                    title: (obj.title !== undefined) ? obj.title : APP_MSN.msn_sys,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    color: (obj.color !== undefined) ? obj.color : "rgb(199, 145, 33)",
                    timeout: (obj.timeout !== undefined) ? obj.timeout : 6000,
                    icon: (obj.icon !== undefined) ? obj.icon : "fa fa-bell swing animated"
                });
                if (obj.callback !== undefined) {
                    obj.callback();
                }
            },
            smallMsn: function (obj) {
                $.smallBox({
                    title: (obj.title !== undefined) ? obj.title : APP_MSN.msn_sys,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    color: (obj.color !== undefined) ? obj.color : "#C79121",
                    iconSmall: (obj.icon !== undefined) ? obj.icon : "fa fa-exclamation-triangle bounce animated",
                    timeout: (obj.timeout !== undefined) ? obj.timeout : 6000
                });
                if (obj.callback !== undefined) {
                    obj.callback();
                }
            },
            confirm: function (obj) {
                $.SmartMessageBox({
                    title: `<b>${APP_MSN.msn_sys}</b>`,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    buttons: '[No][Si]'
                }, function (ButtonPressed) {
                    if (obj.context == undefined) {
                        console.log('[context] no definido, puede causar errores para ejecucion de callback');
                    }
                    if (ButtonPressed === "Si") {
                        if (obj.yes !== undefined) {
                            obj.yes();
                        }
                    }
                    if (ButtonPressed === "No") {
                        if (obj.not !== undefined) {
                            obj.not();
                        }
                    }
                });
            },
            alert: function (obj) {
                $.SmartMessageBox({
                    title: APP_MSN.msn_sys,
                    content: (obj.content !== undefined) ? obj.content : "No content",
                    buttons: '[Aceptar]'
                }, function (ButtonPressed) {
                    if (ButtonPressed === "Aceptar") {
                        if (obj.callback !== undefined) {
                            obj.callback();
                        }
                    }
                });
            },
            /*
             * este noty se creo para anular el evento click y no permita ocultarlo
             * @param {type} obj
             * @returns {undefined}
             */
            myNoty: function (obj = false) {
                let a, SmallBoxesAnchos;

                if (obj) {
                    let m = `
                    <div id="mysmall" class="SmallBox animated fadeInRight fast" style="top: 20px; background-color: ${(obj.color !== undefined) ? obj.color : "#739E73"};">
                        <div class="foto"><i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i></div>
                        <div class="textoFoto">
                            <span>${(obj.title !== undefined) ? obj.title : APP_MSN.msn_sys}</span>
                            <p>${obj.content}</p>
                        </div>
                        <div class="miniIcono"></div>
                    </div>`;
                    $('#divSmallBoxes').append(m);

                    $(".SmallBox").each(function (b) {
                        0 == b ? ($(this).animate({
                            top: 20
                        }, 300), a = ($(this).height() + 40), SmallBoxesAnchos = $(this).height() + 40) : ($(this).animate({
                            top: a
                        }), a = a + ($(this).height() + 20), SmallBoxesAnchos = SmallBoxesAnchos + $(this).height() + 20);
                    });
                } else {
                    return {
                        close: function () {
                            $('#mysmall').animate({
                                opacity: 0.25
                            }, 1000, function () {
                                $(this).remove();
                            });
                        }
                    };
            }
            }
        };
        return m;
    }

    /*
     * Agregar alias a HTML
     * @param {type} data
     * @param {type} alias
     * @returns {undefined}
     */
    addAliasData(data, alias, formName) {
        let sc = null, idsc = null, c = null, ee = null;

        $(data).find('input,div,span,select,textarea,label,button,js,a,ul,li,code,progress,b,section,table,tbody,footer,h1,small').each(function (i, v) {
            if ($(v).attr('data-parent') != undefined && /#/.test($(v).attr('data-parent'))) {
                $(`#${alias}${formName}`).find(`a[data-parent="${$(v).attr('data-parent')}"]`).attr('data-parent', `#${alias}${$(v).attr('data-parent').replace('#', '')}`);
            }
            if ($(v).attr('href') != undefined && /#/.test($(v).attr('href'))) {
                $(`#${alias}${formName}`).find(`a[href="${$(v).attr('href')}"]`).attr('href', `#${alias}${$(v).attr('href').replace('#', '')}`);
            }
            if ($(v).attr('name') != undefined) {
                $(`#${v.id}`).attr('name', alias + $(v).attr('name'));
            }
            if ($(v).attr('id') != undefined) {
                $(`#${v.id}`).attr('id', alias + $(v).attr('id'));
            }
            if ($(v).attr('for') != undefined) {
                $(`#${alias}${formName}`).find(`label[for="${$(v).attr('for')}"]`).attr('for', alias + $(v).attr('for'));
            }
            if ($(v).prop('tagName') == 'JS') {
                idsc = alias + $(v).attr('id');
                sc = $(v).html();

                let cont = 0, nwJS, isForm = true;
                /*agregando ALIAS  <js>*/
                $(data).find('input,div,span,select,textarea,label,button,form,b,section,table,tbody,footer').each(function (ii, vv) {
                    /*para id de <form>*/
                    if ($(vv).parent().prop('tagName') == 'FORM' && isForm) {
                        c = sc;
                        ee = eval(`c.replace(/${formName}/gi,'${alias}${formName}')`);
                        $(`#${idsc}`).html(ee);
                        isForm = false;
                    }
                    if ($(vv).attr('id') != undefined && !isForm) {
                        cont++;
                        c = (cont == 1) ? $(`#${idsc}`).html() : nwJS;
                        ee = eval(`c.replace(/${vv.id}/gi,'${alias}${vv.id}');`);
                        nwJS = ee;
                        ee = eval(`ee.replace(/__PK__/gi,"'${_sys_sg}'")`);
                        $(`#${idsc}`).html(ee);
                    }
                });
            }
        });
        $(`#${$(`#${idsc}`).parent('form').attr('id')}`).append(`<script>${$(`#${idsc}`).html()}</script>`);
        $(`#${$(`#${idsc}`).parent('form').attr('id')}`).find('script').remove();
        $(`#${$(`#${idsc}`).parent('form').attr('id')}`).find('js').remove();
    }

    /*
     * Traduce todas las etiquetas del app
     * @param {type} root
     * @returns {undefined}
     */
    traslation(lang) {
        if ($.isEmptyObject(lang)) {
            var ln = window.navigator.language || navigator.browserLanguage;
            var lang = ln.split('-')[0].toUpperCase();
        }
        lang = localStorage.getItem('app_lang');
        //  Exe.require({require: `${APP_ROOT}config/!18n/lang_${lang}`, callback: () => {
        var elems = document.querySelectorAll(".tr-language"), ev = '';
        for (var x = 0; x < elems.length; x++) {
            ev = `lang_${lang}.etiquet[ '${elems[x].dataset.tr}' ]`;
            elems[x].innerHTML = eval(ev);

            $(elems[x]).removeClass('tr-language'); /*se elimina clse de traduccion despues de efectuada la traduccion*/
            $(elems[x]).addClass('tr-language-ok');
        }
        //los placeholders
        elems = document.querySelectorAll(".tr-language-ph"), ev = '';
        for (var x = 0; x < elems.length; x++) {
            ev = `lang_${lang}.etiquet[ '${elems[x].dataset.trph}' ]`;
            elems[x].placeholder = eval(ev);

            $(elems[x]).removeClass('tr-language-ph');
            $(elems[x]).addClass('tr-language-ok');
        }

        //los titles
        elems = document.querySelectorAll(".tr-language-title"), ev = '';
        for (var x = 0; x < elems.length; x++) {
            ev = `lang_${lang}.etiquet[ '${elems[x].dataset.trtitle}' ]`;
            elems[x].title = eval(ev);

            $(elems[x]).removeClass('tr-language-title');
            $(elems[x]).addClass('tr-language-ok');
        }
        //los onoffswitch
        elems = document.querySelectorAll(".tr-language-onoffswitch"), ev = '';
        for (var x = 0; x < elems.length; x++) {
            ev = `lang_${lang}.etiquet[ '${$(elems[x]).data('swchon-text')}' ]`;
            elems[x].setAttribute('data-swchon-text', eval(ev));

            ev = `lang_${lang}.etiquet[ '${$(elems[x]).data('swchoff-text')}' ]`;
            elems[x].setAttribute('data-swchoff-text', eval(ev));

            $(elems[x]).removeClass('tr-language-onoffswitch');
            $(elems[x]).addClass('tr-language-ok');
        }


        APP_MSN = eval(`lang_${lang}.msn`); /*para los alertas*/
        APP_ETIQUET = eval(`lang_${lang}.etiquet`); /*para etiquetas y placeholders*/
        APP_TOUR = eval(`lang_${lang}.tour`); /*para las etiquetas del tour*/

        //     }
        // });

        APP_TOUR = eval(`tour_${lang}`); /*para las etiquetas del tour*/
    }

    getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
        //compatibility for firefox and chrome
        var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var pc = new myPeerConnection({
            iceServers: []
        }),
                noop = function () {},
                localIPs = {},
                ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
                key;

        function iterateIP(ip) {
            if (!localIPs[ip])
                onNewIP(ip);
            localIPs[ip] = true;
        }

        //create a bogus data channel
        pc.createDataChannel("");

        // create offer and set local description
        pc.createOffer().then(function (sdp) {
            sdp.sdp.split('\n').forEach(function (line) {
                if (line.indexOf('candidate') < 0)
                    return;
                line.match(ipRegex).forEach(iterateIP);
            });

            pc.setLocalDescription(sdp, noop, noop);
        }).catch(function (reason) {
            // An error occurred, so handle the failure to connect
        });

        //listen for candidate events
        pc.onicecandidate = function (ice) {
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex))
                return;
            ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
        };
    }

    /*
     * Traduce de idioma las etiquetas de el menu y los botones
     * @param {type} text
     * @returns {Tools_.traslate.t2}
     */
    traslate(text) {
        let lang = localStorage.getItem('app_lang');
        let t1 = text.split(',');
        let t2 = null;
        let t3 = null;

        $.each(t1, function (i, v) {
            t2 = v.split('-');

            if (lang == t2[0]) {
                t3 = v.replace(`${lang}-`, '');//quito el alis del idioma y el guion
            }
        });

        return t3;
    }

    en(c) {
        return Aes.Ctr.post(c, 256);
    }

    de(c) {
        return Aes.Ctr.get(c, 256);
    }

    htmlEntities(str) {
        return String(str).replace(/&#039;/g, "'")
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
    }

    htmlEntitiesDecode(txt) {
        return $('<textarea />').html(txt).text();
    }

    /*
     * 
     * @param {type} obj
     * @returns {undefined}
     * @uso 
     *       Tools.listBox({
     *           data: data,
     *           optionSelec: true,
     *           content: 'content',
     *           attr:{
     *               id: 'lst_element',
     *               name: 'lst_element'
     *           },
     *           dataView:{
     *               etiqueta: 'db_etiqueta',
     *               value: 'db_value'
     *           }
     *       });
     * 
     */
    listBox(obj) {
        var data = obj.data,
                optionSelec = (obj.optionSelec === undefined) ? true : obj.optionSelec, /*para mostrar texto seleccionar*/
                content = obj.content, /*id deelemento donde se cargara <select>*/
                required = (obj.required === undefined) ? false : obj.required,
                deffault = (obj.default !== undefined) ? obj.default : '', /*para seleccionar un registro por defecto*/
                fnCallback = (obj.fnCallback !== undefined) ? obj.fnCallback : '', /*funcion anonima*/
                dataView = obj.dataView, /*la data a setear en <select>*/
                attr = '', /*los atributos html del <select>*/
                chosen = (obj.chosen === undefined) ? true : obj.chosen,
                optionAll = (obj.optionAll === undefined) ? false : obj.optionAll,
                parent = (obj.parent === undefined) ? '' : obj.parent,
                group = (obj.group === undefined) ? false : obj.group;

        var iidd = '';
        if (obj.attr !== undefined && obj.attr !== '') {
            for (var i in obj.attr) {
                if (i == 'id') {
                    iidd = obj.attr[i];
                }
                attr += i + '="' + obj.attr[i] + '" ';
            }
        }
        var cb = '<select ' + attr + '>';
        if (optionSelec) {
            cb += '<option value="">' + APP_ETIQUET.seleccionar + '</option>';
        }
        if (optionAll) {
            cb += '<option value="ALL">' + APP_ETIQUET.todos + '</option>';
        }
        var sel = '';
        var id = '';
        var value = '';
        var dataAttr = '';
        var grupo = '', idx = '';

        $.each(data, function (i, v) {
            id = '';
            dataAttr = '';

            /*creando data-*/
            if (dataView.attr !== undefined) {
                if ($.isArray(dataView.attr)) {
                    for (var k in dataView.attr) {
                        dataAttr += 'data-' + dataView.attr[k] + '="' + eval('data[i].' + dataView.attr[k]) + '" ';
                    }
                } else {
                    dataAttr = 'data[i].' + dataView.attr;
                    dataAttr = 'data-' + dataView.attr + '="' + eval(dataAttr) + '" ';
                }
            }

            if ($.isArray(dataView.value)) {
                for (var j in dataView.value) {
                    id += eval('data[i].' + dataView.value[j]) + '-';
                }

                id = id.substring(0, id.length - 1);

            } else {
                id = 'data[i].' + dataView.value;
                id = eval(id);
            }

            value = '';
            if ($.isArray(dataView.etiquet)) {
                for (var j in dataView.etiquet) {
                    value += eval('data[i].' + dataView.etiquet[j]) + ' - ';
                }

                value = value.substring(0, value.length - 2);

            } else {
                value = 'data[i].' + dataView.etiquet;
                value = eval(value);
            }
            sel = '';

            if (group === false) {
                if(/,/g.test(deffault)){
                    let x = deffault.split(',');
                    $.each(x,function(i,v){
                        if(v == id){
                            sel = ' selected = "selected" ';
                        }
                    });
                }else if (deffault == id) {
                    sel = ' selected = "selected" ';
                }
                cb += '<option value="' + id + '" ' + sel + ' ' + dataAttr + '>' + value + '</option>';
            } else {
                if (parent === eval('data[i].parent')) {
                    grupo = eval('data[i].' + dataView.etiquet);
                    cb += '<optgroup class="' + id + '" label="' + grupo + '" >';
                    for (var j in data) {
                        if (eval('data[j].parent') === id) {
                            sel = '';
                            if (deffault === eval('data[j].' + dataView.value)) {
                                sel = '  selected="selected" ';
                            }
                            value = eval('data[j].' + dataView.etiquet);
                            idx = eval('data[j].' + dataView.value);
                            cb += '<option value="' + idx + '" ' + sel + ' ' + dataAttr + '>' + value + '</option>';
                        }
                    }
                    cb += '</optgroup>';
                }
            }
        });
        cb += '</select>';

        if (!chosen) {
            cb += '<i></i>';
        }

        if (content == 'return') {
            return cb;
        } else {
            $(content).html(cb);
        }

        if (chosen) {
            $('#' + iidd).chosen();
            $('#' + iidd + '_chosen').css({width: '100%'});
            if (required) {
                $('#' + iidd + '_chosen').find('a.chosen-default').addClass('lv-requided');
                $('#' + iidd + '_chosen').find('a.chosen-default').find('> div').css({'margin-right': '10px'});
            }
        }
        if (fnCallback !== '') {
            fnCallback();
        }
    }

    ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
    }

    breadCrumb(data) {
        let d = data.split('/');
        let b = `
        <ul class="lv-breadcrumb hidden-xs">
            <li><a href="javascript:;"><i class="fa fa-home"></i></a></li>`;
        $.each(d, function (i, v) {
            b += `<li><a href="javascript:;">${v}</a></li>`;
        });
        b += `</ul><div class="lv-divider-bread"></div>`;
        return b;
    }

    spinner() {
        return {
            main: `
            <h1><i class="fa fa-cog fa-spin"></i> ${APP_ETIQUET.loading}</h1>`
        };
    }

    tree(el) {
        /*apagar para q efectono se duplique*/
        $(el)
                .find("li:has(ul)")
                .addClass("parent_lili")
                .attr("role", "treeitem")
                .find(" > span").not('a')
                .off("click");

        $(el + " > ul").attr("role", "tree").find("ul").attr("role", "group"),
                $(el)
                .find("li:has(ul)")
                .addClass("parent_lili")
                .attr("role", "treeitem")
                .find(" > span").not('a')
                .on("click", function (a) {

                    var b = $(this).parent("li.parent_lili").find(" > ul > li");

                    b.is(":visible") ? (b.hide("fast"),
                            $(this).find(" > i")
                            .addClass("fa-folder")
                            .removeClass("fa-folder-open")) : (b.show("fast"),
                            $(this).find(" > i")
                            .addClass("fa-folder-open")
                            .removeClass("fa-folder")),
                            a.stopPropagation();
                });
    }

    /*
     * Cierra y quita los modals del DOM
     * @param {type} obj
     * @returns {undefined}
     */
    closeModal(obj) {
        var search = obj.toString().indexOf('#'), id = '';
        if (search === -1) {/*cuando se cierra modal desde botones*/
            id = $(obj).parent().parent().parent().parent().attr('id');
            if (id == undefined) {
                id = $(obj).parent().parent().parent().parent().parent().attr('id');
            }
            id = `#${id}`;
        } else {/*cuando se cierra modal desde closeModal*/
            id = obj;
        }

        $(id).modal('hide');
        setTimeout(function () {
            $(id).remove();
            $(id + '_modalFormBoot').remove();
        }, 200);
        $(".modal").off("keypress");/*quitar evento que se agrega al momento de usar el TREE.php*/
    }

    execMessage(obj) {
        eval(`
            Tools.notify().${obj.ok_error}({
                content: APP_MSN.${obj.mensaje}
            });
        `);
    }

    /*
     * Carga data de formulario
     * @param {type} form
     * @param {type} obj
     * @returns {undefined}
     * Tools.setDataForm(this._formEditMenu, {
     alias: this._alias,
     elements: [
     
     {item: 'txt_alias', value: data.alias},
     {item: 'chk_activo', value: data.activo, type: 'checkbox'}
     ]
     });
     */
    setDataForm(form, obj) {
        let alias = obj.alias, type, item, value, callback, chkrd;

        $.each(obj.elements, function (i, v) {
            type = (v.type !== undefined) ? v.type : 'input';
            item = (v.item !== undefined) ? v.item : '';
            value = (v.value !== undefined) ? v.value : '';
            callback = (v.callback !== undefined && $.isFunction(v.callback)) ? v.callback : null;

            if ((type == 'input' || type == 'select')) {
                $(form).find(`#${alias}${item}`).val(value);
                if (type == 'select') {
                    $(form).find(`#${alias}${item}`).chosen("destroy").chosen().trigger('chosen:updated');
                }
            }
            if (type == 'multiple') {
                let data = value.split(',');
                $.each(data, function (i, v) {
                    $(form).find(`#${alias}${item} option[value=${v}]`).attr('selected', true);
                });

                $(form).find(`#${alias}${item}`).chosen("destroy").chosen().trigger('chosen:updated');
            }
            if (type == 'radio' || type == 'checkbox') {
                chkrd = (value == '1') ? true : false;
                $(form).find(`#${alias}${item}`).prop('checked', chkrd);
            }
            if (['html'].includes(type)) {
                $(form).find(`#${alias}${item}`).html(value);
            }

            if (callback) {
                callback();
            }

        });
    }

    /*
     * Marcar / Desmarcar los checks de grid
     * @param {type} el
     * @param {type} tab
     */
    checkAll(el, tab) {
        $(tab).find('tbody').find('tr').each(function () {
            if ($(el).is(':checked')) {
                if (!$(this).find('.chkG').is(':checked')) {
                    $(this).find('.chkG').click();
                }
            } else {
                if ($(this).find('.chkG').is(':checked')) {
                    $(this).find('.chkG').click();
                }
            }
        });
    }

    randomColor() {
        return '#' + (Math.random().toString(16) + "000000").substring(2, 8);
    }
    /*
     * Agrega boton tour al tab principal de cada opcion
     * @returns {undefined}
     */
    addTourMain() {
        let dt = $('<div></div>');
        dt.css({
            position: 'fixed',
            bottom: '0px',
            right: '0px',
            padding: '5px',
            'z-index': 3
        });
        let c = Tools.randomColor();
        dt.html(`<button id="${this._alias}btnTourMain" type="button" title="${APP_ETIQUET.tour}" class="btn btn-info btn-lg " style="background-color: ${c};padding: 12px 17px;"><i class="fa fa-question-circle"></i></button>`);

        $(`#${this._alias}_CONTAINER`).append(dt);

        $(`#li-${this._alias}`).find('a').css({
            color: c
        });


        $(`#${this._alias}btnTourMain`).off('click');
        $(`#${this._alias}btnTourMain`).click(() => {
            this._tour.main.call(this);
        });
    }

    addTourModal(cont, callBack) {
        let idBtn = cont.replace('#', '');
        $(cont).prepend(`<button id="${idBtn}btnTour" type="button" class="btn btn-info" style="background:#fb3c4a" title="${APP_ETIQUET.tour}"><i class="fa fa-question-circle"></i></button>`);
        $(`#${idBtn}btnTour`).off('click');

        if (typeof callBack == 'function') {
            $(`#${idBtn}btnTour`).click(() => {
                callBack.call(this);
            });
        }
    }

    addTourTab(cont, callBack, prefijo_tab) {
        let idBtn = cont.replace('#', '');
        let dt = $('<div></div>');
        dt.css({
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            'z-index': 3
        });
        let c = Tools.randomColor();
        dt.html(`<button id="${idBtn}btnTourTab" type="button" title="${APP_ETIQUET.tour}" class="btn btn-info btn-lg " style="background-color: ${c};"><i class="fa fa-question-circle"></i></button>`);

        $(cont).append(dt);

        $(`#li-${this._alias}-${prefijo_tab}`).find('a').css({
            color: c
        });


        if (typeof callBack == 'function') {
            $(`#${idBtn}btnTourTab`).click(() => {
                callBack.call(this);
            });
        }
    }

    refreshGrid(grid) {
        $('#btnRefresh_' + grid).click();
    }
    /*
     * activa dise単o de input tipo TAGS
     * @param {type} obj
     * @returns {undefined}
     */
    tagsInput(obj) {
        setTimeout(function () {
            $('.tagsinput').tagsinput({id: `${obj.context._alias}tagsinput`});
            $('.bootstrap-tagsinput').addClass('col-lg-12');
        }, 100);
    }
    /*
     * Imprime un area
     * @param {type} opt
     * @returns {undefined}
     */
    printArea(opt) {
        let defaults = {
            area: null,
            orientation: 'portrait',
            css: '',
            overrideElementCSS: false
        };

        let settings = $.extend(defaults, opt);

        $(settings.area).printElement({
            overrideElementCSS: settings.overrideElementCSS,
            printBodyOptions: {
                styleToAddHead: `                
                    @page{
                        size: 210mm 297mm ${settings.orientation};
                        margin:0;                        
                    } 
                    body{
                        margin:0;
                    } 
                    @media all { 
                        .area_print{
                            padding-left: 15mm;
                            padding-right: 15mm;
                            padding-bottom: 10mm;
                            padding-top: 10mm;
                        }
                        div { font-family: arial, sans-serif; } 
                        ${settings.css}
                    } 
                    @media print{ 
                        .area_print{
                            padding-left: 15mm;
                            padding-right: 15mm;
                            padding-bottom: 10mm;
                            padding-top: 10mm;
                        }
                        div { font-family: arial, sans-serif; } 
                        ${settings.css}
                    }`
            }
        });
    }

    printTicket(opt) {
        let defaults = {
            area: null,
            orientation: 'portrait',
            css: ''
        };

        let settings = $.extend(defaults, opt);

        $(settings.area).printElement({
            logo: false,
            overrideElementCSS: settings.overrideElementCSS,
            printBodyOptions: {
                styleToAddHead: `                
                    @page{
                        size: 80mm ${settings.orientation};
                        margin:0;                        
                    } 
                    body{
                        margin:0;
                    } 
                    @media all { 
                        .area_print{
                            padding-left: 5mm;
                            padding-right: 10mm;
                            padding-bottom: 10mm;
                            padding-top: 7mm;
                        }
                        div { font-family: arial, sans-serif; } 
                        ${settings.css}
                    } 
                    @media print{ 
                        .area_print{
                            padding-left: 5mm;
                            padding-right: 10mm;
                            padding-bottom: 10mm;
                            padding-top: 7mm;
                        }
                        div { font-family: arial, sans-serif; } 
                        ${settings.css}
                    }`
            }
        });
    }

    /*
     * Almacena los datos de un formulario en local para luego cargarlos nuevamente en cada elemento
     * @param {type} form
     * @returns {undefined}
     */
    runDataLocalStorage(form) {
        let el;
        $(form).find('input:text,textarea').keyup((e) => {
            el = $(e.currentTarget);
            localStorage.setItem(el.attr('id'), el.val());
            localStorage.setItem('storage', true);
            this._idsTMP[el.attr('id')] = true;
        });
        $(form).find('select,input:text,textarea').change((e) => {
            el = $(e.currentTarget);
            localStorage.setItem(el.attr('id'), el.val());
            localStorage.setItem('storage', 1);
        });
        if (localStorage.getItem('storage') == 1) {
            //cargar datos de localstorage en formulario
            $(form).find('input:text,select,textarea').each((e, elem) => {
                el = $(elem);
//                console.log(el.val() + '...' + el.attr('id') + '...' + localStorage.getItem(el.attr('id')))
                if (localStorage.getItem(el.attr('id'))) {
                    $(`#${el.attr('id')}`).val(localStorage.getItem(el.attr('id')));
                }
            });
        }
    }

    stopDataLocalStorage() {
        localStorage.setItem('storage', 0);
        //se limpia los indices en storage
        $.each(this._idsTMP, function (i, v) {
            localStorage.setItem(i, '');
        });
        this._idsTMP = [];
    }

    nunMiniCharts() {
        /*
         * SPARKLINES
         * DEPENDENCY: js/plugins/sparkline/jquery.sparkline.min.js
         * See usage example below...
         */

        /* Usage:
         * 		<div class="sparkline-line txt-color-blue" data-fill-color="transparent" data-sparkline-height="26px">
         *			5,6,7,9,9,5,9,6,5,6,6,7,7,6,7,8,9,7
         *		</div>
         */

        if ($.fn.sparkline) {

            // variable declearations:

            var barColor,
                    sparklineHeight,
                    sparklineBarWidth,
                    sparklineBarSpacing,
                    sparklineNegBarColor,
                    sparklineStackedColor,
                    thisLineColor,
                    thisLineWidth,
                    thisFill,
                    thisSpotColor,
                    thisMinSpotColor,
                    thisMaxSpotColor,
                    thishighlightSpotColor,
                    thisHighlightLineColor,
                    thisSpotRadius,
                    pieColors,
                    pieWidthHeight,
                    pieBorderColor,
                    pieOffset,
                    thisBoxWidth,
                    thisBoxHeight,
                    thisBoxRaw,
                    thisBoxTarget,
                    thisBoxMin,
                    thisBoxMax,
                    thisShowOutlier,
                    thisIQR,
                    thisBoxSpotRadius,
                    thisBoxLineColor,
                    thisBoxFillColor,
                    thisBoxWhisColor,
                    thisBoxOutlineColor,
                    thisBoxOutlineFill,
                    thisBoxMedianColor,
                    thisBoxTargetColor,
                    thisBulletHeight,
                    thisBulletWidth,
                    thisBulletColor,
                    thisBulletPerformanceColor,
                    thisBulletRangeColors,
                    thisDiscreteHeight,
                    thisDiscreteWidth,
                    thisDiscreteLineColor,
                    thisDiscreteLineHeight,
                    thisDiscreteThrushold,
                    thisDiscreteThrusholdColor,
                    thisTristateHeight,
                    thisTristatePosBarColor,
                    thisTristateNegBarColor,
                    thisTristateZeroBarColor,
                    thisTristateBarWidth,
                    thisTristateBarSpacing,
                    thisZeroAxis,
                    thisBarColor,
                    sparklineWidth,
                    sparklineValue,
                    sparklineValueSpots1,
                    sparklineValueSpots2,
                    thisLineWidth1,
                    thisLineWidth2,
                    thisLineColor1,
                    thisLineColor2,
                    thisSpotRadius1,
                    thisSpotRadius2,
                    thisMinSpotColor1,
                    thisMaxSpotColor1,
                    thisMinSpotColor2,
                    thisMaxSpotColor2,
                    thishighlightSpotColor1,
                    thisHighlightLineColor1,
                    thishighlightSpotColor2,
                    thisFillColor1,
                    thisFillColor2;

            $('.sparkline:not(:has(>canvas))').each(function () {
                var $this = $(this),
                        sparklineType = $this.data('sparkline-type') || 'bar';

                // BAR CHART
                if (sparklineType == 'bar') {

                    barColor = $this.data('sparkline-bar-color') || $this.css('color') || '#0000f0';
                    sparklineHeight = $this.data('sparkline-height') || '26px';
                    sparklineBarWidth = $this.data('sparkline-barwidth') || 5;
                    sparklineBarSpacing = $this.data('sparkline-barspacing') || 2;
                    sparklineNegBarColor = $this.data('sparkline-negbar-color') || '#A90329';
                    sparklineStackedColor = $this.data('sparkline-barstacked-color') || ["#A90329", "#0099c6", "#98AA56", "#da532c", "#4490B1", "#6E9461", "#990099", "#B4CAD3"];

                    $this.sparkline('html', {
                        barColor: barColor,
                        type: sparklineType,
                        height: sparklineHeight,
                        barWidth: sparklineBarWidth,
                        barSpacing: sparklineBarSpacing,
                        stackedBarColor: sparklineStackedColor,
                        negBarColor: sparklineNegBarColor,
                        zeroAxis: 'false'
                    });

                    $this = null;

                }

                // LINE CHART
                if (sparklineType == 'line') {

                    sparklineHeight = $this.data('sparkline-height') || '20px';
                    sparklineWidth = $this.data('sparkline-width') || '90px';
                    thisLineColor = $this.data('sparkline-line-color') || $this.css('color') || '#0000f0';
                    thisLineWidth = $this.data('sparkline-line-width') || 1;
                    thisFill = $this.data('fill-color') || '#c0d0f0';
                    thisSpotColor = $this.data('sparkline-spot-color') || '#f08000';
                    thisMinSpotColor = $this.data('sparkline-minspot-color') || '#ed1c24';
                    thisMaxSpotColor = $this.data('sparkline-maxspot-color') || '#f08000';
                    thishighlightSpotColor = $this.data('sparkline-highlightspot-color') || '#50f050';
                    thisHighlightLineColor = $this.data('sparkline-highlightline-color') || 'f02020';
                    thisSpotRadius = $this.data('sparkline-spotradius') || 1.5;
                    var thisChartMinYRange = $this.data('sparkline-min-y') || 'undefined';
                    var thisChartMaxYRange = $this.data('sparkline-max-y') || 'undefined';
                    var thisChartMinXRange = $this.data('sparkline-min-x') || 'undefined';
                    var thisChartMaxXRange = $this.data('sparkline-max-x') || 'undefined';
                    var thisMinNormValue = $this.data('min-val') || 'undefined';
                    var thisMaxNormValue = $this.data('max-val') || 'undefined';
                    var thisNormColor = $this.data('norm-color') || '#c0c0c0';
                    var thisDrawNormalOnTop = $this.data('draw-normal') || false;

                    $this.sparkline('html', {
                        type: 'line',
                        width: sparklineWidth,
                        height: sparklineHeight,
                        lineWidth: thisLineWidth,
                        lineColor: thisLineColor,
                        fillColor: thisFill,
                        spotColor: thisSpotColor,
                        minSpotColor: thisMinSpotColor,
                        maxSpotColor: thisMaxSpotColor,
                        highlightSpotColor: thishighlightSpotColor,
                        highlightLineColor: thisHighlightLineColor,
                        spotRadius: thisSpotRadius,
                        chartRangeMin: thisChartMinYRange,
                        chartRangeMax: thisChartMaxYRange,
                        chartRangeMinX: thisChartMinXRange,
                        chartRangeMaxX: thisChartMaxXRange,
                        normalRangeMin: thisMinNormValue,
                        normalRangeMax: thisMaxNormValue,
                        normalRangeColor: thisNormColor,
                        drawNormalOnTop: thisDrawNormalOnTop

                    });

                    $this = null;

                }

                // PIE CHART
                if (sparklineType == 'pie') {

                    pieColors = $this.data('sparkline-piecolor') || ["#B4CAD3", "#4490B1", "#98AA56", "#da532c", "#6E9461", "#0099c6", "#990099", "#717D8A"];
                    pieWidthHeight = $this.data('sparkline-piesize') || 90;
                    pieBorderColor = $this.data('border-color') || '#45494C';
                    pieOffset = $this.data('sparkline-offset') || 0;

                    $this.sparkline('html', {
                        type: 'pie',
                        width: pieWidthHeight,
                        height: pieWidthHeight,
                        tooltipFormat: '<span style="color: {{color}}">&#9679;</span> ({{percent.1}}%)',
                        sliceColors: pieColors,
                        borderWidth: 1,
                        offset: pieOffset,
                        borderColor: pieBorderColor
                    });

                    $this = null;

                }

                // BOX PLOT
                if (sparklineType == 'box') {

                    thisBoxWidth = $this.data('sparkline-width') || 'auto';
                    thisBoxHeight = $this.data('sparkline-height') || 'auto';
                    thisBoxRaw = $this.data('sparkline-boxraw') || false;
                    thisBoxTarget = $this.data('sparkline-targetval') || 'undefined';
                    thisBoxMin = $this.data('sparkline-min') || 'undefined';
                    thisBoxMax = $this.data('sparkline-max') || 'undefined';
                    thisShowOutlier = $this.data('sparkline-showoutlier') || true;
                    thisIQR = $this.data('sparkline-outlier-iqr') || 1.5;
                    thisBoxSpotRadius = $this.data('sparkline-spotradius') || 1.5;
                    thisBoxLineColor = $this.css('color') || '#000000';
                    thisBoxFillColor = $this.data('fill-color') || '#c0d0f0';
                    thisBoxWhisColor = $this.data('sparkline-whis-color') || '#000000';
                    thisBoxOutlineColor = $this.data('sparkline-outline-color') || '#303030';
                    thisBoxOutlineFill = $this.data('sparkline-outlinefill-color') || '#f0f0f0';
                    thisBoxMedianColor = $this.data('sparkline-outlinemedian-color') || '#f00000';
                    thisBoxTargetColor = $this.data('sparkline-outlinetarget-color') || '#40a020';

                    $this.sparkline('html', {
                        type: 'box',
                        width: thisBoxWidth,
                        height: thisBoxHeight,
                        raw: thisBoxRaw,
                        target: thisBoxTarget,
                        minValue: thisBoxMin,
                        maxValue: thisBoxMax,
                        showOutliers: thisShowOutlier,
                        outlierIQR: thisIQR,
                        spotRadius: thisBoxSpotRadius,
                        boxLineColor: thisBoxLineColor,
                        boxFillColor: thisBoxFillColor,
                        whiskerColor: thisBoxWhisColor,
                        outlierLineColor: thisBoxOutlineColor,
                        outlierFillColor: thisBoxOutlineFill,
                        medianColor: thisBoxMedianColor,
                        targetColor: thisBoxTargetColor

                    });

                    $this = null;

                }

                // BULLET
                if (sparklineType == 'bullet') {

                    var thisBulletHeight = $this.data('sparkline-height') || 'auto';
                    thisBulletWidth = $this.data('sparkline-width') || 2;
                    thisBulletColor = $this.data('sparkline-bullet-color') || '#ed1c24';
                    thisBulletPerformanceColor = $this.data('sparkline-performance-color') || '#3030f0';
                    thisBulletRangeColors = $this.data('sparkline-bulletrange-color') || ["#d3dafe", "#a8b6ff", "#7f94ff"];

                    $this.sparkline('html', {

                        type: 'bullet',
                        height: thisBulletHeight,
                        targetWidth: thisBulletWidth,
                        targetColor: thisBulletColor,
                        performanceColor: thisBulletPerformanceColor,
                        rangeColors: thisBulletRangeColors

                    });

                    $this = null;

                }

                // DISCRETE
                if (sparklineType == 'discrete') {

                    thisDiscreteHeight = $this.data('sparkline-height') || 26;
                    thisDiscreteWidth = $this.data('sparkline-width') || 50;
                    thisDiscreteLineColor = $this.css('color');
                    thisDiscreteLineHeight = $this.data('sparkline-line-height') || 5;
                    thisDiscreteThrushold = $this.data('sparkline-threshold') || 'undefined';
                    thisDiscreteThrusholdColor = $this.data('sparkline-threshold-color') || '#ed1c24';

                    $this.sparkline('html', {

                        type: 'discrete',
                        width: thisDiscreteWidth,
                        height: thisDiscreteHeight,
                        lineColor: thisDiscreteLineColor,
                        lineHeight: thisDiscreteLineHeight,
                        thresholdValue: thisDiscreteThrushold,
                        thresholdColor: thisDiscreteThrusholdColor

                    });

                    $this = null;

                }

                // TRISTATE
                if (sparklineType == 'tristate') {

                    thisTristateHeight = $this.data('sparkline-height') || 26;
                    thisTristatePosBarColor = $this.data('sparkline-posbar-color') || '#60f060';
                    thisTristateNegBarColor = $this.data('sparkline-negbar-color') || '#f04040';
                    thisTristateZeroBarColor = $this.data('sparkline-zerobar-color') || '#909090';
                    thisTristateBarWidth = $this.data('sparkline-barwidth') || 5;
                    thisTristateBarSpacing = $this.data('sparkline-barspacing') || 2;
                    thisZeroAxis = $this.data('sparkline-zeroaxis') || false;

                    $this.sparkline('html', {

                        type: 'tristate',
                        height: thisTristateHeight,
                        posBarColor: thisBarColor,
                        negBarColor: thisTristateNegBarColor,
                        zeroBarColor: thisTristateZeroBarColor,
                        barWidth: thisTristateBarWidth,
                        barSpacing: thisTristateBarSpacing,
                        zeroAxis: thisZeroAxis

                    });

                    $this = null;

                }

                //COMPOSITE: BAR
                if (sparklineType == 'compositebar') {

                    sparklineHeight = $this.data('sparkline-height') || '20px';
                    sparklineWidth = $this.data('sparkline-width') || '100%';
                    sparklineBarWidth = $this.data('sparkline-barwidth') || 3;
                    thisLineWidth = $this.data('sparkline-line-width') || 1;
                    thisLineColor = $this.data('data-sparkline-linecolor') || '#ed1c24';
                    thisBarColor = $this.data('data-sparkline-barcolor') || '#333333';

                    $this.sparkline($this.data('sparkline-bar-val'), {

                        type: 'bar',
                        width: sparklineWidth,
                        height: sparklineHeight,
                        barColor: thisBarColor,
                        barWidth: sparklineBarWidth
                                //barSpacing: 5

                    });

                    $this.sparkline($this.data('sparkline-line-val'), {

                        width: sparklineWidth,
                        height: sparklineHeight,
                        lineColor: thisLineColor,
                        lineWidth: thisLineWidth,
                        composite: true,
                        fillColor: false

                    });

                    $this = null;

                }

                //COMPOSITE: LINE
                if (sparklineType == 'compositeline') {

                    sparklineHeight = $this.data('sparkline-height') || '20px';
                    sparklineWidth = $this.data('sparkline-width') || '90px';
                    sparklineValue = $this.data('sparkline-bar-val');
                    sparklineValueSpots1 = $this.data('sparkline-bar-val-spots-top') || null;
                    sparklineValueSpots2 = $this.data('sparkline-bar-val-spots-bottom') || null;
                    thisLineWidth1 = $this.data('sparkline-line-width-top') || 1;
                    thisLineWidth2 = $this.data('sparkline-line-width-bottom') || 1;
                    thisLineColor1 = $this.data('sparkline-color-top') || '#333333';
                    thisLineColor2 = $this.data('sparkline-color-bottom') || '#ed1c24';
                    thisSpotRadius1 = $this.data('sparkline-spotradius-top') || 1.5;
                    thisSpotRadius2 = $this.data('sparkline-spotradius-bottom') || thisSpotRadius1;
                    thisSpotColor = $this.data('sparkline-spot-color') || '#f08000';
                    thisMinSpotColor1 = $this.data('sparkline-minspot-color-top') || '#ed1c24';
                    thisMaxSpotColor1 = $this.data('sparkline-maxspot-color-top') || '#f08000';
                    thisMinSpotColor2 = $this.data('sparkline-minspot-color-bottom') || thisMinSpotColor1;
                    thisMaxSpotColor2 = $this.data('sparkline-maxspot-color-bottom') || thisMaxSpotColor1;
                    thishighlightSpotColor1 = $this.data('sparkline-highlightspot-color-top') || '#50f050';
                    thisHighlightLineColor1 = $this.data('sparkline-highlightline-color-top') || '#f02020';
                    thishighlightSpotColor2 = $this.data('sparkline-highlightspot-color-bottom') ||
                            thishighlightSpotColor1;
                    thisHighlightLineColor2 = $this.data('sparkline-highlightline-color-bottom') ||
                            thisHighlightLineColor1;
                    thisFillColor1 = $this.data('sparkline-fillcolor-top') || 'transparent';
                    thisFillColor2 = $this.data('sparkline-fillcolor-bottom') || 'transparent';

                    $this.sparkline(sparklineValue, {

                        type: 'line',
                        spotRadius: thisSpotRadius1,

                        spotColor: thisSpotColor,
                        minSpotColor: thisMinSpotColor1,
                        maxSpotColor: thisMaxSpotColor1,
                        highlightSpotColor: thishighlightSpotColor1,
                        highlightLineColor: thisHighlightLineColor1,

                        valueSpots: sparklineValueSpots1,

                        lineWidth: thisLineWidth1,
                        width: sparklineWidth,
                        height: sparklineHeight,
                        lineColor: thisLineColor1,
                        fillColor: thisFillColor1

                    });

                    $this.sparkline($this.data('sparkline-line-val'), {

                        type: 'line',
                        spotRadius: thisSpotRadius2,

                        spotColor: thisSpotColor,
                        minSpotColor: thisMinSpotColor2,
                        maxSpotColor: thisMaxSpotColor2,
                        highlightSpotColor: thishighlightSpotColor2,
                        highlightLineColor: thisHighlightLineColor2,

                        valueSpots: sparklineValueSpots2,

                        lineWidth: thisLineWidth2,
                        width: sparklineWidth,
                        height: sparklineHeight,
                        lineColor: thisLineColor2,
                        composite: true,
                        fillColor: thisFillColor2

                    });

                    $this = null;

                }

            });

        }// end if

        /*
         * EASY PIE CHARTS
         * DEPENDENCY: js/plugins/easy-pie-chart/jquery.easy-pie-chart.min.js
         * Usage: <div class="easy-pie-chart txt-color-orangeDark" data-pie-percent="33" data-pie-size="72" data-size="72">
         *			<span class="percent percent-sign">35</span>
         * 	  	  </div>
         */

        if ($.fn.easyPieChart) {

            $('.easy-pie-chart').each(function () {
                var $this = $(this),
                        barColor = $this.css('color') || $this.data('pie-color'),
                        trackColor = $this.data('pie-track-color') || 'rgba(0,0,0,0.04)',
                        size = parseInt($this.data('pie-size')) || 25;

                $this.easyPieChart({

                    barColor: barColor,
                    trackColor: trackColor,
                    scaleColor: false,
                    lineCap: 'butt',
                    lineWidth: parseInt(size / 8.5),
                    animate: 1500,
                    rotate: -90,
                    size: size,
                    onStep: function (from, to, percent) {
                        $(this.el).find('.percent').text(Math.round(percent));
                    }

                });

                $this = null;
            });

        } // end if

    }

    stringRreverse(str) {
        if (!$.isEmptyObject(str)) {
            var x = str.length;
            var cadena = "";
            while (x >= 0) {
                cadena = cadena + str.charAt(x);
                x--;
            }
            return cadena;
        }
    }

    dateRange(d, a, m = 2) {
        var dateFormat = "dd/mm/yy";
        var from = $(d)
                .datepicker({
                    defaultDate: "+1w",
                    changeMonth: true,
                    numberOfMonths: m
                })
                .on("change", function () {
                    to.datepicker("option", "minDate", getDate(this));
                });
        var to = $(a).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: m
        })
                .on("change", function () {
                    from.datepicker("option", "maxDate", getDate(this));
                });

        function getDate(element) {
            var date;
            try {
                date = $.datepicker.parseDate(dateFormat, element.value);
            } catch (error) {
                date = null;
            }

            return date;
        }

        $(d).mask('99/99/9999');
        $(a).mask('99/99/9999');
    }

    forceDownload(params) {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = params.path;
        a.target = '_blank';
        a.download = params.name;
        a.click();
        document.body.removeChild(a);
    }

    chekMobile() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        }
        return false;
    }

    formatNumber(n) {
        return accounting.formatNumber(n, {precision: 2, thousand: ","});
    }

    viewPDF(obj) {
        obj.form = obj.form.replace('#', '');

        $('#' + obj.form + 'pdf').remove();
        $('#' + obj.form).find(obj.element).append('<a id="' + obj.form + 'pdf" class="media" href="' + obj.file + '"></a> ');

        $('#' + obj.form + 'pdf').media({
            id: obj.form + 'print_pdf', /*ID de iframe que se creara para empotrar el PDF*/
            height: (obj.height == undefined) ? 1180 : obj.height,
            width: (obj.width == undefined) ? 900 : obj.width
        });
    }

    maxDate(el) {
        let f = new Date();
        let m = (f.getMonth() + 1);
        let d = f.getDate();

        m = (m < 10) ? `0${m}` : m;
        d = (d < 10) ? `0${d}` : d;

        $(el).attr('max', `${f.getFullYear()}-${m}-${d}`);
    }

    minDate(el) {
        let f = new Date();
        let m = (f.getMonth() + 1);
        let d = f.getDate();

        m = (m < 10) ? `0${m}` : m;
        d = (d < 10) ? `0${d}` : d;

        $(el).attr('min', `${f.getFullYear()}-${m}-${d}`);
    }

    todayDate(el) {
        let f = new Date();
        let m = (f.getMonth() + 1);
        let d = f.getDate();

        m = (m < 10) ? `0${m}` : m;
        d = (d < 10) ? `0${d}` : d;

        $(el).val(`${f.getFullYear()}-${m}-${d}`);
        return this;
    }

    addOption(lst, data, callback) {
        $(lst).append(`<option value="${data.id}">${data.descripcion}</option>`);
        $(lst).trigger("chosen:updated");
        if ($.isFunction(callback)) {
            callback();
        }
    }

    removeValidate(f) {
        $(f).removeData("validator");
        $(f).find('.chosen-container').css('border', '0px');
    }

    noSubmit(form) {
        $(form).find('input:text').keypress(function (e) {
            if (e.keyCode === 13)
                return false;
        });
    }
	
	/*
     * 
     * @param {type} inputs
     * @returns {Array}
     * Tools.arrayToString($(`#${this._idGrid}`).find('tbody').find('input:checkbox:checked'))
     */
    arrayToString(inputs) {
        return [].map.call(inputs, function (input) {
            return input.value;
        }).join(',');
    }

}

const Tools = new Tools_();
/*agregar eventos a boton cerrar de TABS de cada opcion*/
Tools.closeTabs();