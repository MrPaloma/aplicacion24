"use strict";
class Exe_ {

    constructor() {

        this._includesArray = {};           /*almacena todos los script incluidos*/
        this._entorno = 'D';                /*D: DESARROLLO, P:PRODUCCION*/
        this._callback = null;              /*almacena el callback de cada require*/
        this._runMain = true;               /*determina si un JS ejecuta evento main()*/
        this._nameapace = {};               /*almacena todos los namespaces creados*/
        this._alias = null;
        this._breadcrumb = null;
        this._title = null;

        this._createScript = (requires, str) => {
            let callback = this._callback;
            let runMain = this._runMain;
            let scriptId = requires.replace(/\//g, "");             /*se quita los / de la ruta*/
            scriptId = scriptId.replace(/\./g, "");                  /*se quita los . de la ruta*/
            scriptId = scriptId.replace(/\:/g, "");                  /*se quita los : de la ruta*/
            scriptId = scriptId.replace(/\!/g, "");                  /*se quita los ! de la ruta*/
            let myRand = parseInt(Math.random() * 999999999999999);
            let body = document.getElementsByTagName('body')[0];

            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = `script_${scriptId}`;
//            script.async = 'async';
            script.src = requires + '.js?v=' + myRand;
            script.onload = () => {
                /*onload se ejecuta despues, por ello this._callback ingresaba como NULL*/
                if ($.isFunction(callback)) {
//                    setTimeout(() => {
                    callback();
                    var tv = scriptId.replace('app', 'on->');
                    tv = tv.replace('views', '');
                    tv = tv.replace(/js/g, '');
                    console.log(tv);
//                    }, 500);   /*se retarda 200 ms, porque se estaba ejecutando antes que cargue el js*/

                }
                /*str es NULL, cuando require: 'string/string'*/
                if (!$.isEmptyObject(str)) {
                    this._addClass(str, runMain);
                }
            };

            body.appendChild(script);
            /*elimina script incluido del HTML*/
            $(`#script_${scriptId}`).remove();
        };

        this._addClass = (str, runMain) => {
            let obj = str.split('::')[1];
            let nms = obj.split('.')[0];

            if (!this._nameapace[nms]) { /*EN DESARROLLO DEBE PERMITIR VOLER A CARGAR LOS JS---EN PRODUCCION SE DEBE ESCOMENTAR EL if{}*/
                this._nameapace[nms] = true; /*se registra como incluido*/
                eval(`Obj.${nms} = {}`);
            }

            /*runMain = false, estos archivos solo se cargan al DOM, no se agregan a Obj porque ya son heredados*/
            if (runMain) {
                /*agrego clase como prototipo a Obj*/
                let sc = ``;
                sc += `Obj.${obj} = new $$.${obj}();`;
                if (runMain != 'create') {
                    sc += `Obj.${obj}.main('${_tk_}');`;
                }
                eval(sc);
            }
            //los TOUR si se crean los objetos
            if (/Tour/.test(obj)) {
                eval(`Obj.${obj} = new $$.${obj}();`);
            }

        };
        /*
         * Crea la ruta del js a incluir
         */
        this._root = (namespace, file) => {

            let opcion = file.split('::');
            let module = opcion[0]; /*carpeta dentro de /views/ */
            let js = opcion[1];

            let r = `app/${namespace}/${module}/views/js/${js}`; /*ruta del Dom.js a incluir*/
            
            return r;
        };

        this._prepareString = (e) => {
            let i;
            for (i in e) {
                this._requireString(this._root(i, e[i]), e[i]);
            }
        };

        this._requireArray = (requires) => {
            if ($.isArray(requires)) {
                /*array: [{system: 'init::Init'}]*/
                requires.forEach((e, i) => {
                    this._prepareString(e);
                });
            } else {
                /*array: {system: 'init::System.Init'}*/
                this._prepareString(requires);
            }
        };

        this._esxtraxtFile = function (requires) {
            let pos = requires.lastIndexOf('/') + 1;
            return requires.substr(pos);
        };

        /*
         * incluye un script desde una cadena:: config/lang/js/lang_ES
         */
        this._requireString = (requires, str = null) => {
            if (this._entorno == 'P') {
                /*se verifica si ya se incluyo*/
                if (!this._includesArray[requires]) { /*EN DESARROLLO DEBE PERMITIR VOLER A CARGAR LOS JS---EN PRODUCCION SE DEBE ESCOMENTAR EL if{}*/
                    this._includesArray[requires] = true; /*se registra como incluido*/
                    this._createScript(requires, str);   /*se crea el include*/
                    this._callback = null;
                } else {
                    let file = this._esxtraxtFile(requires);
                    /*despues que carga el ajax se debe ejecutar el DOM*/
                    if (file.search('Ax') > 0 && this._runMain != 'create') {
                        eval(`
                        Obj.${file}.main('${_tk_}');
                        $('html,body').animate({ scrollTop: 0}, 0);
                        //console.log('${file}.pirncipal');
                    `);
                    }
                    /*si archvo ya existe, se verifica si tiene callback y se ejecuta*/
                    if ($.isFunction(this._callback)) {
                        this._callback();
                    }
                }
            }
            if (this._entorno == 'D') {
                this._includesArray[requires] = true; /*se registra como incluido*/
                this._createScript(requires, str);   /*se crea el include*/
                this._callback = null;
        }
        };

    }

    getAlias() {
        return this._alias;
    }

    getRoot() {
        return this._breadcrumb;
    }

    getTitle() {
        return this._title;
    }

    /*
     * obj = {require: x, callback: x, run: true/false}
     */
    require(obj) {
        this._callback = ($.isFunction(obj.callback)) ? obj.callback : null;
        this._runMain = (obj.run !== undefined) ? obj.run : true;
        //cuando un objeto es requerido dentro de otro objeto, se envia el alias para poder cargarlo. Ejemplo: $$.System.InitAx linea 3
        if (obj.alias !== undefined) {
            this._alias = obj.alias;
        }

        switch (typeof obj.require) {
            case 'string':
                /*
                 * se incluye js desde un string
                 * Exe.require({require: 'app/system/views/init/js/InitMenu'});
                 */
                this._requireString(obj.require);
                break;
            case 'object':
                /*
                 * se incluye js desde un array
                 * varios js:
                 *  Exe.require({require: [{system: 'init::InitA'},{system: 'init::InitB'},{menu: 'init::InitC'}]})
                 * un js:
                 *  Exe.require({require: {system: 'init::System.InitAx'}})
                 */
                this._requireArray(obj.require);
                break;
        }

        return this;
    }

    /*
     * Solo se ejecuta en los menus
     * Exe.load('system','menu',this);
     * Se cargan tres js obligatorios 
     * Tour     -->> aqui esta la configuracion para la ayuda al usuario mediante un TOUR
     * Rsc      -->> carga todos los metodos js para la manipulacion del DOM
     * Ax       -->> contiene todos los ajax que conectan con el server
     */
    load(nm, op, tthis, run) {
        this._alias = $.trim($(tthis).data('a')) || tthis.alias;
        this._breadcrumb = $.trim($(tthis).data('root')) || tthis.root;
        this._title = $.trim($(tthis).find('.text-menu-sm').html()) || tthis.title;
        eval(`
            Exe.require({require: {${nm}: '${op}::${Tools.ucfirst(nm)}.${Tools.ucfirst(op)}Tour'}, run: false, callback: () => {
                    Exe.require({require: {${nm}: '${op}::${Tools.ucfirst(nm)}.${Tools.ucfirst(op)}Rsc'}, run: false, callback: () => {
                            Exe.require({require: {${nm}: '${op}::${Tools.ucfirst(nm)}.${Tools.ucfirst(op)}Ax'},run: ${run}});
                        }
                    });
                }
            });
        `);
    }
    /*
     * Solo se ejecuta en el atajo de menu
     */
    loadMenu(nm, op, alias, root, title) {
        let obj = {
            alias: alias,
            root: root,
            title: title
        };
        this.load(nm, op, obj, true);
    }

    include(obj) {
        let t = 500;
        $.each(obj, (i, v) => {
            setTimeout(() => {
                this._alias = v.alias;
                eval(`
                Exe.require({require: {${v.nm}: '${v.ob}::${Tools.ucfirst(v.nm)}.${Tools.ucfirst(v.ob)}Tour'}, run: false, callback: () => {
                        Exe.require({require: {${v.nm}: '${v.ob}::${Tools.ucfirst(v.nm)}.${Tools.ucfirst(v.ob)}Rsc'}, run: false, callback: () => {
                                Exe.require({require: {${v.nm}: '${v.ob}::${Tools.ucfirst(v.nm)}.${Tools.ucfirst(v.ob)}Ax'},run: 'create'});
                            }
                        });
                    }
                });
            `);
            }, t);
            t += 500;
        });

    }

}
const Exe = new Exe_();