<form class="modal inmodal fade in">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title tr-language" data-tr="_126"></h4>
            </div>
            <div class="modal-body form-horizontal">

                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="cliente"></label>
                    <div class="col-lg-7" id="d_cliente">
                        <select id="lst_cliente" name="lst_cliente" class="chosen">
                            <option value="" class="tr-language" data-tr="seleccionar"></option>   
                        </select>
                    </div>
                    <div class="col-lg-3" id="btn_nw_cliente">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="_203"></label>
                    <div class="col-lg-4" id="d_tipo_moneda">
                        <select id="lst_tipo_moneda" name="lst_tipo_moneda" class="chosen">
                            <option value="" class="tr-language" data-tr="seleccionar"></option>   
                        </select>
                    </div>
                    
                    <label class="col-lg-2 control-label tr-language" data-tr="_006"></label>
                    <div class="col-lg-4">
                        <input id="txt_tipo_cambio" name="txt_tipo_cambio" type="text" class="form-control input-xs lv-disabled" disabled="true"/>
                    </div>
                </div>
                
                
                <div id="d_responsive">
                    <table class="table table-hover smart-form">
                        <thead>
                            <tr>
                                <th class="tr-language text-center" data-tr="_012" style="width: 310px;"></th>
                                <th class="tr-language text-center" data-tr="_013" style="width: 100px;"></th>
                                <th class="tr-language text-center" data-tr="_015" style="width: 100px;"></th>
                                <th class="tr-language text-center" data-tr="_017" style="width: 100px;"></th>
                                <th class="text-center"></th>
                            </tr>
                        </thead>
                        <tbody id="tb_detail">

                        </tbody>
                    </table>
                    <div id="btn_add"> </div>
                </div>
                
                <div class="pull-right">
                    <input type="text" id="txt_total" name="txt_total" readonly="true" class="text-right" style="width: 80px"/>
                </div>
                <div class="clearfix"></div>
                <br/>
                <div class="form-group">
                    <label class="col-lg-2 control-label tr-language" data-tr="_018"></label>
                    <div class="col-lg-10">
                        <textarea id="txt_observaciones" name="txt_observaciones" rows="3" class="form-control"></textarea>
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
                lst_cliente: {
                    required: true
                }
            },
            errorPlacement: function (error, element) {
                    error.insertAfter(element.parent());
            },
            submitHandler: function () {
                    Obj.Cotizar.ClienteAx.postNew(__PK__);
            }
        });
    </js>
</form>