<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="_090"></h4>
            </div>
            <div class="modal-body form-horizontal">
                <p class="tr-language" data-tr="_125"></p>
                <div class="form-group">
                    <label class="col-lg-2 control-label"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control" id="txt_stock_inicial" name="txt_stock_inicial"/> 
                    </div>
                </div>
                
            </div>

            <div class="modal-footer">
                <div class="lv-modalrequired"></div>
                <span id="foot_btns_si"></span>
                <button type="button" class="btn btn-warning lv-close" data-dismiss="modal"><i class="fa fa-close"></i> <span class="tr-language" data-tr="btn_close"></span></button>
            </div>
        </div>
    </div>
    <js>
        $.validate({
            ignore: [],
            rules: {
                txt_stock_inicial: {
                    required: true,
                    number:true
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Facturacion.LocalAx.postAllProductos(__PK__);
            }
        });
    </js>
</form>