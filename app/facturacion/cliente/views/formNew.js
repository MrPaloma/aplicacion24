<form class="modal inmodal fade in">
    <div class="modal-dialog" style="width: 90%">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="new_cliente"></h4>
            </div>
            <div class="modal-body form-horizontal">

                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="tipo_doc"></label>
                    <div class="col-lg-4" id="d_tipo_doc">
                        <select class="chosen" id="lst_tipo_doc" name="lst_tipo_doc"/> 
                    </div>
                    <label class="col-lg-2 control-label tr-language" data-tr="num_doc"></label>
                    <div class="col-lg-2">
                        <input type="text" class="form-control" id="txt_num_doc" name="txt_num_doc"/> 
                    </div>
                    
                    <div class="col-lg-2" id="btn_extd">
                        <input type="button" value="Extraer Datos" class="btn btn-default" id="boton_extd"/> 
                    </div>
                </div>
              
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="razon_social"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control" id="txt_razon_social" name="txt_razon_social"/> 
                    </div>
                    
                    <label class="col-lg-2 control-label tr-language" data-tr="nombre_comercial"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control" id="txt_nombre_comercial" name="txt_nombre_comercial"/> 
                    </div>
                </div>
               
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="celular"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control" id="txt_celular" name="txt_celular"/> 
                    </div>
                    
                    <label class="col-lg-2 control-label tr-language" data-tr="fijo"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control" id="txt_fijo" name="txt_fijo"/> 
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="direccion_fiscal"></label>
                    <div class="col-lg-10">
                        <input type="text" class="form-control" id="txt_direccion_fiscal" name="txt_direccion_fiscal"/> 
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="direccion_1"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control" id="txt_direccion_1" name="txt_direccion_1"/> 
                    </div>
                    
                    <label class="col-lg-2 control-label tr-language" data-tr="direccion_2"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control" id="txt_direccion_2" name="txt_direccion_2"/> 
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="email_princial"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control" id="txt_email_princial" name="txt_email_princial"/>
                        <div class="note tr-language" data-tr="_196"></div>
                    </div>
               
                    <label class="col-lg-2 control-label tr-language" data-tr="ubigeo"></label>
                    <div class="col-lg-4" id="d_ubigeo">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="email_1"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control" id="txt_email_1" name="txt_email_1"/> 
                    </div>
                    
                    <label class="col-lg-2 control-label tr-language" data-tr="email_2"></label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control" id="txt_email_2" name="txt_email_2"/> 
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
                lst_tipo_doc: {
                    required: true
                },
                txt_num_doc: {
                    required: true,
                    number: true
                },
                txt_razon_social: {
                    required: true,
                    minlength: 3
                },
                txt_email_princial: {
                    email: true
                },
                txt_email_1: {
                    email: true
                },
                txt_email_2: {
                    email: true
                },
                txt_celular: {
                    number: true
                },
                txt_fijo: {
                    number: true
                }
            },
            errorPlacement: function (error, element) {
                    error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Facturacion.ClienteAx.postNew(__PK__);
            }
        });
        
        let extraerDataDNI = async function (doc){

            try {
                const rePost = await fetch(`https://dniruc.apisperu.com/api/v1/dni/${doc}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im9ybGFuZG8ubmNhbGx1cGVAZ21haWwuY29tIn0.2fbHSjhs-WRSmFGEUYsP9t-6hdJWUn9OWOWkGxUAMaA`)
                const data = await rePost.json()
                if (data.success === false) {
                    Tools.notify().smallMsn({
                        content: data.message
                    });
                } else {
                    let razon_social = data.nombres + " " + data.apellidoPaterno + " " + data.apellidoMaterno;
                    $(`#txt_razon_social`).val(razon_social);
                }
            } catch (error) {
                Tools.notify().smallMsn({
                    content: error
                });
            } 

        }

        let extraerDataRUC = async function (doc){

            try {
                const rePost = await fetch(`https://dniruc.apisperu.com/api/v1/ruc/${doc}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im9ybGFuZG8ubmNhbGx1cGVAZ21haWwuY29tIn0.2fbHSjhs-WRSmFGEUYsP9t-6hdJWUn9OWOWkGxUAMaA`)
                const data = await rePost.json()
                if (data.success === false) {
                    Tools.notify().smallMsn({
                        content: data.message
                    });
                } else {
                    $(`#txt_razon_social`).val(data.razonSocial);
                    $(`#txt_direccion_fiscal`).val(data.direccion);
                }
            } catch (error) {
                Tools.notify().smallMsn({
                    content: error
                });
            } 

        }

        function extraerDahtos() {
            let tdoc = $(`#lst_tipo_doc`).val();
            let doc = $(`#txt_num_doc`);

            if (tdoc.length == 0) {
                Tools.notify().smallMsn({
                    content: APP_MSN._036
                });
                return false;
            }

            if (doc.val().length == 0) {
                Tools.notify().smallMsn({
                    content: APP_MSN._037
                });
                doc.focus();
                return false;
            }
            switch (parseInt(tdoc)) {
                case 1:
                    if (!$.isNumeric(doc.val())) {
                        Tools.notify().smallMsn({
                            content: APP_MSN._041
                        });
                        doc.focus();
                        return false;
                    }
                    if (doc.val().length != 8) {
                        Tools.notify().smallMsn({
                            content: APP_MSN._038
                        });
                        doc.focus();
                        return false;
                    }

                    $(`#txt_razon_social`).val("");
                    $(`#txt_direccion_fiscal`).val("");

                    extraerDataDNI(doc.val());
                    break;
                case 6:
                    if (!$.isNumeric(doc.val())) {
                        Tools.notify().smallMsn({
                            content: APP_MSN._041
                        });
                        doc.focus();
                        return false;
                    }
                    if (doc.val().length != 11) {
                        Tools.notify().smallMsn({
                            content: APP_MSN._039
                        });
                        doc.focus();
                        return false;
                    }
                    
                    $(`#txt_razon_social`).val("");
                    $(`#txt_direccion_fiscal`).val("");

                    extraerDataRUC(doc.val());
                    break;
                default:
                    Tools.notify().smallMsn({
                        content: APP_MSN._040
                    });
                    break;
            }
        }


        $('#boton_extd').click(function () {
            extraerDahtos();
        })
    </js>
</form>