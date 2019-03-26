var urlLocation = "http://mobeng.dcsys.id/";
var mediaLocation = "http://mobeng.dcsys.id/media/";

function get_all_cabang() {
    $.get(urlLocation + "api/cabangs", function( data ) {
        var html = "";

        data.forEach(element => {
            html += '<div class="container-cabang">';
            html += '<a href="#cabang-detail"><img src="'+mediaLocation+element.fields.img_path+'" alt="" width="100%" class="cabang-img"></a>';
            html += '<div class="text-cabang">'+element.fields.name+'</div>';
            html += '</div>';
        });

        $('#all-cabang').html(html);
    });
}

function get_cabang_detail() {
    $.get(urlLocation + "api/get/cabang", function( data )) {
        var html = "";

        data.forEach(element => {
            html += '';
        })
    }
}