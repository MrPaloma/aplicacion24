// Ajax File upload with jQuery and XHR2
// Sean Clark http://square-bracket.com
// xhr2 file upload
// data is optional
$.fn.upload = function (obj) {
    var data = obj.data;
    var successFn = obj.success;
    var progressFn = true;//obj.progress;
    var sizeLimit = obj.sizeLimit;
    var nameTmp = (obj.nameTmp != undefined) ? obj.nameTmp : false;//activa el atributo NAME temporal, esto es para cuando el name del file es dinamico y no se puede enviar en el post

    // if we dont have post data, move it along
    if (typeof data != "object") {
        progressFn = successFn;
        successFn = data;
    }
    return this.each(function () {
        if ($(this)[0].files[0]) {
            var input = $(this);
            //mostrar progress
            input.parent().find('.lv-progress').removeClass('hide');
            input.parent().find('.lv-progress').find('progress').val(0);
            input.parent().find('.lv-progress').find('.info').html('0%');

            var formData = new FormData();



            var sizeByte = $(this)[0].files[0].size;
            var sizekiloBytes = parseInt(sizeByte / 1024);

            if (sizekiloBytes > sizeLimit) {
                Tools.notify().smallMsn({
                    content: 'El tamaño supera el limite permitido!'
                });
                return false;
            }

            formData.append($(this).attr("name"), $(this)[0].files[0]);
            if (nameTmp) {
                formData.append('file_name_tmp', $(this)[0].files[0]);
            }
            // if we have post data too
            if (typeof data == "object") {
                for (var i in data) {
                    formData.append(i, data[i]);
                }
            }

            let myRand = parseInt(Math.random() * 999999999999999);
            formData.append('_keypassw', myRand);
            formData.append('_ipLocal', localStorage.getItem('app_idLocal'));
            formData.append('_qn', Tools.en(obj.token));

            // do the ajax request
            $.ajax({
                url: obj.url,
                type: 'POST',
                xhr: function () {
                    myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload && progressFn) {
                        myXhr.upload.addEventListener('progress', function (prog) {
                            var value = ~~((prog.loaded / prog.total) * 100);

                            //rdcc
                            //Barra de progreso.
                            input.parent().find('.info').html(`${value}%`);
                            input.parent().find('.progressup').val(value);

                            // if we passed a progress function
//                            if (progressFn && typeof progressFn == "function") {
//                                progressFn(prog, value);
//
//                                // if we passed a progress element
//                            } else if (progressFn) {
//                                $(progressFn).val(value);
//                            }
                        }, false);
                    }
                    return myXhr;
                },
                data: formData,
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                complete: function (res) {
                    var json;
                    try {
                        json = JSON.parse(res.responseText);
                    } catch (e) {
                        json = res.responseText;
                    }
                    if (successFn)
                        successFn(json);
                }
            });
        }
    });
};