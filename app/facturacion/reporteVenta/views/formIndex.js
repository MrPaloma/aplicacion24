<div>
    <form>
        <br/>
            <div id="accordionq" class="panel-group smart-accordion-default">

                <div class="panel panel-default" style="padding: 0px !important;padding-left:0px !important;">

                    <div class="panel-heading">
                        <h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordionq" href="#collapseOne-1" aria-expanded="false" class="collapsed"> <i class="fa fa-fw fa-plus-circle txt-color-green"></i> 
                                <i class="fa fa-fw fa-minus-circle txt-color-red"></i> <span class="tr-language" data-tr="_275"></span> </a></h4>
                    </div>
                    <div id="collapseOne-1" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                        <div class="panel-body">

                            <div>
                                <div class="form-horizontal">
                                    <div class="form-group">
                                        <label class="col-md-2 control-label tr-language" data-tr="_083"></label>
                                        <div class="col-md-2">
                                            <input class="form-control" type="text" id="txt_desde" name="txt_desde"/>
                                        </div>
                                        <label class="col-md-2 control-label tr-language" data-tr="_084"></label>
                                        <div class="col-md-2">
                                            <input class="form-control" type="text" id="txt_hasta" name="txt_hasta"/>
                                        </div>

                                        <div class="col-md-2" id="btn_bus_01">

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="d_venta_local"></div>                       


                        </div>
                    </div>



                </div>

                <div class="panel panel-default" style="padding: 0px !important;padding-left:0px !important;">

                    <div class="panel-heading">
                        <h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordionq" href="#collapseOne-2" aria-expanded="false" class="collapsed"> <i class="fa fa-fw fa-plus-circle txt-color-green"></i> 
                                <i class="fa fa-fw fa-minus-circle txt-color-red"></i> <span class="tr-language" data-tr="_240"></span> </a></h4>
                    </div>
                    <div id="collapseOne-2" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                        <div class="panel-body">

                            <div>
                                <div class="form-horizontal">
                                    <div class="form-group">
                                        <label class="col-md-1 control-label tr-language" data-tr="local"></label>
                                        <div class="col-md-2" id="d_local">
                                            <select class="form-control" id="lst_local" name="lst_local"/>
                                        </div>
                                        
                                        <label class="col-md-1 control-label tr-language" data-tr="_083"></label>
                                        <div class="col-md-2">
                                            <input class="form-control" type="text" id="txt_desde2" name="txt_desde2"/>
                                        </div>
                                        <label class="col-md-1 control-label tr-language" data-tr="_084"></label>
                                        <div class="col-md-2">
                                            <input class="form-control" type="text" id="txt_hasta2" name="txt_hasta2"/>
                                        </div>

                                        <div class="col-md-3">
                                            <span id="btn_bus_02"></span>
                                            <button id="btn_excel" type="button" class="btn btn-default"><i class="fa fa-file-excel-o"></i> <span class="tr-language" data-tr="_246"></span></button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="tb_all" class="table-responsive">
                                <table class="table table-bordered" border="1">
                                    <thead>
                                        <tr style="background:#eee">
                                            <th colspan="7" class="text-center tr-language" data-tr="_277"></th>
                                        </tr>
                                        <tr>
                                            <th class="text-center tr-language" data-tr="_005" style="width: 100px;"></th>
                                            <th class="text-center tr-language" data-tr="_079" style="width: 150px;"></th>
                                            <th class="text-center tr-language" data-tr="_026" style="width: 80px;"></th>
                                            <th class="text-center tr-language" data-tr="_271" style="width: 280px;"></th>
                                          
                                            <th class="text-center tr-language" data-tr="_038" style="width: 100px;"></th>
                                            <th class="text-center tr-language" data-tr="_243" style="width: 80px;"></th>
                                            <th class="text-center tr-language" data-tr="_074" style="width: 80px;"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tb_vg">
                                        
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td></td>
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
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table> 
                                <hr/>
                                <table class="table table-bordered" border="1">
                                    <thead>
                                        <tr style="background:#eee">
                                            <th class="text-center tr-language" data-tr="_278" colspan="2"></th>
                                            <th class="text-center tr-language" data-tr="_279" colspan="2"></th>
                                        </tr>
                                        <tr>
                                            <th class="text-center tr-language" data-tr="_005" style="width: 200px;"></th>
                                            <th class="text-center tr-language" data-tr="_017" style="width: 100px;"></th>
                                            <th class="text-center tr-language" data-tr="_005" style="width: 200px;"></th>
                                            <th class="text-center tr-language" data-tr="_017" style="width: 100px;"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tb_tvefectivo">
                                        <tr>
                                            <td colspan="2" style="padding: 0px">
                                                <table id="tb_pagado" class="table table-bordered" style="margin: 0px">
                                                    <tr>
                                                        <td style="width: 200px;">&nbsp;</td>
                                                        <td style="width: 100px;text-align: right">0</td>
                                                    </tr>
                                                </table>
                                            </td>
                                            <td colspan="2" style="padding: 0px">
                                                <table id="tb_credito" class="table table-bordered" style="margin: 0px">
                                                    <tr>
                                                        <td style="width: 200px;">&nbsp;</td>
                                                        <td style="width: 100px;text-align: right">0</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>                                        
                                    </tbody>
                                </table> 
                                <hr/>
                                <table class="table table-bordered" border="1">
                                    <thead>
                                        <tr style="background:#eee">
                                            <th colspan="5" class="text-center tr-language" data-tr="_276"></th>
                                        </tr>
                                        <tr>
                                            <th class="text-center tr-language" data-tr="_139" style="width: 100px;"></th>
                                            <th class="text-center tr-language" data-tr="_245" style="width: 150px;"></th>
                                            <th class="text-center tr-language" data-tr="_199" style="width: 300px;"></th>
                                            <th class="text-center tr-language" data-tr="_073" style="width: 100px;"></th>
                                            <th class="text-center tr-language" data-tr="_074" style="width: 100px;"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tb_box_litle">
                                        <tr>
                                            <td>&nbsp;</td>
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
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table> 
                                <hr/>
                                <table class="table table-bordered" border="1">
                                    <thead>
                                        <tr style="background:#eee">
                                            <th colspan="4" class="text-center tr-language" data-tr="_280"></th>
                                        </tr>
                                        <tr>
                                            <th class="text-center tr-language" data-tr="razon_social" style="width: 400px;"></th>
                                            <th class="text-center tr-language" data-tr="_073" style="width: 100px;"></th>
                                            <th class="text-center tr-language" data-tr="_067" style="width: 100px;"></th>
                                            <th class="text-center tr-language" data-tr="_068" style="width: 100px;"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tb_x_cobrar">
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table> 
                                <hr/>
                                <table class="table table-bordered" border="1">
                                    <thead>
                                        <tr style="background:#eee">
                                            <th colspan="4" class="text-center tr-language" data-tr="_281"></th>
                                        </tr>
                                        <tr>
                                            <th class="text-center tr-language" data-tr="_080" style="width: 400px;"></th>
                                            <th class="text-center tr-language" data-tr="_073" style="width: 100px;"></th>
                                            <th class="text-center tr-language" data-tr="_067" style="width: 100px;"></th>
                                            <th class="text-center tr-language" data-tr="_068" style="width: 100px;"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tb_x_pagar">
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table> 
                                <hr/>
                                <table class="table table-bordered" border="1">
                                    <thead>
                                    <tr style="background:#eee">
                                            <th colspan="4" class="text-center tr-language" data-tr="_282"></th>
                                        </tr>
                                        <tr>
                                            <th class="text-center tr-language" data-tr="_283" style="width: 100px;"></th>
                                            <th class="text-center tr-language" data-tr="_272" style="width: 100px;"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Apertura de otras cajas</td>
                                            <td id="tb_otras_cajas" style="background:#A9F5A9;"></td>
                                        </tr>
                                        <tr>
                                            <td>Efectivo</td>
                                            <td id="tb_efectivo" style="background:#A9F5A9;"></td>
                                        </tr>
                                        <tr>
                                            <td>Ingresos</td>
                                            <td id="tb_ingresos" style="background:#A9F5A9;"></td>
                                        </tr>
                                        <tr>
                                            <td>Egresos</td>
                                            <td id="tb_egresos" style="background:#F6D8CE;"></td>
                                        </tr>
                                        <tr>
                                            <td>Total general</td>
                                            <td id="tb_total_general" style="background:#CEE3F6;"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>


                        </div>
                    </div>



                </div>
                
                <div class="panel panel-default" style="padding: 0px !important;padding-left:0px !important;">

                    <div class="panel-heading">
                        <h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordionq" href="#collapseOne-3" aria-expanded="false" class="collapsed"> <i class="fa fa-fw fa-plus-circle txt-color-green"></i> 
                                <i class="fa fa-fw fa-minus-circle txt-color-red"></i> <span class="tr-language" data-tr="_270"></span> </a></h4>
                    </div>
                    <div id="collapseOne-3" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                        <div class="panel-body">

                            <div>
                                <div class="form-horizontal">
                                    <div class="form-group">
                                        <label class="col-md-1 control-label tr-language" data-tr="local"></label>
                                        <div class="col-md-2" id="d_local3">
                                            <select class="form-control" id="lst_local3" name="lst_local3" />
                                        </div>

                                        <label class="col-md-2 control-label tr-language" data-tr="_083"></label>
                                        <div class="col-md-2">
                                            <input class="form-control" type="text" id="txt_desde3" name="txt_desde2"/>
                                        </div>
                                        
                                        <label class="col-md-2 control-label tr-language" data-tr="_084"></label>
                                        <div class="col-md-2">
                                            <input class="form-control" type="text" id="txt_hasta3" name="txt_hasta2"/>
                                        </div>

                                        <div class="col-md-2" id="btn_bus_03">

                                        </div>
                                    </div>
                                </div>
                            </div>

                        <div id="d_printer" class="table-responsive">
                            <div class="area_print">
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th colspan="3" class="text-center"><span id="sp_title"></span></th>
                                        </tr>
                                        <tr>
                                            <th class="text-center tr-language" data-tr="_262"
                                                style="width: 80px;"></th>
                                            <th class="text-center tr-language" data-tr="_271"
                                                style="width: 150px;"></th>
                                            <th class="text-center tr-language" data-tr="_272"
                                                style="width: 80px;"></th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody style="text-align:center" id="tb_productos3">
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>                    


                        </div>
                    </div>



                </div>

            </div>

    </form>
</div>