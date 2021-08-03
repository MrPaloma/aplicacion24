<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="nuevo_ingreso"></h4>
            </div>
            <div class="modal-body form-horizontal">

                <div class="form-group">
                    <label class="col-md-3 control-label tr-language" data-tr="_073"></label>
                    <div class="col-md-4">
                        <div class="input">
                            <input class="form-control lv-requided" type="date" id="txt_fecha_in" name="txt_fecha_in"/>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label tr-language" data-tr="_074"></label>
                    <div class="col-md-4">
                        <div class="input">
                            <input class="form-control lv-requided" maxlength="7" type="text" id="txt_importe_in" name="txt_importe_in"/>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label tr-language" data-tr="_199"></label>
                    <div class="col-md-8">
                        <div class="textarea">
                            <textarea class="form-control lv-requided" type="text" id="txt_concepto_in" name="txt_concepto_in"></textarea>
                        </div>
                        <div class="obligar"></div>
                    </div>
                </div>
            
            </div>
            <div class="modal-footer">
                <div class="lv-modalrequired"></div>
                <span id="ifoot_btns"></span>
                <button type="button" class="btn btn-warning lv-close" data-dismiss="modal"><i class="fa fa-close"></i> <span class="tr-language" data-tr="btn_close"></span></button>
            </div>
        </div>
    </div>
    <js>
        $.validate({
            ignore: [],
            rules: {
                txt_fecha_in: {
                    required: true
                },
                txt_importe_in: {
                    required: true
                },
                txt_concepto_in: {
                    required: true
                }
            },
            errorPlacement: function (error, element) {
                    error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Facturacion.CajaChicaAx.postIngreso(__PK__);
            }
        });

    </js>
</form>