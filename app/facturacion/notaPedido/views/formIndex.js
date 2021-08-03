<div>
    <form>

        

        <section class="col col-12">
            <div class="smart-form" style="background: #fff;border:1px #00a300 solid">
                <div class="alert alert-success no-margin fade in">
                    <i class="fa-fw fa fa-file-text"></i> <span class="tr-language" data-tr="_087"></span>               
                </div>

                <div id="d_responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th class="tr-language text-center" data-tr="_012" style="width: 410px;"></th>
                                <th class="tr-language text-center" data-tr="u_medida" style="width: 60px;"></th>
                                <th class="tr-language text-center" data-tr="_013" style="width: 100px;"></th>
                                <th class="tr-language text-center" data-tr="_015" style="width: 100px;"></th>
                                <th class="tr-language text-center" data-tr="_016" style="width: 100px;"></th>
                                <th class="tr-language text-center" data-tr="_017" style="width: 100px;"></th>
                                <th class="text-center"></th>
                            </tr>
                        </thead>
                        <tbody id="tb_detail">

                        </tbody>
                    </table>
                </div>
            </div>    
            <br/>
            <div id="btn_add"> </div> 
        </section>

        <fieldset><legend></legend></fieldset>


        <div class="smart-form">
            <div class="row">
                <section class="col col-8">

                    


                </section>


                <section class="col col-4">

                    <div class="form-horizontal" style="background: #fff;border:1px #00a300 solid">
                        <div class="alert alert-success no-margin fade in">
                            <i class="fa-fw fa fa-money"></i> <span class="tr-language" data-tr="_017"></span>               
                        </div>

                        <div class="form-group" style="padding: 20px">
                           
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
                <div id="tool_btn"></div>
            </footer>
        </div>

        <js>
            $.validate({
                ignore: [],
                rules: {

                },
                errorPlacement: function (error, element) {
                    error.insertAfter(element.parent());
                },
                submitHandler: function () {
                    Obj.Facturacion.NotaPedidoAx.post(__PK__);
                }
            });
        </js>

    </form>
</div>

