<div>
    <form class="form-horizontal">
    
        <div style="background: #fff;border:1px #00a300 solid;position: relative" >
            <div class="alert alert-success no-margin fade in">
                <i class="fa-fw fa fa-filter"></i> <span class="tr-language" data-tr="_091"></span>               
            </div> 


            <div class="form-group padding-10">

                <label class="col-md-2 control-label tr-language" data-tr="user"></label>
                <div class="col-md-3" id="d_users">
                    <select class="form-control chosen" id="lst_user" name="lst_user">
                        <option value=""></option>
                    </select> 
                </div>

                <label class="col-md-1 control-label tr-language" data-tr="_073"></label>
                <div class="col-md-2">
                    <input class="form-control tr-language-ph" id="txt_desde" name="txt_desde" type="text" data-trph="_083"/>
                </div>

                <label class="col-md-1 control-label"></label>
                <div class="col-md-2">
                    <input class="form-control tr-language-ph" id="txt_hasta" name="txt_hasta" type="text" data-trph="_084"/>
                </div>

            </div>

            <div class="smart-form">
                <footer>
                    <div class="lv-requided-require"></div>
                    <div id="foot_btns"></div>
                </footer>
            </div>

        </div> 

        <js>
            $.validate({
                ignore: [],
                rules: {
                    lst_user: {
                        required: true
                    },
                    txt_desde: {
                        required: true,
                        date: true
                    },
                    txt_hasta: {
                        required: true,
                        date: true
                    }   
                },
                errorPlacement: function (error, element) {
                    error.insertAfter(element.parent());
                },
                submitHandler: function () {
                        Obj.Facturacion.LiquidacionDiariaAx.getLiquidacion(__PK__);
                }
            });
        </js>


        <div class="widget-body">

            <hr class="simple">

            <ul class="nav nav-tabs bordered">
                <li class="active">
                    <a href="#s1" data-toggle="tab" class="tr-language" data-tr="_142"></a>
                </li>
                <li>
                    <a href="#s2" data-toggle="tab" class="tr-language" data-tr="_143"></a>
                </li>
                <li>
                    <a href="#s3" data-toggle="tab" class="tr-language" data-tr="_144"></a>
                </li>
            </ul>

            <div class="tab-content padding-10">
                <div class="tab-pane fade in active" id="s1">
                    <div id="btn_print_1" class="pull-right"></div>
                    <div class="clearfix"></div>
                    <hr class="divider"/>
                    <div class="table-responsive">
                        <div class="area_print">
                            <table class="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th class="text-center" colspan="6">
                                            <h3 class="text-primary text-center" style="margin: 20px 0;">
                                                <span class="tr-language" data-tr="_142"></span> <span id="d_fecha1"></span>
                                            </h3>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th class="text-center tr-language" data-tr="_139" style="width: 80px;"></th>
                                        <th class="text-center tr-language" data-tr="_005" style="width: 80px;"></th>
                                        <th class="text-center tr-language" data-tr="_027" style="width: 80px;"></th>
                                        <th class="text-center tr-language" data-tr="cliente" style="width: 150px;"></th>
                                        <th class="text-center tr-language" data-tr="_003" style="width: 80px;"></th>
                                        <th class="text-center tr-language" data-tr="_017" style="width: 80px;"></th>
                                    </tr>
                                </thead>
                                <tbody id="tb_general">
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="s2">
                    <div id="btn_print_2" class="pull-right"></div>
                    <div class="clearfix"></div>
                    <hr class="divider"/>
                    <div class="table-responsive">
                        <div class="area_print">                            
                            <table class="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th colspan="6">
                                            <h3 class="text-primary text-center" style="margin: 20px 0;">
                                                <span class="tr-language" data-tr="_143"></span> <span id="d_fecha2"></span>
                                            </h3>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th class="text-center tr-language" data-tr="_139" style="width: 80px;"></th>
                                        <th class="text-center tr-language" data-tr="_005" style="width: 80px;"></th>
                                        <th class="text-center tr-language" data-tr="_027" style="width: 80px;"></th>
                                        <th class="text-center tr-language" data-tr="cliente" style="width: 150px;"></th>
                                        <th class="text-center tr-language" data-tr="_003" style="width: 80px;"></th>
                                        <th class="text-center tr-language" data-tr="_017" style="width: 80px;"></th>
                                    </tr>
                                </thead>
                                <tbody id="tb_anulados">
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="s3">
                    <div id="btn_print_3" class="pull-right"></div>
                    <div class="clearfix"></div>
                    <hr class="divider"/>
                    <div class="table-responsive">
                        <div class="area_print"> 
                            <h3 class="text-primary text-center" style="margin: 20px 0;">
                                <span class="tr-language" data-tr="_144"></span> <span id="d_fecha3"></span>
                            </h3>
                            <div id="d_lik"></div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
        </div>
    
    </form>
</div>