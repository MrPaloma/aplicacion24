"use strict";
var httpR;
class Resource {

    constructor() {

        /*
         * Se detecta si objeto esta siendo instanciado fuera de Obj
         * @type Error
         */
        var err = new Error();
        var e, N1, N2, N3, N4, jsAx, AxN3;

        if ($.browser.firefox()) { /*para firefox*/
            e = err.stack.split('\n');
            N1 = e[0].split('@');
            N2 = e[1].split('@');
            N3 = e[2].split('@');
            jsAx = N3[0];
        }
        if ($.browser.mozilla()) { /*para chrome*/
            e = err.stack.split('at ');
            N1 = e[0].split(' (');
            N2 = e[1].split(' (');
            N3 = e[2].split(' (');
            N4 = e[3].split(' (');
            jsAx = N4[0];
        }
        AxN3 = jsAx.substring((jsAx.length - 2), jsAx.length); /*debe ser Ax*/

        try {
            if (AxN3 != 'Ax') {
                console.log('Acceso denegao a objeto desde: ' + jsAx);
                throw "exit";
            }
//            console.log(N1[0]);
//            console.log(N2[0]);
//            console.log(N3[0]);
//            console.log(N4[0]);
        } catch (e) {

        }
        /*
         * fin de validacion
         */

        this._sData = [];

        /*
         * gener parametros para enviar via AJAX
         */
        this._serialize = () => {
            let data = '';

            this._sData.forEach(elem => {
                data += elem.name + '=' + elem.value + '&';
            });
            data = data.substring(0, data.length - 1);

            return data;
        };

        /*reset formulario*/
        this._clear = (form) => {
            if ($(form)[0] !== undefined) {
                $(form)[0].reset();
            }
            $('.chosen').val("").trigger("chosen:updated");
        };

        /*activa img loading*/
        this._processIn = () => $('#process-general').fadeIn();

        /*
         * desactiva img loading
         */
        this._processOut = () => $('#process-general').fadeOut();

        this._btnString = [];

        /*
         * desabilita boton y coloca imagen cargando
         */
        this._processObjetoIn = (el) => {
            /*guardo texto de boton*/
            this._btnString.push({
                objeto: el,
                xhtml: $(el).html()
            });
            $(el).html('<i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i>');
            $(el).attr('disabled', true);
        };

        /*
         * activa boton y devuelve su icono y texto
         */
        this._processObjetoOut = (el) => {
            let txt = '', xobj = '';
            for (let i in this._btnString) {
                if (el === this._btnString[i].objeto) {
                    xobj = this._btnString[i].objeto;
                    txt = this._btnString[i].xhtml;
                    $(xobj).html(txt);
                    $(xobj).attr('disabled', false);
                    break;
                }
            }
        };
        /*
         * Decodifica htmentities
         * @param {type} data
         * @returns {Ajax_._decodeHtmlEntities.ndata|JSON.parse.j|Array|Object|String}
         */
        this._decodeHtmlEntities = (data) => {
            let ndata = '';

            if ($.isArray(data)) {//es json [{a:b, c:d},{e: f, h: i}]
                ndata = '[';
                $.each(data, function (i, v) {
                    ndata += '{';
                    $.each(v, function (ii, vv) {
                        ndata += `"${ii}": "${Tools.htmlEntities(vv)}",`;
                    });
                    ndata = ndata.substr(0, ndata.length - 1);
                    ndata += '},';
                });
                ndata = ndata.substr(0, ndata.length - 1);
                ndata += ']';
            } else {// es bojeto {a:b, c:d}
                ndata = '{';
                $.each(data, function (i, v) {
                    ndata += `"${i}": "${Tools.htmlEntities(v)}",`;
                });
                ndata = ndata.substr(0, ndata.length - 1);
                ndata += '}';
            }
            ndata = JSON.parse(ndata);

            return ndata;
        };

        this._addFormData = (form) => {
            let formData = new FormData();

            if ($.isArray(form)) {
                $.each(form, (a, b) => {
                    $(b).find('input,select,textarea').each(function (i, v) {
                        if (v.type.toLowerCase() == 'file') {
                            if (!$.isEmptyObject($(v).val())) {
                                formData.append(v.id, $(v)[0].files[0]);
                                
                            }
                        } else {
                            if (v.type.toLowerCase() == 'text' || v.type.toLowerCase() == 'select-one' || v.type.toLowerCase() == 'select-multiple' || v.type.toLowerCase() == 'hidden' || v.type.toLowerCase() == 'password' || v.type.toLowerCase() == 'textarea') {
                                if (!$.isEmptyObject($(v).val())) {
                                    formData.append(v.id, $(v).val());
                                }
                            } else if (v.type.toLowerCase() == 'checkbox') {
                                if ($(v).is(':checked')) {
                                    formData.append(v.id, $(v).val());
                                }
                            } else if (v.type.toLowerCase() == 'radio') {
                                if ($(v).is(':checked')) {
                                    formData.append(v.name, $(v).val());
                                }
                            }
                        }
                    });
                });
            } else {
                $(form).find('input,select,textarea').each(function (i, v) {
                    if (v.type.toLowerCase() == 'file') {
                        if (!$.isEmptyObject($(v).val())) {
                            formData.append(v.id, $(v)[0].files[0]);
                        }
                    } else {
                        if (v.type.toLowerCase() == 'text' || v.type.toLowerCase() == 'select-one' || v.type.toLowerCase() == 'select-multiple' || v.type.toLowerCase() == 'hidden' || v.type.toLowerCase() == 'password' || v.type.toLowerCase() == 'textarea') {
                            if (!$.isEmptyObject($(v).val())) {
                                formData.append(v.id, $(v).val());
                            }
                        } else if (v.type.toLowerCase() == 'checkbox') {
                            if ($(v).is(':checked')) {
                                formData.append(v.id, $(v).val());
                            }
                        } else if (v.type.toLowerCase() == 'radio') {
                            if ($(v).is(':checked')) {
                                formData.append(v.name, $(v).val());
                            }
                        }
                    }
                });
            }

            //agregar _sData
            this._sData.forEach(elem => {
                formData.append(elem.name, elem.value);
            });

            return formData;
        };
    }

