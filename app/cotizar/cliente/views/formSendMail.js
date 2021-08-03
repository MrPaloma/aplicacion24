<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="_129"></h4>
            </div>
            <div class="modal-body form-horizontal">

                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="email"></label>
                    <div class="col-lg-9">
                        <input type="text" class="form-control" id="txt_email" name="txt_email"/> 
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
                txt_email: {
                    required: true,
                    email: true
                }
            },
            errorPlacement: function (error, element) {
                    error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Cotizar.ClienteAx.postEmail(__PK__);
            }
        });
    </js>
</form>