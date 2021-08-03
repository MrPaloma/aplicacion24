<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="edit_serie"></h4>
            </div>
            <div class="modal-body form-horizontal">
                <div class="form-group">
                    <label class="col-lg-4 control-label tr-language" data-tr="tipo_comprobante"></label>
                    <div class="col-lg-8" id="d_tipo_comprobante">
                        <select id="lst_tipo_comprobante" name="lst_tipo_comprobante"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-4 control-label tr-language" data-tr="serie"></label>
                    <div class="col-lg-5">
                        <input type="text" class="form-control" id="txt_serie" name="txt_serie" maxlength="4" style="text-transform: uppercase"/> 
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-4 control-label tr-language" data-tr="numero_actual"></label>
                    <div class="col-lg-5">
                        <input type="text" class="form-control" id="txt_numero_actual" name="txt_numero_actual" maxlength="15"/> 
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-4 control-label"></label>
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
                lst_tipo_comprobante: {
                    required: true
                },
                txt_serie: {
                    required: true,
                    maxlength: 4
                },
                txt_numero_actual: {
                    required: true,
                    number: true,
                    maxlength: 15
                }
            },
            errorPlacement: function (error, element) {
                    error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Facturacion.SerieAx.postEdit(__PK__);
            }
        });
    </js>
</form>