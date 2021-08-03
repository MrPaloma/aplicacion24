<div>
    <form>
        <div class="smart-form">
            <div class="row">
            
                <section class="col col-3">

                    <div class="lv-header-section">
                        <div class="alert alert-success no-margin fade in">
                            <i class="fa-fw fa fa-file"></i> <span class="tr-language" data-tr="numero_actual"></span>               
                        </div>

                        <section style="margin-bottom: 0px" class="padding-10">
                            <label class="label tr-language" data-tr="serie"></label>
                            <label class="select col-6" id="d_serie_g"> 
                                <select name="lst_serie_g" id="lst_serie_g"/>
                            </label>
                        </section>
                        <section style="margin-bottom: 0px" class="padding-10">
                            <label class="label tr-language" data-tr="num_doc"></label>
                            <label class="input col-5"> 
                                <input name="txt_num_doc_g" id="txt_num_doc_g" type="text" class="input-xs lv-disabled" disabled="true"/>
                            </label>
                        </section>
                    </div>    

                </section>
                
                <section class="col col-5">

                    <div class="lv-header-section">
                        <div class="alert alert-success no-margin fade in">
                            <i class="fa-fw fa fa-paper-plane "></i> <span class="tr-language" data-tr="_167"></span>               
                        </div>

                        <section style="margin-bottom: 0px" class="padding-10">
                            <label class="label" id="lb_tipodoc"></label>
                            <label class="input col-6"> 
                                <input name="txt_ruc" id="txt_ruc" type="text" class="input-xs lv-disabled" disabled="true"/>
                            </label>
                        </section>
                        <section style="margin-bottom: 0px" class="padding-10">
                            <label class="label tr-language" data-tr="razon_social"></label>
                            <label class="input"> 
                                <input name="txt_razon_social" id="txt_razon_social" type="text" class="input-xs lv-disabled" disabled="true"/>
                            </label>
                        </section>
                    </div>    

                </section>
                
                <section class="col col-4">

                    <div class="lv-header-section">
                        <div class="alert alert-success no-margin fade in">
                            <i class="fa-fw fa fa-truck"></i> <span class="tr-language" data-tr="_169"></span>               
                        </div>

                        <section style="margin-bottom: 0px" class="padding-10">
                            <label class="label tr-language" data-tr="razon_social"></label>
                            <label class="select" id="d_transportista"> 
                                <select name="lst_transportista" id="lst_transportista" class="chosen">
                                    <option value="" class="tr-language" data-tr="seleccionar"></option>
                                </select>
                            </label>
                        </section>
                        
                        <section style="margin-bottom: 0px" class="padding-10">
                            <label class="label tr-language" data-tr="_176"></label>
                            <label class="select" id="d_conductor"> 
                                <select name="lst_conductor" id="lst_conductor" class="chosen">
                                    <option value="" class="tr-language" data-tr="seleccionar"></option>
                                </select>
                            </label>
                        </section>

                    </div>    


                </section>
                
            </div>
        </div>
        <fieldset><legend></legend></fieldset>
        <section class="col col-12">
            <div class="smart-form lv-header-section">
                <div class="alert alert-success no-margin fade in">
                    <i class="fa-fw fa fa-info"></i> <span class="tr-language" data-tr="_168"></span>
                </div>
                
                <div class="row padding-10">
                    <section class="col col-6" style="margin-bottom: 0px">
                        <section style="margin-bottom: 0px" class="padding-10">
                            <label class="label tr-language" data-tr="_187"></label>
                            <label class="select col-4"> 
                                <select name="lst_enviar_sunat" id="lst_enviar_sunat" class="chosen">
                                    <option value="" class="tr-language" data-tr="seleccionar"></option>
                                    <option value="1" class="tr-language" data-tr="_188"></option>
                                    <option value="0" class="tr-language" data-tr="_189"></option>
                                </select>
                            </label>
                        </section>
                        <section style="margin-bottom: 0px" class="padding-10">
                            <label class="label tr-language" data-tr="_180"></label>
                            <label class="input col-4"> 
                                <input name="txt_fecha_traslado" id="txt_fecha_traslado" type="date" class="input-xs"/>
                            </label>
                        </section>
                        <section style="margin-bottom: 0px" class="padding-10">
                            <label class="label tr-language" data-tr="_178"></label>
                            <label class="textarea"> 
                                <textarea name="txt_partida" id="txt_partida" ></textarea>
                            </label>
                        </section>
                    </section>
                    <section class="col col-6" style="margin-bottom: 0px">
                        <section style="margin-bottom: 0px" class="padding-10">
                            <label class="label tr-language" data-tr="_183"></label>
                            <label class="select col-4"> 
                                <select name="lst_modalidad_transporte" id="lst_modalidad_transporte" class="chosen">
                                    <option value="01" class="tr-language" data-tr="_181"></option>
                                    <option value="02" class="tr-language" data-tr="_182"></option>
                                </select>
                            </label>
                        </section>
                        <section style="margin-bottom: 0px" class="padding-10">
                            <label class="label tr-language" data-tr="_184"></label>
                            <label class="input col-2"> 
                                <input name="txt_nbulto" id="txt_nbulto" type="text" class="input-xs" maxlength="3"/>
                            </label>
                        </section>
                        <section style="margin-bottom: 0px" class="padding-10">
                            <label class="label tr-language" data-tr="_179"></label>
                            <label class="textarea"> 
                                <textarea name="txt_llegada" id="txt_llegada" ></textarea>
                            </label>
                        </section>
                    </section>
                </div>
            </div>
        </section>
        <fieldset><legend></legend></fieldset>
        <section class="col col-12">
            <div class="smart-form lv-header-section">
                <div class="alert alert-success no-margin fade in">
                    <i class="fa-fw fa fa-file-text"></i> <span class="tr-language" data-tr="_011"></span>               
                </div>

                <div id="d_responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th class="tr-language text-center" data-tr="_186" style="width: 10%;"></th>
                                <th class="tr-language text-center" data-tr="_012" style="width: 50%;"></th>
                                <th class="tr-language text-center" data-tr="u_medida" style="width: 30%;"></th>
                                <th class="tr-language text-center" data-tr="_013" style="width: 10%;"></th>
                            </tr>
                        </thead>
                        <tbody id="tb_detail_guia">

                        </tbody>
                    </table>
                </div>
            </div>    
        </section>
        <fieldset><legend></legend></fieldset>
                
        <div class="smart-form">
            <div class="row">
                <section class="col col-6">

                    <div class="lv-header-section">
                        <div class="alert alert-success no-margin fade in">
                            <i class="fa-fw fa fa-file"></i> <span class="tr-language" data-tr="_018"></span>               
                        </div>

                        <section style="margin-bottom: 0px" class="padding-10">
                            <label class="label" id="lb_tipodoc"></label>
                            <label class="textarea"> 
                                <textarea name="txt_gobservaciones" id="txt_gobservaciones" ></textarea>
                            </label>
                        </section>
                       
                    </div>    

                </section>
                
            </div>
        </div>
        
        <div class="smart-form">
            <footer>
                <div class="lv-requided-require"></div>
                <div id="tool_btn_g"></div>
            </footer>
        </div>
        
        <js>
            $.validate({
                ignore: [],
                rules: {
                    lst_transportista: {
                         required: true
                    },
                    lst_conductor: {
                        required: true
                    },
                    txt_fecha_traslado: {
                        required: true,
                        date: true
                    },
                    txt_nbulto:{
                        required: true,
                        number: true
                    },
                    txt_partida:{
                        required: true
                    },
                    txt_llegada:{
                        required: true
                    },
                    lst_enviar_sunat:{
                        required: true
                    }
                    ,
                    lst_serie_g:{
                        required: true
                    }
                },
                errorPlacement: function (error, element) {
                    error.insertAfter(element.parent());
                },
                submitHandler: function () {
                    Obj.Facturacion.VentaAx.postGuia(__PK__);
                }
            });
        </js>
        
    </form>
</div>