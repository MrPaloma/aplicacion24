"use strict";
$$.System.BotonTour = class BotonTour {

    main() {
        var tour = new Tour({
            steps: [{
                    element: `#${PREBTNCTXT}${this._alias}${APP_BTN.NEW}`,
                    title: APP_TOUR.boton.t_boton,
                    content: APP_TOUR.boton.c_boton,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#btnEexcel_${this._gridBoton}`,
                    title: APP_TOUR.boton.t_excel,
                    content: APP_TOUR.boton.c_excel,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                }, {
                    element: `#${this._gridBoton}_head_th_0`,
                    content: APP_TOUR.grid.c_sort,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#f1_${this._gridBoton}_nboton`,
                    content: APP_TOUR.boton.c_filter_name,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#f1_${this._gridBoton}_alias`,
                    content: APP_TOUR.boton.c_filter_alias,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#f1_${this._gridBoton}_activo`,
                    content: APP_TOUR.boton.c_filter_estado,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#th_cont_search_${this._gridBoton}_nboton span.input-group-addon`,
                    content: APP_TOUR.grid.c_more_filters,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                }, {
                    element: `#op1_${this._gridBoton}_nboton`,
                    content: APP_TOUR.grid.c_chose_1,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                }, {
                    element: `#op2_${this._gridBoton}_nboton`,
                    content: APP_TOUR.grid.c_and_or,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "right",
                    reflex: true
                }, {
                    element: `#op3_${this._gridBoton}_nboton`,
                    content: APP_TOUR.grid.c_chose_2,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "right",
                    reflex: true
                }, {
                    element: `#f2_${this._gridBoton}_nboton`,
                    content: APP_TOUR.grid.c_txt_filter_2,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#btn_filter_${this._gridBoton}_nboton`,
                    content: APP_TOUR.grid.c_btn_filter,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#btn_close_${this._gridBoton}_nboton`,
                    content: APP_TOUR.grid.c_clear_search,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#tr_${this._gridBoton}_0 div.btn-group`,
                    content: APP_TOUR.grid.c_btn_group,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#btn_axion_${this._gridBoton}_0_0_0`,
                    content: APP_TOUR.grid.c_ax_edit,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },{
                    element: `#btn_axion_${this._gridBoton}_0_0_1`,
                    content: APP_TOUR.grid.c_ax_delete,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                },{
                    element: `#${this._gridBoton}_cbLength`,
                    content: APP_TOUR.grid.c_lst_length,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "right",
                    reflex: true
                }, {
                    element: `#btnRefresh_${this._gridBoton}`,
                    content: APP_TOUR.grid.c_btn_refresh,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "right",
                    reflex: true
                }, {
                    element: `#ul_pagin_${this._gridBoton}`,
                    content: APP_TOUR.grid.c_pagin,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                }, {
                    element: `#li-${this._alias}`,
                    content: APP_TOUR.app.c_tab,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#li-${this._alias} button`,
                    content: APP_TOUR.app.c_close_tab,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }
            ],               
            onNext: (tour) => { 
                //visualizar filtros avanzados
                if (tour._current == 6 || tour._current == 7 || tour._current == 8 || tour._current == 9 || tour._current == 10 || tour._current == 11) {//activa busqueda avanzada del grid
                    //se hace este while, porque el grid ejecuta un metodo q oculta el div filterS
                    while (!$(`#cont_filter_${this._gridBoton}_nboton`).is(':visible')) {
                        $(`#cont_filter_${this._gridBoton}_nboton`).css({
                            display: 'block'
                        });
                    }
                } else {
                    $(`#cont_filter_${this._gridBoton}_nboton`).css({
                        display: 'none'
                    });
                }
                //visualiza menu de opciones por registro - las acciones 
                if(tour._current == 13 || tour._current == 14){
                    $(`#tr_${this._gridBoton}_0 div.btn-group`).addClass('open');
                }else{
                    $(`#tr_${this._gridBoton}_0 div.btn-group`).removeClass('open');
                }
            }
        });
        tour.init();
        tour.restart();
    }
    
    formNew(){
        var tour = new Tour({
            steps: [{
                    element: `#${this._alias}txt_descripcion_tagsinput`,
                    content: APP_TOUR.boton.c_descripcion,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#${this._alias}txt_alias`,
                    content: APP_TOUR.boton.c_alias,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#${this._alias}txt_icono`,
                    content: APP_TOUR.boton.c_icono,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: `#${this._alias}txt_css`,
                    content: APP_TOUR.boton.c_css,
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
};