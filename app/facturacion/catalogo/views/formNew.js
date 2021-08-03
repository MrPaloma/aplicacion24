<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="new_bien_servicio"></h4>
            </div>
            <div class="modal-body form-horizontal">

                <div class="form-group" >
                    <label class="col-lg-3 control-label tr-language" data-tr="codigo_interno"></label>
                    <div class="col-lg-5">
                        <input type="text" class="form-control" id="txt_codinterno" name="txt_codinterno"/> 
                    </div>
                </div>
                <div class="form-group" >
                    <label class="col-lg-3 control-label tr-language" data-tr="codigo_barra"></label>
                    <div class="col-lg-5">
                        <input type="text" class="form-control" id="txt_codbarra" name="txt_codbarra"/> 
                    </div>
                </div>
                <div class="form-group" >
                    <label class="col-lg-3 control-label tr-language" data-tr="codigo_referencia"></label>
                    <div class="col-lg-5">
                        <input type="text" class="form-control" id="txt_codreferencia" name="txt_codreferencia"/> 
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="categoria"></label>
                    <div class="col-lg-5" id="d_categoria">
                        <select id="lst_categoria" name="lst_categoria"></select>
                    </div>
                    <span id="btn_nw_cat"></span>
                </div>
                
                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="_116"></label>
                    <div class="col-lg-5" id="d_marca">
                        <select id="lst_marca" name="lst_marca"></select>
                    </div>
                    <span id="btn_nw_marca"></span>
                </div>

                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="local"></label>
                    <div class="col-lg-5" id="d_local">
                        <select id="lst_local" name="lst_local"></select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="_112"></label>
                    <div class="col-lg-5">
                        <input type="text" class="form-control" id="txt_stock" name="txt_stock"/> 
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="descripcion"></label>
                    <div class="col-lg-9">
                        <input type="text" class="form-control" id="txt_descripcion" name="txt_descripcion"/> 
                    </div>
                </div>
                
                <div class="form-group" >
                    <label class="col-lg-3 control-label tr-language" data-tr="u_medida"></label>
                    <div class="col-lg-5" id="d_umedida">
                        <select id="lst_umedida" name="lst_umedida"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="tipo"></label>
                    <div class="col-lg-5">
                        <select id="lst_tipo" name="lst_tipo" class="chosen">
                            <option value=""></option>
                            <option value="B" class="tr-language" data-tr="bien" selected></option>
                            <option value="S" class="tr-language" data-tr="servicio"></option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="_058"></label>
                    <div class="col-lg-5">
                        <input type="text" class="form-control" id="txt_precio_venta" name="txt_precio_venta"/> 
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="ubicacion"></label>
                    <div class="col-lg-5">
                        <input type="text" class="form-control" id="txt_ubicacion" name="txt_ubicacion"/> 
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="caja"></label>
                    <div class="col-lg-5">
                        <input type="text" class="form-control" id="txt_nxcaja" name="txt_nxcaja"/> 
                    </div>
                </div>
                <div style="display:none" class="form-group">
                    <label class="col-lg-3 control-label tr-language" data-tr="_058"></label>
                    <div class="col-lg-5">
                        <input type="text" class="form-control" id="txt_precio_compra" name="txt_precio_compra"/> 
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-3 control-label"></label>
                    <div class="col-lg-9">
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
                    required: true
                },
                lst_categoria: {
                    required: true
                },
                lst_umedida: {
                    required: true
                },
                lst_tipo: {
                    required: true
                },
                txt_precio_venta: {
                    required: true,
                    number: true
                },
                lst_marca: {
                    required: true
                },
                txt_nxcaja: {
                    number: true
                }
            },
            errorPlacement: function (error, element) {
                    error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Facturacion.CatalogoAx.postNew(__PK__);
            }
        });
    </js>
</form>