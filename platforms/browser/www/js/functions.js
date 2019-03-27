var urlLocation = "http://192.168.10.66:4000/";
var mediaLocation = "http://mobeng.dcsys.id/media/";

// get_detail_cabang();
get_all_promotion();
// post_vehicle_type();

function get_all_cabang() {
    $.get(urlLocation + "api/cabangs", function( data ) {
        var html = "";

        data.forEach(element => {
            html += '<div class="container-cabang">';
            html += '<a href="#cabang-detail" onclick="get_detail_cabang('+element.pk+')"><img src="'+mediaLocation+element.fields.img_path+'" alt="" width="100%" class="cabang-img"></a>';
            html += '<div class="text-cabang">'+element.fields.name+'</div>';
            html += '</div>';
        });

        $('#all-cabang').html(html);
    });
}

function get_detail_cabang(id) {
    $.get(urlLocation + "api/get/cabang/"+id, function( data ) {
        var html = "";

        html += '<iframe width="100%" height="200" frameborder="0" style="border:0';
        html += ' src="https://www.google.com/maps/embed/v1/place?q='+data[0].lat+','+data[0].lang+'&amp;key="AIzaSyACMR6xDxS1kbYtcgN8IMGH_oRu1VF-6Po">';
        html += '</iframe><div role="main" class="ui-content" id="map-canvas"><div class="text-cabang-normal">'+data[0].address+'</div>';
        html += '<div class="text-cabang-bold">Email    : '+data[0].email+'</div>';
        html += '<div class="text-cabang-bold">Call     : '+data[0].Call+'</div>';
        html += '<div class="text-cabang-bold">Phone    : '+data[0].Phone+'</div></div>';

        $('#detail-cabang').html(html);
        // console.log(data);
    });
}

function get_all_promotion() {
    $.get(urlLocation + "api/promotes", function( data ) {
        var select = document.getElementById('promo-list');
        // var html = "";

        for (var i in data) {
            $(select).append('<option value='+data[i]+'>'+data[i]+'</select>');
            console.log(data);
        }

        // data.forEach(element => {
        //     html += '<option value="">Promosi Cabang Mobeng</option>';
        //     html += '<option value="">'+id+'</option>';
        //     console.log(element);
        // });

        // $('#all-promosi').html(html);
    });
}

function get_detail_promotion(id) {
    $.get(urlLocation + "api/get/promote/"+id, function( data ) {
        var html = "";

        data.forEach(element => {
            html += '';
            html += '';
        });

        $('#detail-promosi').html(html);
        // console.log(data);
    });
}

function post_vehicle_type() {
    $.post(urlLocation + "api/vehicle/type", function( data ) {
        $('#profile-type').html(data);
        console.log(data);
    });
}