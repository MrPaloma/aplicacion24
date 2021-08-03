<div>
    <form>

        <section class="col col-12">
            <div  style="background: #fff;border:1px #00a300 solid">
                <div class="alert alert-success no-margin fade in">
                    <i class="fa-fw fa fa-info"></i> <span class="tr-language" data-tr="_091"></span>               
                </div>


                <div class="row padding-10">
                    <div class="smart-form">
                        <section class="col col-4" style="margin-bottom: 0px">
                            <label class="label tr-language" data-tr="local"></label>
                            <label class="select" id="d_local"> 
                                <select name="lst_local" id="lst_local"/>
                            </label>
                        </section>
                        <section class="col col-6" style="margin-bottom: 0px">
                            <label class="label tr-language" data-tr="producto"></label>
                            <label class="select" id="d_producto"> 
                                <select name="lst_producto" id="lst_producto" class="chosen">
                                    <option value="" class="tr-language" data-tr="seleccionar"></option>
                                </select>
                            </label>
                        </section>
                    </div>
                    <section class="col col-2" style="margin-bottom: 0px">
                        <label class="label">&nbsp;</label>
                        <div id="btn_search"></div>
                    </section>
                </div>


            </div>
            <div class="clearfix"></div>
        </section>




        <div class="widget-body">


            <hr class="simple">

            <ul id="myTab1" class="nav nav-tabs bordered">
                <li class="active">
                    <a href="#s1" data-toggle="tab" class="tr-language" data-tr="_092"></a>
                </li>
                <li class="hide">
                    <a href="#s2" data-toggle="tab" class="tr-language" data-tr="_093"></a>
                </li>
            </ul>

            <div id="myTabContent1" class="tab-content padding-10">
                <div class="tab-pane fade in active" id="s1">


                    <section class="col col-12 form-horizontal">


                        <div class="form-group">
                            <label class="col-md-2 control-label tr-language" data-tr="_094"></label>
                            <div class="col-md-1">
                                <input class="form-control input-xs lv-disabled" type="text" disabled="true" id="txt_id_u" name="txt_id_u">
                            </div>

                        </div>

                        <div class="form-group">
                            <label class="col-md-2 control-label tr-language" data-tr="descripcion"></label>
                            <div class="col-md-6">
                                <input class="form-control input-xs lv-disabled" type="text" disabled="true" id="txt_decripcion_u" name="txt_decripcion_u">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label tr-language" data-tr="_095"></label>
                            <div class="col-md-4">
                                <input class="form-control input-xs lv-disabled" type="text" disabled="true" id="txt_umedida_u" name="txt_umedida_u">
                            </div>
                        </div>


                        <div class="d_responsive">
                            <table class="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th class="tr-language text-center" data-tr="_073" style="width: 120px;vertical-align: middle"></th>
                                        <th class="tr-language text-center" data-tr="tipo_doc" style="width: 150px;vertical-align: middle"></th>
                                        <th class="tr-language text-center" data-tr="num_doc" style="width: 100px;vertical-align: middle"></th>
                                        <th class="tr-language text-center" data-tr="_097" style="width: 300px;"></th>
                                        <th class="tr-language text-center" data-tr="_098" style="width: 300px;"></th>
                                        <th class="tr-language text-center" data-tr="_068" style="width: 300px;vertical-align: middle"></th>
                                    </tr>
                                </thead>
                                <tbody id="tb_unidad">
                                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>
                                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>
                                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>
                                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>
                                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="clearfix"></div>
                    </section>

                </div>




                <div class="tab-pane fade" id="s2">
                    <section class="col col-12 form-horizontal">


                        <div class="form-group">
                            <label class="col-md-2 control-label tr-language" data-tr="_094"></label>
                            <div class="col-md-4">
                                <input class="form-control input-xs lv-disabled" type="text" disabled="true" id="txt_id_v" name="txt_id_v" style="width: 20%">
                            </div>

                            <label class="col-md-2 control-label hide"><span class="tr-language" data-tr="_058"></span> S/</label>
                            <div class="col-md-4 hide">
                                <input class="form-control input-xs lv-disabled" type="text" disabled="true" id="txt_preciocompra_v" name="txt_preciocompra_v" style="width: 40%">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-md-2 hide control-label tr-language" data-tr="descripcion"></label>
                            <div class="col-md-4 hide">
                                <input class="form-control input-xs lv-disabled" type="text" disabled="true" id="txt_decripcion_v" name="txt_decripcion_v">
                            </div>

                            <label class="col-md-2 control-label"><span class="tr-language" data-tr="precio_venta"></span> S/</label>
                            <div class="col-md-4">
                                <input class="form-control input-xs lv-disabled" type="text" disabled="true" id="txt_precioventa_v" name="txt_precioventa_v" style="width: 40%">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label tr-language" data-tr="_095"></label>
                            <div class="col-md-4">
                                <input class="form-control input-xs lv-disabled" type="text" disabled="true" id="txt_umedida_v" name="txt_umedida_v">
                            </div>

                            <label class="col-md-2 control-label tr-language" data-tr="_056"></label>
                            <div class="col-md-4">
                                <input class="form-control input-xs lv-disabled" type="text" disabled="true" id="txt_inventario_v" name="txt_inventario_v" style="width: 40%">
                            </div>
                        </div>

                        <div class="d_responsive">
                            <table class="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th class="tr-language text-center" data-tr="_073" style="width: 120px;vertical-align: middle" rowspan="2"></th>
                                        <th class="tr-language text-center" data-tr="tipo_doc" style="width: 150px;vertical-align: middle" rowspan="2"></th>
                                        <th class="tr-language text-center" data-tr="num_doc" style="width: 100px;vertical-align: middle" rowspan="2"></th>
                                        <th class="tr-language text-center" data-tr="_097" style="width: 300px;" colspan="3"></th>
                                        <th class="tr-language text-center" data-tr="_098" style="width: 300px;" colspan="3"></th>
                                        <th class="tr-language text-center" data-tr="_068" style="width: 300px;" colspan="3"></th>
                                    </tr>
                                    <tr>
                                        <th class="tr-language text-center" data-tr="_013" style="width: 120px;"></th>
                                        <th class="tr-language text-center" data-tr="_099" style="width: 100px;"></th>
                                        <th class="tr-language text-center" data-tr="_100" style="width: 100px;"></th>
                                        <th class="tr-language text-center" data-tr="_013" style="width: 100px;"></th>
                                        <th class="tr-language text-center" data-tr="_099" style="width: 100px;"></th>
                                        <th class="tr-language text-center" data-tr="_100" style="width: 100px;"></th>
                                        <th class="tr-language text-center" data-tr="_013" style="width: 100px;"></th>
                                        <th class="tr-language text-center" data-tr="_099" style="width: 100px;"></th>
                                        <th class="tr-language text-center" data-tr="_100" style="width: 100px;"></th>
                                    </tr>
                                </thead>
                                <tbody id="tb_valorizado">
                                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                                    <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="clearfix"></div>
                    </section>
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
            lst_local: {
                required: true
            },
            lst_producto:{
                required: true
            }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                Obj.Facturacion.KardexProductoAx.search(__PK__);
            }
            });
        </js>
    </form>
</div>

