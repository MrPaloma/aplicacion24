<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="nuevo_egreso"></h4>
            </div>
            <div class="modal-body form-horizontal">

                <div class="form-group">
                    <div class="col-md-3">
                        
                    </div>
                    <div class="col-md-4">
                        <div class="radio">
                            <input name="rd_egreso" id="rd_egreso1" type="radio" value="servicio" checked="true" onclick="toggle(this)"/>
                            <i></i> <span class="tr-language" data-tr="servicios"></span>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="radio">
                            <input name="rd_egreso" id="rd_egreso0" type="radio" value="remuneracion" onclick="toggle(this)"/>
                            <i></i> <span class="tr-language" data-tr="remuneracion"></span>
                        </div>
                    </div>
                </div>

                <br></br>

                <div class="form-group">
                    <label class="col-md-3 control-label tr-language" data-tr="_073"></label>
                    <div class="col-md-4">
                        <div class="input">
                            <input class="form-control lv-requided" type="date" id="txt_fecha_e" name="txt_fecha_e" />
                        </div>
                    </div>
                </div>

                <div class="form-group" id="personal" style="display:none">
                    <label class="col-lg-3 control-label tr-language" data-tr="personal"></label>
                    <div class="col-lg-5" id="d_personal">
                        <select id="lst_personal" name="lst_personal"></select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-3 control-label tr-language" data-tr="_074"></label>
                    <div class="col-md-4">
                        <div class="input">
                            <input class="form-control lv-requided" maxlength="7" type="text" id="txt_importe_e" name="txt_importe_e" />
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-3 control-label tr-language" data-tr="_199"></label>
                    <div class="col-md-8">
                        <div class="textarea">
                            <textarea class="form-control lv-requided" type="text" id="txt_concepto_e" name="txt_concepto_e"></textarea>
                        </div>
                    </div>
                </div>

            </div>
            
            <div class="modal-footer">
                <div class="lv-modalrequired"></div>
                <span id="efoot_btns"></span>
                <button type="button" class="btn btn-warning lv-close" data-dismiss="modal"><i class="fa fa-close"></i> <span class="tr-language" data-tr="btn_close"></span></button>
            </div>
        </div>
    </div>
    <js>
        $.validate({
            ignore: [],
            rules: {
                txt_fecha_e: {
                    required: true
                },
                txt_importe_e: {
                    required: true
                },
                txt_concepto_e: {
                    required: true
                }
            },
            errorPlacement: function (error, element) {
                    error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Facturacion.CajaChicaAx.postEgreso(__PK__);
            }
        });

        function toggle(elemento) {
            if (elemento.value=="servicio") {
                $("#personal").hide();
            }
            if (elemento.value=="remuneracion") {
                $("#personal").show();
            }
        }
    </js>
</form>