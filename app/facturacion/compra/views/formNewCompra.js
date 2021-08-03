<div>
    
    <form>

        <section class="col col-12">
            <div class="smart-form" style="background: #fff;border:1px #00a300 solid">
                <div class="alert alert-success no-margin fade in">
                    <i class="fa-fw fa fa-info"></i> <span class="tr-language" data-tr="_002"></span>               
                </div>


                <div class="row padding-10">
                    <section class="col col-2" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="tipo_doc"></label>
                        <label class="select" id="d_tipo_doc"> 
                            <select name="lst_tipo_doc" id="lst_tipo_doc"/>
                        </label>
                    </section>
                    <section class="col col-2" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="serie"></label>
                        <label class="input"> 
                            <input name="txt_serie" id="txt_serie" type="text" class="input-xs"/>
                        </label>
                    </section>
                    <section class="col col-2" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="num_doc"></label>
                        <label class="input"> 
                            <input name="txt_num_doc" id="txt_num_doc" type="text" class="input-xs"/>
                        </label>
                    </section>
                    <section class="col col-2" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="_078"></label>
                        <label class="input"> 
                            <input name="txt_fecha_compra" id="txt_fecha_compra" type="date" class="input-xs"/>
                        </label>
                    </section>
                    <section class="col col-2" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="local"></label>
                        <label class="select" id="d_local"> 
                            <select name="lst_local" id="lst_local" class="chosen">
                                <option value="" class="tr-language" data-tr="seleccionar"></option>
                            </select>
                        </label>
                    </section>
                    <section class="col col-2" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="_005"></label>
                        <label class="select" id="d_tipo_moneda"> 
                            <select name="lst_tipo_moneda" id="lst_tipo_moneda" class="chosen">
                                <option value="" class="tr-language" data-tr="seleccionar"></option>
                            </select>
                        </label>
                    </section>
                </div>

                <div class="row padding-10">
                    <section class="col col-4" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="_080"></label>
                        <label class="select" id="d_proveedor"> 
                            <select name="lst_proveedor" id="lst_proveedor"/>
                        </label>
                    </section>
                    <section class="col col-2" style="margin-bottom: 0px">
                        <label class="label">&nbsp;</label>
                        <label class="input" id="btn_nw_prov"> 
                        </label>
                    </section>
                    <section class="col col-2" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="_010"></label>
                        <label class="input"> 
                            <input name="txt_guia_remitente" id="txt_guia_remitente" type="text" class="input-xs"/>
                        </label>
                    </section>
                    <section class="col col-2" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="_007"></label>
                        <label class="input"> 
                            <input name="txt_orden_compra" id="txt_orden_compra" type="text" class="input-xs"/>
                        </label>
                    </section>
                    <section class="col col-1" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="_006"></label>
                        <label class="input"> 
                            <input name="txt_tipo_cambio" id="txt_tipo_cambio" type="text" class="input-xs lv-disabled" disabled="true"/>
                        </label>
                    </section>
                    <section class="col col-1" style="margin-bottom: 0px">
                        <label class="label">&nbsp;</label>
                        <label class="input" id="btn_change"></label>
                    </section>
                </div>
                <div class="row padding-10">
                        
                    <section class="col col-3" style="margin-bottom: 0px">
                        <label class="labe">&nbsp;</label>
                        <div class="inline-group">
                            <label class="radio">
                                <input name="rd_pagado" id="rd_pagado1" type="radio" value="1" checked="true"/>
                                <i></i> <span class="tr-language" data-tr="_061"></span>
                            </label>
                            <label class="radio">
                                <input name="rd_pagado" id="rd_pagado0" type="radio" value="0"/>
                                <i></i> <span class="tr-language" data-tr="_062"></span>
                            </label>
                        </div>
                    </section>
                    
                    <section class="col col-3" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="_079"></label>
                        <label class="select" id="d_forma_pago"> 
                            <select name="lst_forma_pago" id="lst_forma_pago"/>
                        </label>
                    </section>
                    
                    <section class="col col-2" style="margin-bottom: 0px">
                        <label class="label">&nbsp;</label>
                        <div id="btn_nw_prod"> 
                        </div>
                    </section>
                    
                </div>

            </div>
            <div class="clearfix"></div>
        </section>

        <fieldset><legend></legend></fieldset>
        <div id="d_tipo_igv" class="hide"></div>

        <section class="col col-12">
            <div class="smart-form" style="background: #fff;border:1px #00a300 solid">
                <div class="alert alert-success no-margin fade in">
                    <i class="fa-fw fa fa-file-text"></i> <span class="tr-language" data-tr="_011"></span>               
                </div>

                <div id="d_responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th class="tr-language text-center" data-tr="_012" style="width: 310px;"></th>
                                <th class="tr-language text-center" data-tr="u_medida" style="width: 60px;"></th>
                                <th class="tr-language text-center" data-tr="_101" style="width: 100px;"></th>
                                <th class="tr-language text-center" data-tr="_013" style="width: 100px;"></th>
                                <th class="tr-language text-center" data-tr="_015" style="width: 100px;"></th>
                                <th class="tr-language text-center" data-tr="_016" style="width: 100px;"></th>
                                <th class="tr-language text-center" data-tr="_017" style="width: 100px;"></th>
                                <th class="text-center" style="width: 1px;"></th>
                            </tr>
                        </thead>
                        <tbody id="tb_detail">
                        
                        </tbody>
                    </table>
                </div>
            </div>    
            <div id="modales">
            </div>
            <div id="tablas-compras">
            </div>
            <br/>
            <div id="btn_add"> </div> 
        </section>

        <fieldset><legend></legend></fieldset>


        <div class="smart-form">
            <div class="row">
                <section class="col col-8">

                    <div style="background: #fff;border:1px #00a300 solid">
                        <div class="alert alert-success no-margin fade in">
                            <i class="fa-fw fa fa-file"></i> <span class="tr-language" data-tr="_018"></span>               
                        </div>

                        <section style="margin-bottom: 0px" class="padding-10">
                            <label class="textarea"> 
                                <textarea name="txt_observaciones" id="txt_observaciones" ></textarea>
                            </label>
                        </section>

                    </div>    


                </section>


                <section class="col col-4">

                    <div class="form-horizontal" style="background: #fff;border:1px #00a300 solid">
                        <div class="alert alert-success no-margin fade in">
                            <i class="fa-fw fa fa-money"></i> <span class="tr-language" data-tr="_019"></span>               
                        </div>

                        <div class="form-group" style="padding: 20px">

                            <label class="col-md-4 control-label tr-language text-left" data-tr="_022"></label>
                            <div class="col-md-8">
                                <input class="form-control input-xs text-right" id="txt_gravada" name="txt_gravada" type="text" style="width: 90%;margin-bottom: 10px;" readonly="true"/>
                            </div>

                            <label class="col-md-4 control-label tr-language text-left" data-tr="_023"></label>
                            <div class="col-md-8">
                                <input class="form-control input-xs text-right" id="txt_igv" name="txt_igv" type="text" style="width: 90%;margin-bottom: 10px;" readonly="true"/>
                            </div>

                            <fieldset><legend></legend></fieldset>
                            <label class="col-md-4 control-label tr-language text-left" data-tr="_017"></label>
                            <div class="col-md-8">
                                <input class="form-control input-xs text-right" id="txt_total" name="txt_total" type="text" style="width: 90%;" readonly="true"/>
                            </div>
                        </div>

                        <div class="clearfix"></div>
                        

                    </div>    

                </section>
            </div>
        </div>
        <div class="smart-form">
            <footer>
                <div class="lv-requided-require"></div>
                <div id="tool_btn"></div>
            </footer>
        </div>
        <js>
            $.validate({
                ignore: [],
                rules: {
                    lst_tipo_doc: {
                        required: true
                    },
                    lst_local: {
                        required: true
                    },
                    txt_serie: {
                        required: true
                    },
                    txt_num_doc: {
                        required: true,
                        number: true
                    },
                    txt_fecha_compra:{
                        required: true
                    },
                    lst_proveedor:{
                        required: true
                    }
                },
                errorPlacement: function (error, element) {
                    error.insertAfter(element.parent());
                },
                submitHandler: function () {
                    Obj.Facturacion.CompraAx.postCompra(__PK__);
                }
            });
        </js>

    </form>
</div>

