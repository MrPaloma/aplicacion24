<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="reset_stock"></h4>
            </div>
            <div class="modal-body form-horizontal">
                
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="local"></label>
                    <div class="col-lg-10" id="d_local">
                        <select name="lst_local" id="lst_local" class="chosen">
                            <option value="" class="tr-language" data-tr="seleccionar"></option>
                        </select>
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
                lst_local: {
                    required: true
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Facturacion.ModificaStockAx.postReset(__PK__);
            }
        });
    </js>
</form>