(function ($) {
    "use strict";

    var HTTPAG;

    $.fn.autoCompleteTable = function (options, callback) {

        // default parameters
        var settings = $.extend({
            id: null,
            width: "100%",
            searchAfter: 3, //buscar despues de 3 caracteres
            columns: [],
            rows: {},
            hide: [false], //columnas a ocultar empezando de izquierda a derecha
            onchange: null,
            norecord: "No se encontraron registros",
            dataproperty: null,
            regex: "^[a-zA-ZÑñáéíóúÁÉÍÓÚ 0-9\b]+$",
            data: null,
            placeholder: null,
            theme: "default",
            ajax: null,
            delay: 100,
            highlight: 'word-highlight',
            indexColumView: 1 // columna que se visualizara en text
        }, options);

        var cssClass = {
            "default": "adropdown",
            "classic": "aclassic",
            "white": "awhite"};

        settings.theme = cssClass[settings.theme];

        // initialize DOM elements
        var el = {
            ddDiv: $("<div>", {class: settings.theme, style: "position:absolute;z-index:10;width:" + settings.width}),
            ddTable: $("<table></table>", {style: "width:" + settings.width + "; display: none"}),
            ddTableCaption: $("<caption>" + settings.norecord + "</caption>"),
            ddTextbox: $("<input id='" + settings.id + "' name='" + settings.id + "' type='text' class='form-control autoGrid'>")
        };

        var keys = {
            UP: 38,
            DOWN: 40,
            ENTER: 13,
            TAB: 9,
            BACKSPACE: 8
        };

        var errors = {
            columnNA: "Error: Columnas no definidas",
            dataNA: "Error: Información no disponible"
        };

        // plugin properties
        var autoCompleteTable = {
            id: function () {
                return el.ddTextbox.data("id");
            },
            text: function () {
                return el.ddTextbox.data("text");
            },
            searchdata: function () {
                return el.ddTextbox.val();
            },
            settext: function (text) {
                el.ddTextbox.val(text);
            },
            isNull: function () {
                if (el.ddTextbox.data("text") == "" || el.ddTextbox.data("text") == null)
                    return true;
                else
                    return false;
            },
            all: function () {
                return selectedData;
            }
        };

        // delay function which listens to the textbox entry
        var delay = (function () {
            var timer = 0;
            return function (callsback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callsback, ms);
            };
        })();

        // key/value containing data of the selcted row
        var selectedData = {};

        var focused = false;

        // check if the textbox is focused.
        if (this.is(':focus')) {
            focused = true;
        }

        // get number of columns
        var cols = settings.columns.length;

        var orginalTextBox = this;

        // wrap the div for style
        this.wrap("<div class='acontainer' style='width:" + settings.width + "'></div>");

        // create a textbox for input
        this.before(el.ddTextbox);
        el.ddTextbox.attr("autocomplete", "off");
        el.ddTextbox.css("width", this.width + "px");
        el.ddTextbox.css("font-size", this.css("font-size"));
        el.ddTextbox.attr("placeholder", settings.placeholder);

        // check for mandatory parameters
        if (settings.columns == "" || settings.columns == null) {
            el.ddTextbox.attr("placeholder", errors.columnNA);
        } else if ((settings.data == "" || settings.data == null) && settings.ajax == null) {
            el.ddTextbox.attr("placeholder", errors.dataNA);
        }

        // append div after the textbox
        this.after(el.ddDiv);

        // hide the current text box (used for stroing the values)
        this.hide();

        // append table after the new textbox
        el.ddDiv.append(el.ddTable);
        el.ddTable.attr("cellspacing", "0");

        // append table caption
        el.ddTable.append(el.ddTableCaption);

        // create table columns
        var header = "<thead><tr>";        
        $.each(settings.columns,function(i,v){
            header += "<th>" + v + "</th>";
        });
        header = header + "</thead></tr>";
        el.ddTable.append(header);

        // assign data fields to the textbox, helpful in case of .net postbacks
        {
            var id = "", text = "";

            if (this.val() != "") {
                var val = this.val().split("#$#");
                id = val[0];
                text = val[1];
            }

            el.ddTextbox.attr("data-id", id);
            el.ddTextbox.attr("data-text", text);
            el.ddTextbox.val(text);
        }

        if (focused) {
            el.ddTextbox.focus();
        }

        // event handlers
        //si se selecciona el texto se oculta la busqueda
        el.ddTextbox.select(function () {
            $('.adropdown').find('table').find('tbody').remove();
            hideDropDown();
            //selectedText = document.getSelection();
            //$("#resultado").html("Se ha seleccionado el texto " + selectedText);
        });

        // autocomplete key press
        el.ddTextbox.keyup(function (e) {
            var isData = $('.adropdown').find('table').find('tbody').length;

            if (el.ddTextbox.val().length == 0) {
                $('.adropdown').find('table').find('tbody').remove();
                hideDropDown();
            }

            if (e.keyCode == keys.ENTER && isData == 0) {

                //return if up/down/return key
                if ((e.keyCode < 46 || e.keyCode > 105) && (e.keyCode != keys.BACKSPACE) && e.keyCode != keys.ENTER) {
                    e.preventDefault();
                    return;
                }
                //delay for 1 second: wait for user to finish typing
                delay(function () {
                    if (settings.rules != undefined && typeof settings.rules == 'function') {
                        var m = settings.rules();
                        if (!m.isOk) {
                            var msg = '';
                            $.each(m.msn, function (item, index) {
                                msg += index + '\n\n';
                            });
                            Tools.notify.error({
                                content: msg
                            });

                            return false;
                        }
                    }
                    processInput();
                }, settings.delay);
            }
        });

        // process input
        function processInput()
        {
            if (el.ddTextbox.val() == "") {
                hideDropDown();
                return;
            }

            if (el.ddTextbox.val().length <= settings.searchAfter) {
                return false;
            }

            // hide no record found message
            el.ddTableCaption.hide();

            el.ddTextbox.addClass("loadingAG");

            if (settings.ajax != null)
            {
                var tempData = null;
                if ($.isFunction(settings.ajax.data)) {
                    tempData = settings.ajax.data.call(this);
                } else {
                    tempData = settings.ajax.data;
                }

                // get json data 
                $.ajax({
                    type: settings.ajax.type || 'GET',
                    dataType: 'json',
                    contentType: settings.ajax.contentType || 'application/json; charset=utf-8',
                    headers: settings.ajax.headers || {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: tempData || null,
                    url: settings.ajax.url,
                    beforeSend: function (data2) {
                        if (HTTPAG) {
                            HTTPAG.abort();
                        }
                        HTTPAG = data2;
                    },
                    success: ajaxData,
                    error: function (xhr, ajaxOptions, thrownError) {
                        //el.ddTextbox.removeClass("loadingAG");
                        console.log('Error: ' + xhr.status || ' - ' || thrownError);
                    }
                });
            } else if ($.isFunction(settings.data)) {
                var data = settings.data.call(this);
                jsonParser(data);
            } else {
                // default function
                null;
            }
        }

        // call on Ajax success
        function ajaxData(jsonData)
        {
            if (settings.ajax.success == null || settings.ajax.success == "" || (typeof settings.ajax.success === "undefined"))
            {
                jsonParser(jsonData);
            } else {
                if ($.isFunction(settings.ajax.success)) {
                    var data = settings.ajax.success.call(this, jsonData);
                    jsonParser(data);
                }
            }
        }

        // do not allow special characters
        el.ddTextbox.keypress(function (event) {
            var regex = new RegExp(settings.regex);
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        });

        // textbox keypress events (return key, up and down arrow)
        el.ddTextbox.keydown(function (e) {

            var tbody = el.ddTable.find("tbody");
            var selected = tbody.find(".selectedxx");


            var isData = $('.adropdown').find('table').find('tbody').length;

            if (e.keyCode == keys.ENTER && isData > 0) {
                e.preventDefault();
                select();
            }
            if (e.keyCode == keys.UP) {
                el.ddTable.find(".selectedxx").removeClass("selectedxx");
                if (selected.prev().length == 0) {
                    tbody.find("tr:last").addClass("selectedxx");
                } else {
                    selected.prev().addClass("selectedxx");
                }
            }
            if (e.keyCode == keys.DOWN) {
                tbody.find(".selectedxx").removeClass("selectedxx");
                if (selected.next().length == 0) {
                    tbody.find("tr:first").addClass("selectedxx");
                } else {
                    el.ddTable.find(".selectedxx").removeClass("selectedxx");
                    selected.next().addClass("selectedxx");
                }
            }
        });

        // row click event
        el.ddTable.delegate("tr", "mousedown", function () {
            el.ddTable.find(".selectedxx").removeClass("selectedxx");
            $(this).addClass("selectedxx");
            select();
        });

        // textbox blur event
        el.ddTextbox.focusout(function () {
            $('.adropdown').find('table').find('tbody').remove();
            hideDropDown();
            // clear if the text value is invalid 
            if ($(this).val() != $(this).data("text")) {

                var change = true;
                if ($(this).data("text") == "") {
                    change = false;
                }

                $(this).data("text", "");
                $(this).data("id", "");
//                $(this).val(""); // causba error, eliminaba el contenido del text cuando clicaba en el doom
//                orginalTextBox.val("");

//                if (change) {
//                    onChange();
//                }
            }
        });

        function select() {

            var selected = el.ddTable.find("tbody").find(".selectedxx");

            el.ddTextbox.data("id", selected.find('td').eq(0).text());
            el.ddTextbox.data("text", selected.find('td').eq(1).text());

            var rr = settings.rows.length;

            $.each(settings.rows,function(i,v){
                selectedData[settings.rows[i]] = selected.find('td').eq(i).text();
            });
//            for (var i = 0; i < rr; i++)
//            {
//                selectedData[settings.rows[i]] = selected.find('td').eq(i).text();
//            }

            el.ddTextbox.val(selected.find('td').eq(settings.indexColumView).text());
            //orginalTextBox.val(selected.find('td').eq(0).text() + '#$#' + selected.find('td').eq(1).text());
            hideDropDown();
            onChange();
            el.ddTextbox.focus();

            setTimeout(function () {
                $('.adropdown').find('table').find('tbody').remove();
            }, 100);
        }

        function onChange()
        {
            // onchange callback function
            if ($.isFunction(settings.onchange)) {
                settings.onchange.call(this);
            } else {
                // default function for onchange
            }
        }

        function hideDropDown() {
            el.ddTable.hide();
            el.ddTextbox.removeClass("inputfocus");
            el.ddDiv.removeClass("highlight");
            el.ddTableCaption.hide();
        }

        function showDropDown() {

            var cssTop = (el.ddTextbox.height() + 20) + "px 1px 0px 1px";
            var cssBottom = "1px 1px " + (el.ddTextbox.height() + 20) + "px 1px";

            // reset div top, left and margin
            el.ddDiv.css("top", "0px");
            el.ddDiv.css("left", "0px");
            el.ddTable.css("margin", cssTop);

            el.ddTextbox.addClass("inputfocus");
            el.ddDiv.addClass("highlight");
            el.ddTable.show();

            // adjust div top according to the visibility
            if (!isDivHeightVisible(el.ddDiv)) {
                el.ddDiv.css("top", -1 * (el.ddTable.height()) + "px");
                el.ddTable.css("margin", cssBottom);
                if (!isDivHeightVisible(el.ddDiv)) {
                    el.ddDiv.css("top", "0px");
                    el.ddTable.css("margin", cssTop);
//                    $('html, body').animate({
//                        scrollTop: (el.ddDiv.offset().top - 60)
//                    }, 250);
                }
            }
            // adjust div left according to the visibility
            if (!isDivWidthVisible(el.ddDiv)) {
                el.ddDiv.css("left", "-" + (el.ddTable.width() - el.ddTextbox.width() - 20) + "px");
            }
        }
        function jsonParser(jsonData) {
            try {
                el.ddTextbox.removeClass("loadingAG");

                // remove all rows from the table
                el.ddTable.find("tbody").find("tr").remove();

                // regular expression for word highlight
                var re = null;
                if (settings.highlight != null) {
                    var highlight = true;
                    var re = new RegExp(el.ddTextbox.val(), "gi");
                }

                var ix = 0;
                var row = null, cell = null;
                var rowsConf = settings.rows;

                if (jsonData != null) {
                    $.each(jsonData,function(i,v){
                        ix = i;
//                    for (i = 0; i < jsonData.length; i++) {

                        // display only 15 rows of data
                        if (i >= 15){
                            return;
                        }
                        
                        var obj = jsonData[i];
                        row = "";

                        $.each(rowsConf,function(rr,v){
//                        for (var rr in rowsConf) {
                            cell = obj[rowsConf[rr]] + "";

                            if (highlight) {
                                cell = cell.replace(re, "<span class='" + settings.highlight + "'>$&</span>");
                            }

                            row = row + "<td>" + cell + "</td>";
                        });

                        // append row to the table
                        el.ddTable.append("<tr>" + row + "</tr>");
                    });
                }
                // show no records exists
                if (ix == 0)
                    el.ddTableCaption.show();

                // hide columns, servira para enviar el id a manipular
                $.each(settings.hide,function(i,v){
                    if (!settings.hide[i]) {
                        el.ddTable.find('td:nth-child(' + (i + 1) + ')').hide();
                    }
                });
//                for (var i = 0; i < settings.hide.length; i++)
//                {
//                    if (!settings.hide[i]) {
//                        el.ddTable.find('td:nth-child(' + (i + 1) + ')').hide();
//                    }
//                }

                el.ddTable.find("tbody").find("tr:first").addClass('selectedxx');
                showDropDown();
            } catch (e)
            {
                console.log("Error: " + e);
            }
        }
        return autoCompleteTable;
    };
}(jQuery));

function isDivHeightVisible(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
            && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function isDivWidthVisible(elem) {
    var docViewLeft = $(window).scrollLeft();
    var docViewRight = docViewLeft + $(window).width();

    var elemLeft = $(elem).offset().left;
    var elemRight = elemLeft + $(elem).width();

    return ((elemRight >= docViewLeft) && (elemLeft <= docViewRight)
            && (elemRight <= docViewRight) && (elemLeft >= docViewLeft));
}