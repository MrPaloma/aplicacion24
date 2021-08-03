<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="_218"></h4>
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
                
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="_018"></label>
                    <div class="col-lg-10">
                        <textarea class="form-control" id="txt_observacion" name="txt_observacion"/> 
                    </div>
                </div>
                
                <fieldset>
                    <legend class="tr-language" data-tr="_057"></legend>
                    <div class="form-group">
                        <label class="col-lg-2 control-label tr-language" data-tr="producto"></label>
                        <div class="col-lg-10">
                            <input type="text" class="form-control tr-language-ph" data-trph="search_sensitive" id="txt_producto" name="txt_producto"/> 
                        </div>
                    </div>
                    
                    <div id="d_productos" class="alert alert-success">
                        
                    </div>
                </fieldset>
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
                },
                txt_observacion: {
                    required: false
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Facturacion.ModificaStockAx.postModicacion(__PK__);
            }
        });
    </js>
</form>