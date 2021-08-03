<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="_135"></h4>
            </div>
            <div class="modal-body form-horizontal">
                
                <div class="form-group">
                    <label class="col-lg-5 control-label tr-language" data-tr="_136"></label>
                    <div class="col-lg-6" id="d_cajas">
                        <select class="chosen" id="lst_caja" name="lst_caja"></select> 
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-5 control-label tr-language" data-tr="_074"></label>
                    <div class="col-lg-4">
                        <input class="form-control" id="txt_importe" name="txt_importe"/> 
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
                lst_caja: {
                    required: true
                },
                txt_importe: {
                    required: true,
                    number: true
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Facturacion.VentaAx.postOpenCaja(__PK__);
            }
        });
    </js>
</form>