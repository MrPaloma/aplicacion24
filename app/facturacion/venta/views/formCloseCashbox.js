<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="_138"></h4>
            </div>
            <div class="modal-body form-horizontal">
                <div class="table-responsive">
                    <div id="d_liquidar"></div>
                </div>
                <hr class="divider"/>
                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="_018"></label>
                    <div class="col-lg-9">
                        <textarea id="txt_observaciones" name="txt_observaciones" rows="4" class="form-control"/> 
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
                txt_observaciones: {
                    required: true
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Facturacion.VentaAx.postCloseCaja(__PK__);
            }
        });
    </js>
</form>
