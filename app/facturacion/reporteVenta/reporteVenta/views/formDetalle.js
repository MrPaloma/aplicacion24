<form class="modal inmodal fade in">
    <div class="modal-dialog" style="width:90%">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"><span>×</span><span class="sr-only"></span></button>
                <h4 class="modal-title"><span class="tr-language" data-tr="_011"></span>: <span id="sp_name"></span></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group">
                        <label class="col-md-2 control-label tr-language" data-tr="_083"></label>
                        <div class="col-md-2">
                            <input class="form-control" type="text" id="txt_desde_d" name="txt_desde_d"/>
                        </div>
                        <label class="col-md-2 control-label tr-language" data-tr="_084"></label>
                        <div class="col-md-2">
                            <input class="form-control" type="text" id="txt_hasta_d" name="txt_hasta_d"/>
                        </div>
                        <div class="col-md-2" id="d_btn_bus">
                        </div>
                    </div>
                </div>

                <div class="lv-divider-bread"></div>
                <div class="col-lg-3 col-md-6" style="margin-bottom: 10px">
                    <div class="panel panel-green">
                        <div class="panel-heading padding-10">
                            <div class="row">
                                <div class="col-xs-3">
                                    <i class="fa fa-cart-plus fa-4x"></i>
                                </div>
                                <div class="col-xs-9 text-right">
                                    <div class="huge" id="d_bruto"></div>
                                    <div class="tr-language" data-tr="_104"></div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>

                <div class="col-lg-3 col-md-6" style="margin-bottom: 10px">
                    <div class="panel panel-success">
                        <div class="panel-heading padding-10">
                            <div class="row">
                                <div class="col-xs-3">
                                    <i class="fa fa-shopping-cart fa-4x"></i>
                                </div>
                                <div class="col-xs-9 text-right">
                                    <div class="huge" id="d_neta"></div>
                                    <div class="tr-language" data-tr="_105"></div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>

                <div class="col-lg-3 col-md-6" style="margin-bottom: 10px">
                    <div class="panel panel-info">
                        <div class="panel-heading padding-10">
                            <div class="row">
                                <div class="col-xs-3">
                                    <i class="fa fa-calculator fa-4x"></i>
                                </div>
                                <div class="col-xs-9 text-right">
                                    <div class="huge" id="d_igv"></div>
                                    <div class="tr-language" data-tr="_106"></div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>

                <div class="col-lg-3 col-md-6" style="margin-bottom: 10px">
                    <div class="panel panel-primary">
                        <div class="panel-heading padding-10">
                            <div class="row">
                                <div class="col-xs-3">
                                    <i class="fa fa-money fa-4x"></i>
                                </div>
                                <div class="col-xs-9 text-right">
                                    <div class="huge" id="d_utilidad"></div>
                                    <div class="tr-language" data-tr="_107"></div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>

                <div class="clearfix"></div>

                <div class="row">
                    <article class="col-xs-12 col-sm-12 col-md-12 col-lg-6 sortable-grid ui-sortable">
                        <div class="jarviswidget jarviswidget-color-blueDark jarviswidget-sortable" id="wid-id-0" data-widget-editbutton="false" role="widget">

                            <header role="heading" class="ui-sortable-handle">
                            <div class="jarviswidget-ctrls" role="menu"> </div>
                                <span class="widget-icon"> <i class="fa fa-table"></i> </span>
                                <h2 class="tr-language" data-tr="_108"></h2>

                                <span class="jarviswidget-loader"><i class="fa fa-refresh fa-spin"></i></span></header>

                            <div role="content">

                                <div class="widget-body no-padding">

                                    <div class="table-responsive">

                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th class="text-center tr-language" data-tr="_027" style="width: 80px;"></th>
                                                    <th class="text-center tr-language" data-tr="cliente" style="width: 150px;"></th>
                                                    <th class="text-center tr-language" data-tr="_003" style="width: 80px;"></th>
                                                    <th class="text-center tr-language" data-tr="_017" style="width: 80px;"></th>
                                                </tr>
                                            </thead>
                                        </table>
                                        <div style="overflow: auto;height: 300px;">
                                            <table class="table table-hover" id="tb_productos">
                                                <tbody>
                                                    <tr>
                                                        <td style="width: 80px;">&nbsp;</td>
                                                        <td style="width: 150px;"></td>
                                                        <td style="width: 80px;"></td>
                                                        <td style="width: 68px;"></td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <table class="table table-hover">
                                            <tbody>
                                                <tr>
                                                    <td style="width: 80px;">&nbsp;</td>
                                                    <td style="width: 150px;"></td>
                                                    <td style="width: 80px;"><b class="tr-language" data-tr="_118"></b></td>
                                                    <td class="text-right" style="width: 68px;"><div id="d_total"></div></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                    <article class="col-xs-12 col-sm-12 col-md-12 col-lg-6 sortable-grid ui-sortable">
                        <div class="table-responsive">
                            <div id="chart_cat_consolidado" style="width: 100%;height: 445px;"></div>
                        </div>
                    </article>
                </div>

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-warning lv-close" data-dismiss="modal"><i class="fa fa-close"></i> <span class="tr-language" data-tr="btn_close"></span></button>
            </div>
        </div>
    </div>
</form>