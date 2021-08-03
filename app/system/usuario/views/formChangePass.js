<form class="modal inmodal fade in">
    <div class="modal-dialog" style="width: 450px">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="_205"></h4>
            </div>
            <div class="modal-body form-horizontal">
                <div class="alert alert-success"><span class="tr-language" data-tr="_206"></span> <b id="d_name"></b></div>
                
                <div class="form-group">
                    <label class="col-lg-4 control-label tr-language" data-tr="_207"></label>
                    <div class="col-lg-8">
                        <input type="text" class="form-control" id="txt_contrasenia" name="txt_contrasenia" /> 
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
                txt_contrasenia: {
                    required: true,
                    minlength: 6
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.System.UsuarioAx.postNewPass(__PK__);
            }
        });
    </js>
    
</form>