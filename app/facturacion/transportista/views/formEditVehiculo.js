<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="_174"></h4>
            </div>
            <div class="modal-body form-horizontal">

                <fieldset>
                    <legend class="tr-language" data-tr="_175"></legend>
                    <div class="form-group">
                        <label class="col-lg-3 control-label tr-language" data-tr="_177"></label>
                        <div class="col-lg-3">
                            <input type="text" class="form-control" id="txt_placa" name="txt_placa"/> 
                        </div>
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend class="tr-language" data-tr="_176"></legend>
                    <div class="form-group">
                        <label class="col-lg-3 control-label tr-language" data-tr="tipo_doc"></label>
                        <div class="col-lg-8" id="d_tipo_doc">
                            <select class="chosen" id="lst_tipo_doc" name="lst_tipo_doc"/> 
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-lg-3 control-label tr-language" data-tr="num_doc"></label>
                        <div class="col-lg-8">
                            <input type="text" class="form-control" id="txt_num_doc" name="txt_num_doc"/> 
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-3 control-label tr-language" data-tr="apellidos"></label>
                        <div class="col-lg-8">
                            <input type="text" class="form-control" id="txt_apellidos" name="txt_apellidos"/> 
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-3 control-label tr-language" data-tr="nombres"></label>
                        <div class="col-lg-8">
                            <input type="text" class="form-control" id="txt_nombres" name="txt_nombres"/> 
                        </div>
                    </div>
                </fieldset>

                <div class="form-group">
                    <label class="col-lg-3 control-label"></label>
                    <div class="col-lg-8">
                        <span class="onoffswitch">
                            <input id="chk_activo" name="chk_activo" value="1" class="onoffswitch-checkbox" type="checkbox">
                            <label class="onoffswitch-label" for="chk_activo"> 
                                <span class="onoffswitch-inner tr-language-onoffswitch" data-swchon-text="e_si" data-swchoff-text="e_no"></span> 
                                <span class="onoffswitch-switch"></span> 
                            </label> 
                        </span> <span class="tr-language" data-tr="activo"></span>
                    </div>
                </div>

            </div>

            <div class="modal-footer">
                <div class="lv-modalrequired"></div>
                <span id="foot_btns"></span>
                <button type="button" class="btn btn-warning lv-close" data-dismiss="modal"><i class="fa fa-close"></i> <span class="tr-language" data-tr="btn_close"></span></button>
            </div>
        </div>
    </div>
    <js>
        $.validate({
            ignore: [],
            rules: {
                lst_tipo_doc: {
                    required: true
                },
                txt_num_doc: {
                    required: true,
                    number: true
                },
                txt_placa: {
                    required: true,
                    minlength: 3
                },
                txt_apellidos: {
                    required: true,
                    minlength: 3
                },
                txt_nombres: {
                    required: true,
                    minlength: 3
                }
            },
            errorPlacement: function (error, element) {
                    error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Facturacion.TransportistaAx.postEditVehiculo(__PK__);
            }
        });
    </js>
</form>