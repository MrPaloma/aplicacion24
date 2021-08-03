<div>
    <form>
        <div class="smart-form">
            <div class="row">
                <section class="col col-6" style="margin-bottom: 0px">
                    <label class="label tr-language" data-tr="_064"></label>
                    <label class="input"> 
                        <input name="txt_cliente" id="txt_cliente" type="text" class="tr-language-ph" data-trph="_065"/>
                    </label>
                </section>
            </div>  
        </div>  
        <div class="lv-divider-bread"></div>
        <div class="smart-form">
            <div class="row">
                <section class="col col-6" >

                    <div style="background: #fff;border:1px #00a300 solid;position: relative" >
                        <div class="alert alert-success no-margin fade in">
                            <i class="fa-fw fa fa-database"></i> <span class="tr-language" data-tr="_069"></span>               
                        </div>  
                        <div id="d_responsive">
                            <table class="table table-hover table-striped">
                                <thead> 
                                <th class="text-center tr-language" data-tr="_026"></th>
                                <th class="text-center tr-language" data-tr="_038"></th>
                                <th class="text-center tr-language" data-tr="_067"></th>
                                <th class="text-center tr-language" data-tr="_068"></th>
                                <th class="text-center tr-language" data-tr="estado"></th>
                                </thead>
                                <tbody id="tb_cuenta">
                                    <tr>
                                        <td>&nbsp;</td><td></td><td></td><td></td><td></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td><td></td><td></td><td></td><td></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td><td></td><td></td><td></td><td></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td><td></td><td></td><td></td><td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>   
                    </div>    


                </section>


                <section class="col col-6">

                    <div style="background: #fff;border:1px #00a300 solid">
                        <div class="alert alert-success no-margin fade in">
                            <i class="fa-fw fa fa-money"></i> <span class="tr-language" data-tr="_063"></span>  
                            <b id="d_ndoc"></b>
                        </div>

                        <div class="form-horizontal" style="padding: 20px">
                            <div class="form-group" style="margin-bottom: 10px">
                                <label class="col-md-3 control-label tr-language" data-tr="_073"></label>
                                <div class="col-md-5">
                                    <input class="form-control input-xs" id="txt_fecha" name="txt_fecha" type="date" style="width: 80%;margin-left: 10px"/>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label tr-language" data-tr="_074"></label>
                                <div class="col-md-5">
                                    <input class="form-control input-xs" type="text" id="txt_importe" name="txt_importe" style="width: 80%;margin-left: 10px"/>
                                </div>
                            </div>
                        </div>

                        <footer>
                            <div class="lv-requided-require"></div>

                            <button id="btn_close" type="button" class="btn btn-warning lv-close"><i class="fa fa-close"></i> <span class="tr-language" data-tr="_075"></span></button>
                            <div id="tool_btn"></div>
                        </footer>
                    </div>  
                </section>


            </div>
        </div>   



        <div class="smart-form">
            <div class="row">
                <section class="col col-6">

                    <div style="background: #fff;border:1px #00a300 solid">
                        <div class="alert alert-success no-margin fade in">
                            <i class="fa-fw fa fa-list-alt"></i> <span class="tr-language" data-tr="_076"></span> <b id="d_det_pagos"></b>            
                        </div>
                        <div class="">
                            <table class="table table-hover table-striped">
                                <thead> 
                                <th class="text-center" style="width: 10px"></th>
                                <th class="text-center tr-language" data-tr="_077"></th>
                                <th class="text-center tr-language" data-tr="_074"></th>
                                </thead>
                                <tbody id="tb_pagos">
                                    <tr>
                                        <td>&nbsp;</td><td></td><td></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td><td></td><td></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td><td></td><td></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td><td></td><td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>    
                    </div>    


                </section>
            </div>
        </div>

        <js>
            $.validate({
        ignore: [],
        rules: {
        txt_fecha: {
        required: true,
                date: true
            },
            txt_importe:{
                required: true,
                number: true
            }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function () {
                Obj.Facturacion.CuentaCobrarAx.postPago(__PK__);
            }
            });
        </js>
    </form>
</div>