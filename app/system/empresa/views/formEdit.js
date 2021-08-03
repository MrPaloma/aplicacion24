<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="_160"></h4>
            </div>
            <div class="modal-body form-horizontal">

                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="_161"></label>
                    <div class="col-lg-5" id="d_banco">
                        <select id="lst_banco" name="lst_banco"></select>
                    </div>
                    <span id="btn_nw_marca"></span>
                </div>
                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="_005"></label>
                    <div class="col-lg-5" id="d_tipo_moneda">
                        <select id="lst_tipo_moneda" name="lst_tipo_moneda"></select>
                    </div>
                    <span id="btn_nw_marca"></span>
                </div>
                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="_162"></label>
                    <div class="col-lg-5" id="d_tipo_cuenta_banco">
                        <select id="lst_tipo_cuenta_banco" name="lst_tipo_cuenta_banco"></select>
                    </div>
                    <span id="btn_nw_marca"></span>
                </div>
                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="_069"></label>
                    <div class="col-lg-8">
                        <input type="text" class="form-control" id="txt_cuenta" name="txt_cuenta"/> 
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="col-lg-3 control-label"></label>
                    <div class="col-lg-9">
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
                lst_banco: {
                    required: true
                },
                lst_tipo_cuenta_banco: {
                    required: true
                },
                lst_tipo_moneda: {
                    required: true
                },
                txt_cuenta: {
                    required: true,
                    minlength: 3
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.System.EmpresaAx.postEdit(__PK__);
            }
        });
    </js>
</form>