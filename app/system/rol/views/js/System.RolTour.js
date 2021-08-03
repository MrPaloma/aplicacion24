"use strict";
$$.System.RolTour = class RolTour {

    main() {
        var tour = new Tour({
            steps: [
                {
                    element: `#${PREBTNCTXT}${this._alias}${APP_BTN.NEW}`,
                    content: APP_TOUR.rol.c_rol,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#btnEexcel_${this._gridRol}`,
                    content: APP_TOUR.rol.c_excel,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                },  {
                    element: `#tr_${this._gridRol}_0 div.btn-group`,
                    content: APP_TOUR.grid.c_btn_group,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },{
                    element: `#btn_axion_${this._gridRol}_0_0_0`,
                    content: APP_TOUR.rol.c_ax_preview,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },{
                    element: `#btn_axion_${this._gridRol}_0_0_1`,
                    content: APP_TOUR.rol.c_ax_access,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#btn_axion_${this._gridRol}_0_0_2`,
                    content: APP_TOUR.rol.c_ax_copy,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },{
                    element: `#btn_axion_${this._gridRol}_0_0_3`,
                    content: APP_TOUR.grid.c_ax_edit,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },{
                    element: `#btn_axion_${this._gridRol}_0_0_4`,
                    content: APP_TOUR.grid.c_ax_delete,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#btnRefresh_${this._gridRol}`,
                    content: APP_TOUR.grid.c_btn_refresh,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "right",
                    reflex: true
                }
            ],               
            onNext: (tour) => {  
                //visualiza menu de opciones por registro - las acciones 
                if(tour._current == 2 || tour._current == 3 || tour._current == 4 || tour._current == 5 || tour._current == 6){
                    $(`#tr_${this._gridRol}_0 div.btn-group`).addClass('open');
                }else{
                    $(`#tr_${this._gridRol}_0 div.btn-group`).removeClass('open');
                }
            }
        });
        tour.init();
        tour.restart();
    }
    
    formNew(){
        var tour = new Tour({
            steps: [
                {
                    element: `#${this._alias}txt_descripcion_tagsinput`,
                    content: APP_TOUR.rol.c_descripcion,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }
            ]
        });
        tour.init();
        tour.restart();
    }
    
    formView(){
        var tour = new Tour({
            steps: [
                {
                    element: `#${this._alias}d_access span:eq(0)`,
                    content: APP_TOUR.rol.c_view_access,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }
            ]
        });
        tour.init();
        tour.restart();
    }
    
    formAccesos(){
        var li = $(`#${this._alias}d_tree`).find('ul').find('li:eq(0) > span');
        var tour = new Tour({
            steps: [
                {
                    element: `#${this._alias}d_tree span:eq(0)`,
                    content: APP_TOUR.rol.c_access,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },{
                    element: `#${this._alias}d_tree ul li:eq(0) ul[role="group"]:eq(0) li:eq(0) span label i`,
                    content: APP_TOUR.rol.c_permiso,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },{
                    element: `#${this._alias}d_tree ul li:eq(0) ul[role="group"]:eq(0) li:eq(0) span.${this._alias}d_btn_conf button`,
                    content: APP_TOUR.rol.c_ver_botones,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },{
                    element: `#${this._alias}t_input_search`,
                    content: APP_TOUR.rol.c_search_boton,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },{
                    element: `#${this._alias}noAss`,
                    content: APP_TOUR.rol.c_no_asignado,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                },{
                    element: `#${this._alias}siAss`,
                    content: APP_TOUR.rol.c_si_asignado,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                },{
                    element: `#${this._alias}element_no`,
                    content: APP_TOUR.rol.c_add_element,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },{
                    element: `#${this._alias}element_si`,
                    content: APP_TOUR.rol.c_remove_element,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }
            ],               
            onNext: (tour) => { 
                //desplegar - open
                if(tour._current == 0 && li.data('open') != 1){
                    li.data('open',1);//para manejar q solo se de click para abrir una vez
                    li.click();
                }
                //simular ejecucion de boton CONFIGURAR
                if(tour._current == 2){
                    $(`#${this._alias}1d_evts`).html(`<i class="fa fa-search" style="position: absolute;top: -25px;left: 5px;"></i><input id="${this._alias}t_input_search" class="form-control" style="width:194px;margin-top:-35px;padding-left:20px;" placeholder="${APP_ETIQUET.search_sensitive}" type="text"><ul class="si-access ui-sortable" id="${this._alias}siAss"><li data-k="1" class="move-cursor ui-sortable-handle"><span>Grabar</span></li><li data-k="2" class="move-cursor ui-sortable-handle"><span id="${this._alias}element_si">Editar</span></li><li data-k="3" class="move-cursor ui-sortable-handle"><span>Nuevo</span></li><li data-k="4" class="move-cursor ui-sortable-handle"><span>Eliminar</span></li><li data-k="5" class="move-cursor ui-sortable-handle"><span>Actualizar</span></li></ul><ul class="no-access ui-sortable" id="${this._alias}noAss"><li data-k="6" class="move-cursor ui-sortable-handle"><span>Imprimir</span></li><li data-k="7" class="move-cursor ui-sortable-handle"><span id="${this._alias}element_no">Vista Previa</span></li><li data-k="8" class="move-cursor ui-sortable-handle"><span>Duplicar</span></li><li data-k="10" class="move-cursor ui-sortable-handle"><span>Accesos</span></li><li data-k="11" class="move-cursor ui-sortable-handle"><span>Configurar</span></li></ul>`);
                }                
            },
            onEnd:(tour) => {
                //desplegar - close
                if(tour._current > 0){
                    if(li.data('open') == 1){
                        li.click();
                        li.data('open',0);
                    }
                    $(`#${this._alias}1d_evts`).html('');//qutar simulacion de boton CONFIGURAR
                }
            }
        });
        tour.init();
        tour.restart();
    }
    
};