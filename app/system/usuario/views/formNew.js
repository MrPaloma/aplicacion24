<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="new_usuario"></h4>
            </div>
            <div class="modal-body form-horizontal">

                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="apellidos"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control tr-language-ph" data-trph="apellido_paterno" id="txt_apellido_paterno" name="txt_apellido_paterno" /> 
                    </div>
                    <div class="col-lg-4">
                        <input type="text" class="form-control tr-language-ph" data-trph="apellido_materno" id="txt_apellido_materno" name="txt_apellido_materno" /> 
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="nombres"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control tr-language-ph" data-trph="primer_nombre" id="txt_primer_nombre" name="txt_primer_nombre" /> 
                    </div>
                    <div class="col-lg-4">
                        <input type="text" class="form-control tr-language-ph" data-trph="segundo_nombre" id="txt_segundo_nombre" name="txt_segundo_nombre" /> 
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="local"></label>
                    <div class="col-lg-4" id="d_local">
                        <select class="chosen" id="lst_local" name="lst_local" /> 
                    </div>
                    <div class="col-lg-3" id="btn_new_lk">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="celular"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control" id="txt_celular" name="txt_celular" /> 
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="email"></label>
                    <div class="col-lg-8">
                        <input type="text" class="form-control" id="txt_email" name="txt_email" />
                        <div class="note tr-language" data-tr="note_email"></div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="pass"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control" id="txt_contrasenia" name="txt_contrasenia" /> 
                    </div>
                </div>
                <div class="form-group _roles">
                    <label class="col-lg-3 control-label tr-language" data-tr="roles"></label>
                    <div id="d_rol" class="col-lg-9 smart-form">
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="activo"></label>
                    <div class="col-lg-9">
                        <span class="onoffswitch">
                            <input id="chk_activo" name="chk_activo" value="1" checked="checked" class="onoffswitch-checkbox" type="checkbox">
                            <label class="onoffswitch-label" for="chk_activo"> 
                                <span class="onoffswitch-inner tr-language-onoffswitch" data-swchon-text="e_si" data-swchoff-text="e_no"></span> 
                                <span class="onoffswitch-switch"></span> 
                            </label> 
                        </span> 
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
                txt_apellido_paterno: {
                    required: true,
                    minlength: 3
                },
                txt_primer_nombre: {
                    required: true,
                    minlength: 3
                },
                txt_email: {
                    required: true,
                    email: true,
                    minlength: 3
                },
                lst_local:{
                    required: true
                },
                txt_contrasenia:{
                    required: true,
                    minlength: 6
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.System.UsuarioAx.postNew(__PK__);
            }
        });
    </js>
</form>