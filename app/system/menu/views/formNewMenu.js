<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="new_menu"></h4>
            </div>
            <div class="modal-body form-horizontal init-tooltip">

                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="descripcion"></label>
                    <div class="col-lg-10">
                        <input type="text" class="form-control tagsinput tr-language-ph" id="txt_descripcion" name="txt_descripcion" data-trph="press_enter"/> 
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="icono"></label>
                    <div class="col-lg-5">
                        <input type="text" class="form-control" id="txt_icono" name="txt_icono"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="alias"></label>
                    <div class="col-lg-5">
                        <input type="text" class="form-control tr-language-title" id="txt_alias" name="txt_alias" data-toggle="tooltip" data-placement="right" data-trtitle="t_alias" maxlength="10"/>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="ajax"></label>
                    <div class="col-lg-7">
                        <input type="text" class="form-control tr-language-title" id="txt_ajax" name="txt_ajax" data-toggle="tooltip" data-placement="right" data-trtitle="t_ajax"/> 
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
        txt_alias: {
                maxlength: 10
        }
        },
        errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
        },
        submitHandler: function () {
                Obj.System.MenuAx.postNewMenu(__PK__);
        }
        });
    </js>
</form>
