<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="edit_local"></h4>
            </div>
            <div class="modal-body form-horizontal">

                <div class="form-group" style="">
                    <label class="col-lg-2 control-label tr-language" data-tr="codigo"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control" id="txt_codigo" name="txt_codigo"/> 
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="descripcion"></label>
                    <div class="col-lg-10">
                        <input type="text" class="form-control" id="txt_descripcion" name="txt_descripcion"/> 
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="ubigeo"></label>
                    <div class="col-lg-10" id="d_ubigeo">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="direccion"></label>
                    <div class="col-lg-10">
                        <textarea class="form-control" id="txt_direccion" name="txt_direccion"></textarea> 
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="col-lg-2 control-label"></label>
                    <div class="col-lg-10">
                        <span class="onoffswitch">
                            <input id="chk_activo" name="chk_activo" value="1" checked="checked" class="onoffswitch-checkbox" type="checkbox">
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
                txt_descripcion: {
                    required: true,
                    minlength: 3
                },
                txt_direccion: {
                    required: true,
                    minlength: 3
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Facturacion.LocalAx.postEdit(__PK__);
            }
        });
    </js>
</form>