<div>
    <form>

        <section class="col col-12">
            <div style="background: #fff;border:1px #00a300 solid">
                <div class="alert alert-success no-margin fade in">
                    <i class="fa-fw fa fa-info"></i> <span class="tr-language" data-tr="_002"></span>               
                </div>


                <div class="row padding-10">
                    <div class="smart-form">
                        <section class="col col-2" style="margin-bottom: 0px">
                            <label class="label tr-language" data-tr="serie"></label>
                            <label class="select" id="d_serie_nc"> 
                                <select name="lst_nc_cerie" id="lst_nc_cerie" class="chosen">
                                    <option value="" class="tr-language" data-tr="seleccionar"></option>
                                </select>
                            </label>
                        </section>
                        <section class="col col-1" style="margin-bottom: 0px">
                            <label class="label tr-language" data-tr="num_doc"></label>
                            <label class="input"> 
                                <input name="txt_num_doc_nc" id="txt_num_doc_nc" type="text" class="input-xs lv-disabled" readonly="true"/>
                            </label>
                        </section>
                        <section class="col col-4" style="margin-bottom: 0px">
                            <label class="label tr-language" data-tr="_041"></label>
                            <label class="select" id="d_tipo_nota_credito"> 
                                <select name="lst_tipo_nota_credito" id="lst_tipo_nota_credito"/>
                            </label>
                        </section>
                        <section class="col col-2" style="margin-bottom: 0px">
                            <label class="label tr-language" data-tr="_042"></label>
                            <label class="select" id="d_serie"> 
                                <select name="lst_serie" id="lst_serie" class="chosen">
                                    <option value="" class="tr-language" data-tr="seleccionar"></option>
                                </select>
                            </label>
                        </section>
                        <section class="col col-2" style="margin-bottom: 0px">
                            <label class="label tr-language" data-tr="_043"></label>
                            <label class="input"> 
                                <input name="txt_num_doc" id="txt_num_doc" type="text" class="input-xs"/>
                            </label>
                        </section>
                    </div>
                    <section class="col col-1" style="margin-bottom: 0px">
                        <label class="label">&nbsp;</label>
                        <div id="btn_ver"></div>
                    </section>
                </div>

                <div class="row padding-10">
                    <div class="smart-form">
                        <section class="col col-10" style="margin-bottom: 0px">
                            <label class="label tr-language" data-tr="_034"></label>
                            <label class="input"> 
                                <input name="txt_motivo" id="txt_motivo" type="text" class="input-xs"/>
                            </label>
                        </section>
                    </div>
                </div>

                <div class="smart-form">
                    <footer>
                        <div id="btn_dale"></div>
                    </footer>
                </div>

            </div>
            <div class="clearfix"></div>
        </section>

        <fieldset><legend></legend></fieldset>

        <section class="col col-12">
            <div class="smart-form" style="background: #fff;border:1px #00a300 solid">
                <div class="alert alert-success no-margin fade in">
                    <i class="fa-fw fa fa-id-card-o"></i> <span class="tr-language" data-tr="_036"></span>               
                </div>

                <div class="row padding-10">
                    <section class="col col-5" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="razon_social"></label>
                        <label class="input"> 
                            <input name="txt_razon_social" id="txt_razon_social" type="text" class="input-xs lv-disabled" disabled="true"/>
                        </label>
                    </section>
                    <section class="col col-3" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="_037"></label>
                        <label class="input"> 
                            <input name="txt_ruc" id="txt_ruc" type="text" class="input-xs lv-disabled" disabled="true"/>
                        </label>
                    </section>
                    <section class="col col-3" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="_038"></label>
                        <label class="input"> 
                            <input name="txt_fecha_emision" id="txt_fecha_emision" type="text" class="input-xs lv-disabled" disabled="true"/>
                        </label>
                    </section>
                </div>
                <div class="row padding-10">
                    <section class="col col-8" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="direccion"></label>
                        <label class="input"> 
                            <input name="txt_direccion" id="txt_direccion" type="text" class="input-xs lv-disabled" disabled="true"/>
                        </label>
                    </section>
                </div>
                <div class="row padding-10">
                    <section class="col col-5" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="_039"></label>
                        <label class="input"> 
                            <input name="txt_tipo_doc_afectado" id="txt_tipo_doc_afectado" type="text" class="input-xs lv-disabled" disabled="true"/>
                        </label>
                    </section>
                    <section class="col col-3" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="_040"></label>
                        <label class="input"> 
                            <input name="txt_num_doc_afectado" id="txt_num_doc_afectado" type="text" class="input-xs lv-disabled" disabled="true"/>
                        </label>
                    </section>
                    <section class="col col-3" style="margin-bottom: 0px">
                        <label class="label tr-language" data-tr="_005"></label>
                        <label class="input"> 
                            <input name="txt_tipo_moneda" id="txt_tipo_moneda" type="text" class="input-xs lv-disabled" disabled="true"/>
                        </label>
                    </section>
                </div>
            </div>    
            <br/>
        </section>

        <section class="col col-12">
            <div class="smart-form" style="background: #fff;border:1px #00a300 solid">
                <div class="alert alert-success no-margin fade in">
                    <i class="fa-fw fa fa-file-text"></i> <span class="tr-language" data-tr="_011"></span>               
                </div>

                <div id="d_responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th class="text-center" style="width: 1px;">
                                    <section >
                                        <label class="checkbox">
                                            <input id="chk_all_enviar" name="chk_all_enviar" type="checkbox">
                                            <i></i>
                                        </label>
                                    </section>
                                </th>
                                <th class="tr-language text-center" data-tr="_012" style="width: 410px;"></th>
                                <th class="tr-language text-center" data-tr="u_medida" style="width: 60px;"></th>
                                <th class="tr-language text-center" data-tr="_013" style="width: 100px;"></th>
                                <th class="tr-language text-center" data-tr="_035" style="width: 100px;"></th>
                                <th class="tr-language text-center" data-tr="_015" style="width: 100px;"></th>
                                <th class="tr-language text-center" data-tr="_016" style="width: 100px;"></th>
                                <th class="tr-language text-center" data-tr="_017" style="width: 100px;"></th>
                            </tr>
                        </thead>
                        <tbody id="tb_detail">

                        </tbody>
                    </table>
                </div>
            </div>    
            <br/>
        </section>

        <fieldset><legend></legend></fieldset>


        <div class="smart-form">
            <div class="row">
                <section class="col col-8">

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
            lst_nc_cerie: {
                required: true
            },
            lst_tipo_nota_credito: {
                required: true
            },
            lst_serie: {
                required: true
            },
            txt_num_doc: {
                required: true,
                number: true
            },
            txt_motivo:{
                required: true
            }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                Obj.Facturacion.NotaCreditoAx.postNotaCredito(__PK__);
            }
            });
        </js>

    </form>
</div>