    send(obj) {
        let myRand = parseInt(Math.random() * 999999999999999);
        let typeData = (obj.dataType !== undefined) ? obj.dataType : 'json';
        let contextt = (obj.context === undefined) ? '[context] no definido' : obj.context;
        let dataAlias = (contextt._alias !== undefined) ? contextt._alias : null; // se toma el alias del OBJETO XxxxAx.js
        let controller = (contextt._controller !== undefined) ? contextt._controller : null; // se toma el alias del OBJETO XxxxAx.js
        let modal = (obj.dataType !== undefined) ? obj.modal : false;
        let formData = (obj.formData !== undefined) ? obj.formData : false; /*activa el envio de imagenes*/

        /*
         * Se detecta de donde se ejecuta el objeto
         * @type Error
         */
        let err = new Error();
        let e, xUrl, posRoot, posDS, file, methodSV, posA, root;

        if ($.browser.firefox()) { /*para firefox*/
            e = err.stack.split('\n');
            xUrl = e[1]; // InitAx/appTheme@http://localhost/LIVIAN_V0.2.10.17/app/system/init/views/js/System.InitAx.js?631958891091485:117:9
            //buscar posicion de @
            posA = xUrl.indexOf('@');
            //buscando posicion de /, desde la posicion de @ hacia atras
            posDS = xUrl.lastIndexOf('/', posA) + 1;
            methodSV = xUrl.substring(posDS, posA).replace('_', '').replace('this', '').replace('.', '');//en caso tenga _ y this. se reemplazara por vacio

        }
        if ($.browser.mozilla()) { /*para chrome*/
            e = err.stack.split('at ');
            xUrl = e[2]; //InitAx.postLogin (http://localhost/LIVIAN_V0.2.10.17/app/system/init/views/js/System.InitAx.js?555015882731103:33:14)
            //buscar posicion de .
            posA = xUrl.indexOf('.') + 1;
            //buscando posicion de (
            posDS = xUrl.indexOf('(');
            methodSV = xUrl.substring(posDS, posA).replace('_', '').replace('this', '').replace('.', '').replace(' ', '');//en caso tenga espacio, _, . y this. se reemplazara por vacio;
        }

        posRoot = xUrl.lastIndexOf(controller.split(':')[0]); // posicion de obj.root
        //buscar primer / a partir de la posicion de posRoot
        posDS = xUrl.lastIndexOf('/', (posRoot - 2)) + 1;
        //obteniendo namespace(carpeta) del controlador, vista y demas
        file = xUrl.substr(posDS, (posRoot - posDS));

        if (typeData == 'json') {
            root = `${file}${controller}${methodSV}`;    /*root para controlador*/
            root = root.replace(':', '/');
        } else {
            root = `app/${file}${controller.split(':')[0]}/views/${methodSV}.js?v=${myRand}`;   /*root para view js*/
        }
        /*
         * fin de validacion
         */
        
        this._sData.push({name: '_keypassw', value: myRand});
        this._sData.push({name: '_ipLocal', value: localStorage.getItem('app_idLocal')});
        this._sData.push({name: '_qn', value: Tools.en(obj.token)});
        this._sData.push({name: '_alias', value: dataAlias});

        /*se activa loading en boton*/
        if (obj.element !== undefined) {
            this._processObjetoIn(obj.element);
        }
        /*se activa gif loading*/
        if (obj.gifProcess !== undefined && obj.gifProcess !== false) {
            this._processIn();
        }


        let token = (obj.token !== undefined) ? obj.token : null;
        let clear = (obj.clear === undefined) ? true : obj.clear;
        let encrypt = (obj.encrypt === undefined) ? false : obj.encrypt;
        let abort = (obj.abort === undefined) ? false : obj.abort;

        let form = (obj.form !== undefined) ? obj.form : false;
        let decodeHtmlEntities = (obj.decodeHtmlEntities !== undefined) ? obj.decodeHtmlEntities : false;

        if (token != _sys_sg) {
            console.log('Acceso restringido.');
            return false;
        }

        if (obj.flag !== undefined) {
            this._sData.push({name: '_flag', value: obj.flag});
        }
        if (obj.serverParams !== undefined) {
            obj.serverParams(this._sData, obj);
        }

        if ($.isEmptyObject(dataAlias)) {
            Tools.notify().error({
                content: '[_alias] no definido en objeto XxxAx.js, debe especificar el alias _alias.'
            });
            return false;
        }

        if ($.isEmptyObject(root)) {
            Tools.notify().error({
                content: '[_controller] no definido en objeto XxxAx.js, debe especificar el _controller.'
            });
            return false;
        }


        let datos_ = '';
        /*obteniendo etiquetas para alertas de los filters.php*/
        if (form) {
            let ev = null;
            if ($.isArray(form)) {
                $.each(form, (a, b) => {
                    $(b).find('.tr-language-ok').each((i, v) => {
                        ev = `lang_${localStorage.getItem('app_lang')}.etiquet[ '${$(v).data('tr')}' ]`;
                        this._sData.push({name: $(v).data('tr'), value: eval(ev)});
                    });

                    datos_ += '&' + $(b).serialize(encrypt);
                });
            } else {
                $(form).find('.tr-language-ok').each((i, v) => {
                    ev = `lang_${localStorage.getItem('app_lang')}.etiquet[ '${$(v).data('tr')}' ]`;
                    this._sData.push({name: $(v).data('tr'), value: eval(ev)});
                });

                datos_ += '&' + $(form).serialize(encrypt);
            }
        }

        /*serializacion de datos*/
        let datos = this._serialize() + datos_;


        let ddat = null;

        //verificar si se envia imagenes
        if (formData) {
            //se cambia la imformacion de datos por formData
            datos = this._addFormData(form);
        }
        this._sData = []; // se limpia despues de formData, para que se puedan agregar los items de this._sData

        return $.ajax({
            type: "POST",
            data: datos,
            url: root,
            dataType: typeData,
            cache: false,
            context: this,
            processData: (formData) ? false : true, // en caso de enviar imagenes es falso
            contentType: (formData) ? false : 'application/x-www-form-urlencoded; charset=UTF-8', // en caso de enviar imagenes es falso
            beforeSend: function (data2) {
                if (obj.abort) {
                    if (httpR) {
                        httpR.abort();
                    }
                    httpR = data2;
                }
            },
            success: function (data) {
                let er = 1; /*parametro para detectar si SERVER devuelve ERROR*/

                /*validar error del SP*/
                if (typeData === 'json' && data.length > 0 || data.error !== undefined) {
                    /*no es un array, servidor devuelve cadena, y el unico q devuelve cadena es el ERROR del SP*/
                    if (data instanceof Object === false || data.error !== undefined) {
                        let msn = data;
                        if (data.error !== undefined) {
                            msn = data.error;
                        }
                        Tools.notify().error({
                            content: msn
                        });
                        er = 0;
                        data = {ok_error: 'error'};
                    }
                }

                /*verificar si data se decodificara htmlentities*/
                data = (decodeHtmlEntities) ? this._decodeHtmlEntities(data) : data;

                /*oculta img cargando de boton*/
                if (obj.element !== undefined) {
                    this._processObjetoOut(obj.element);//respuesta de servidor finalizada
                }

                if ((obj.success !== undefined && $.isFunction(obj.success)) || (obj.response !== undefined && $.isFunction(obj.response))) {//si existe callback
                    /*
                     * data :: respuesta del servidor
                     * contextt :: viene en send (obj)
                     */
                    if (typeData == 'html' || typeData == 'text') {
                        //el metodo js sera el id y name del form...colocar id a <js>, $. x methodSV
                        data = data.replace('<form', `<form id="${dataAlias}${methodSV}" name="${dataAlias}${methodSV}"`)
                                .replace('<js>', `<js id="js_${methodSV}">`)
                                .replace('$.', `$('#${methodSV}').`);
                    }
                    if (obj.success != undefined) {
                        obj.success({data: data, context: contextt});
                    }

                    if (obj.response != undefined) {
                        obj.response(data);
                    }

                }

                /*se optiene parametro DUPLICADO*/
                let d = (data.length > 1) ? data[0].duplicado : data.duplicado;

                /*limpia el formulario*/
                if (clear && parseInt(d) === 0 && er && obj.form !== undefined) {
                    this._clear(form);
                }
                /*se desactiva gif loading*/
                if (obj.gifProcess !== undefined && obj.gifProcess !== false) {
                    this._processOut();//respuesta de servidor finalizada
                }

                ddat = data;

            },
            complete: function (response, b) {
                if (typeData == 'html' || typeData == 'text') {
                    Tools.traslation();
                    Tools.addAliasData(ddat, dataAlias, methodSV);
                }

                if (obj.final !== undefined && $.isFunction(obj.final)) {//si existe callback final
                    obj.final({data: ddat, context: contextt});
                }

                if (obj.finally !== undefined && $.isFunction(obj.finally)) {//si existe callback final
                    obj.finally(ddat);
                }

                if (modal) {
                    if (typeData == 'html' || typeData == 'text') {
                        /*se activa el modal*/
                        $(`#${dataAlias}${methodSV}`).modal('show');
                    }
                }
                //se verifica si se envia la informacion mediante formData
                if (formData) {
                    //se ejecuta complete(), se envia respuesta comvertida en json
                    obj.complete(JSON.parse(response.responseText));
                }
                /*
                 * se activa los tooltip que esten dentro de elemento con css:  .init-tooltip
                 */
                if ($(`#${dataAlias}${methodSV}`).find('.init-tooltip').length) {
                    $(`#${dataAlias}${methodSV}`).find('.init-tooltip').tooltip({
                        selector: "[data-toggle=tooltip]",
                        container: "body"
                    });
                }

                if ($(`#${dataAlias}${methodSV}`).find('.chosen').length) {
                    $(`#${dataAlias}${methodSV}`).find('.chosen').chosen();
                }

                if ($('.tabs').length) {
                    $(".tabs").tabs();
                }

                if ($(`#${dataAlias}${methodSV}`).find('.date').length) {
                    $(`#${dataAlias}${methodSV}`).find('.date').datepicker();
                    $(`#${dataAlias}${methodSV}`).find('.date').mask('99/99/9999');
                }
            }
        });

    }

    /*
     * Deshabilita boton 
     */
    disableBtn(element) {
        this._processObjetoIn(element);
    }
    /*
     * habilita boton 
     */
    activeBtn(element) {
        this._processObjetoOut(element);
    }

    loadingServer() {
        this._processIn();
    }

    finishServer() {
        this._processOut();
    }

}