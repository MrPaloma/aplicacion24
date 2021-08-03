<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="_215"></h4>
            </div>
            <div class="modal-body form-horizontal">

                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="_073"></label>
                    <div class="col-lg-4">
                        <input type="date" class="form-control" id="txt_fecha" name="txt_fecha"/> 
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="_216"></label>
                    <div class="col-lg-4" id="d_origen">
                        <select class="form-control" id="lst_origen" name="lst_origen"/> 
                    </div>
                
                    <label class="col-lg-2 control-label tr-language" data-tr="_217"></label>
                    <div class="col-lg-4" id="d_destino">
                        <select class="form-control chosen" id="lst_destino" name="lst_destino">   
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
                            <label class="note tr-language" data-tr=_219></label>
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
                txt_fecha: {
                    required: true,
                    minlength: 3
                },
                lst_origen: {
                    required: true
                },
                lst_destino: {
                    required: true
                },
                txt_observacion: {
                    required: true
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Facturacion.MovimientoAlmacenAx.postMovimiento(__PK__);
            }
        });
    </js>
</form>