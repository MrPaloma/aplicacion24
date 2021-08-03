<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="_046"></h4>
            </div>
            <div class="modal-body form-horizontal text-center">
                
                <label id="d_doc" class="font-xl label label-info"></label><br/><br/>
                
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="_034"></label>
                    <div class="col-lg-10">
                        <textarea class="form-control" id="txt_motivo" name="txt_motivo"></textarea> 
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
                txt_motivo: {
                    required: true,
                    minlength: 3
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Facturacion.NotaDebitoAx.postBaja(__PK__);
            }
        });
    </js>
</form>