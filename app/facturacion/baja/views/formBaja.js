<div>
    <form>

        <section class="col col-12">
            <div style="background: #fff;border:1px #00a300 solid">
                <div class="alert alert-success no-margin fade in">
                    <i class="fa-fw fa fa-info"></i> <span class="tr-language" data-tr="_002"></span>               
                </div>


                <div class="row padding-10">
                    <div class="smart-form">
                        <section class="col col-1" style="margin-bottom: 0px">
                            <label class="label tr-language" data-tr="num_doc"></label>
                            <label class="input"> 
                                <input name="txt_num_doc_baja" id="txt_num_doc_baja" type="text" class="input-xs lv-disabled" readonly="true"/>
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
                        <div id="btn_ver" class="hide"></div>
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
                        <div class="lv-requided-require"></div>
                        <div id="tool_btn"></div>
                    </footer>
                </div>

            </div>
            <div class="clearfix"></div>
        </section>

        <js>
            $.validate({
                ignore: [],
                rules: {
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
                    Obj.Facturacion.BajaAx.postBaja(__PK__);
                }
            });
        </js>

    </form>
</div>

