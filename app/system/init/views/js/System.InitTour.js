"use strict";
$$.System.InitTour = class InitTour {

    home() {
        var tour = new Tour({
            steps: [{
                    element: "#activity",
                    title: APP_TOUR.app.t_msn_app,
                    content: APP_TOUR.app.c_msn_app_cont,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: "#ulLang",
                    title: APP_TOUR.app.t_idioma,
                    content: APP_TOUR.app.c_idioma,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: "#ulRol",
                    title: APP_TOUR.app.t_rol,
                    content: APP_TOUR.app.c_rol,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: "#lkFullScreen",
                    title: APP_TOUR.app.t_full_sreen,
                    content: APP_TOUR.app.c_full_sreen,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: "#search-fld",
                    title: APP_TOUR.app.t_short_menu,
                    content: APP_TOUR.app.c_short_menu,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "bottom",
                    reflex: true
                }, {
                    element: "#logout",
                    title: APP_TOUR.app.t_out,
                    content: APP_TOUR.app.c_out,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                }, {
                    element: "#hide-menu",
                    title: APP_TOUR.app.t_dynamic_option,
                    content: APP_TOUR.app.c_dynamic_option,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                }, {
                    element: "#demo-setting",
                    title: APP_TOUR.app.t_template,
                    content: APP_TOUR.app.c_template,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "left",
                    reflex: true
                }, {
                    element: "#void_menu",
                    title: APP_TOUR.app.t_options,
                    content: APP_TOUR.app.c_options,
                    backdrop: true,
                    backdropPadding: 5,
                    placement: "right",
                    reflex: true
                }
//                , {
//                    element: "#show-shortcut",
//                    title: APP_TOUR.app.t_access,
//                    content: APP_TOUR.app.c_access,
//                    backdrop: true,
//                    backdropPadding: 5,
//                    placement: "right",
//                    reflex: true
//                }
//                , {
//                    element: "#shortcut",
//                    title: APP_TOUR.app.t_access,
//                    content: APP_TOUR.app.c_access_direct,
//                    backdrop: true,
//                    backdropPadding: 5,
//                    placement: "bottom",
//                    reflex: true
//                }
            ],
            onNext: function (tour) {
                if (tour._current == 9) {
                    $('#shortcut').css({display: 'block'});
                }
            },
            onEnd: function (tour) {
                $('#shortcut').css({display: 'none'});
            }
        });
        tour.init();
        tour.restart();
    }
};