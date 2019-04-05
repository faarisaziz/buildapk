var urlLocation = "http://192.168.10.66:8000/";
var mediaLocation = "http://192.168.10.66:8000/media/";
var urlOdoo = "http://192.168.10.66:4000/";

// http://192.168.10.66:4000/
// http://mobeng.dcsys.id/

var verify = false;
var phonenumber = '';
var username = '';
var email = '';
var pwd = '';
var userid = '';

get_banner_mobile();

$('#signup-check').click(function(e){
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/get/telp",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "telp" : $('#signup-phone').val()
        }),
        success: function( data ) {
            if(data.status){
                $('#signup-username').val(data.name);
                username = data.name;
                $('#signup-email').val(data.email);
                email = data.email;
                $('#signup-password').val(data.password);
                pwd = data.password;
                phonenumber = data.mobile;
                userid = data.user_id;
                verify = true;
                $.mobile.toast({
                    message: 'Nomor tersedia'
                });
            } else {
                $('#signup-username').val('');
                $('#signup-email').val('');
                $('#signup-password').val('');
                verify = false;
                $.mobile.toast({
                    message: 'Nomor tidak tersedia'
                });
            }
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
    e.preventDefault();
})

$('#signup-verify').click(function(e){
    if(verify){
        $.ajax({
            type: 'post',
            url: urlLocation + "api/authentication",
            contentType: 'aplication/json',
            dataType: 'json',
            data: JSON.stringify({
                "telp" : phonenumber
            }),
            success: function(data) {
                $.mobile.changePage("#verify");
                $.mobile.toast({
                    message: 'kode OTP telah dikirim'
                });
            },
            complete: function(data) {
                add_user(data.fullname, data.email, data.apps_password, data.mobile);
            },
            error: function( errorThrown ){
                console.log(errorThrown.error);
            }
        });
    } else {
        $.mobile.toast({
            message: 'Lengkapi data terlebih dahulu'
        });
    }
    e.preventDefault();
})

function resend_auth(){
    $.ajax({
        type: 'post',
        url: urlLocation + "api/authentication",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "telp" : phonenumber
        }),
        success: function(data) {
            $.mobile.changePage("#verify");
            $.mobile.toast({
                message: 'kode OTP telah dikirim ulang'
            });
        },
        complete: function(data) {
            add_user(data.fullname, data.email, data.apps_password, data.mobile);
        },
        error: function( errorThrown ){
            console.log(errorThrown.error);
        }
    });
}

function add_user() {
    $.ajax({
        type: 'post',
        url: urlLocation + "api/add_user",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "txt_fullname" : username,
            "email" : email,
            "txt_password" : pwd,
            "telp" : phonenumber,
            "user_id": userid
        }),
        success: function() {
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

$('#verify-next').click(function(e){
    $.ajax({
        type: 'post',
        url: urlLocation + "api/verify",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "telp" : phonenumber,
            "otp" : $('#1').val()+$('#a').val()+$('#b').val()+$('#c').val()+$('#d').val()+$('#e').val()
        }),
        success: function(data) {
            if(data.status == 'true'){
                $.mobile.changePage("#profile");
            } else {
                $.mobile.toast({
                    message: 'kode OTP tidak sesuai'
                });
            }
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
    e.preventDefault();
})

$('#profile-next').click(function(e){
    $.ajax({
        type: 'post',
        url: urlOdoo + "get/telp",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            
        }),
        success: function() {
            $.mobile.changePage("#dashboard");
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
    e.preventDefault();
})

$('#login-btn').click(function(e){
    $.ajax({
        type: 'post',
        url: urlLocation + "api/login",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "username" : $('#login-phone').val(),
            "password" : $('#login-password').val()
        }),
        success: function(data) {
            userid = data.id;
            username = data.username;
            if(data.status == 'true'){
                window.localStorage.setItem('name', username);
                window.localStorage.setItem('userid', userid);
                window.localStorage.setItem('loggedIn', 1);
                $('#profil-user').text(window.localStorage.getItem('name'));
                $.mobile.changePage("#dashboard");
            } else {
                $.mobile.toast({
                    message: 'Username atau password salah'
                });
            }
            
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
    e.preventDefault();
})

$('#logout-btn').click(function(e){
    window.localStorage.setItem('loggedIn', 0);
    $.mobile.changePage("#login");
    $('#login-phone').val('');
    $('#login-password').val('');
})

function get_banner_mobile() {
    $.ajax({
        type: 'get',
        url: urlLocation + "api/banner/mobile",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            data.forEach(element => {
                html += '<div class="banner-item-list"><img src="'+mediaLocation+element.fields.img_path+'"></div>';
            });
    
            $('#all-banner').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_all_cabang() {
    $.ajax({
        type: 'get',
        url: urlLocation + "api/cabangs",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            data.forEach(element => {
                html += '<div class="container-cabang">';
                html += '<a href="#cabang-detail" onclick="get_detail_cabang('+element.pk+')"><img src="'+mediaLocation+element.fields.img_path+'"width="100%" height="150px" class="cabang-img"></a>';
                html += '<div class="text-cabang">'+element.fields.name+'</div>';
                html += '</div>';
            });

            $('#all-cabang').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_detail_cabang(id) {
    $.ajax({
        type: 'get',
        url: urlLocation + "api/get/cabang/"+id,
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            html += '<iframe width="100%" height="200" frameborder="0" style="border:0" ';
            html += 'src="https://www.google.com/maps/embed/v1/place?q='+data[0].lat+','+data[0].lang+'&amp;key=AIzaSyACMR6xDxS1kbYtcgN8IMGH_oRu1VF-6Po"></iframe>';
            html += '<div role="main" class="ui-content" id="map-canvas"><div class="text-cabang-normal">'+data[0].address+'</div>';
            html += '<div class="text-cabang-bold">Email    : '+data[0].email+'</div>';
            html += '<div class="text-cabang-bold">Call     : '+data[0].Call+'</div>';
            html += '<div class="text-cabang-bold">Phone    : '+data[0].Phone+'</div></div>';

            $('#detail-cabang').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_all_produk() {
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/get/product-type",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "key_token" : "a53c6d8a114ebf02d0fb05782534c738bb8f1c8845"
        }),
        success: function( data ) {
            var html = "";

            data.forEach(element => {
                html += '<li class="text-produk ui-listview ui-li-static">';
                html += element.name;
                html += '</li>';
            });

            $('#all-produk').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_detail_produk(id) {
    $.ajax({
        type: 'get',
        url: urlOdoo + "api/get/produk/"+id,
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            html += '<h2>Produk - Detail</h2>';
            html += '<div role="main" class="ui-content">';
            html += '<form class="ui-filterable">';
            html += '<input id="cari-detail" data-type="search" placeholder="Cari di Mobeng">';
            html += '</form>';
            html += '<ul data-role="listview" data-filter="true" data-input="#cari-detail">';

            data.forEach(element => {
                html += '<li class="text-produk">contohprodukoli</li>';
            });
            html += '</ul>';
            html += '</div>';

            $('#detail-produk').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_all_promotion() {
    $.ajax({
        type: 'get',
        url: urlLocation + "api/cabangs",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            data.forEach(element => {
                html += '<option value="'+element.pk+'">'+element.fields.name+'</option>';
            });
    
            $('#promo-list').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_detail_promotion(id) {
    $.ajax({
        type: 'get',
        url: urlLocation + "api/get/promote/"+id.value,
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            html += '<span class="text-promosi">Promo '+data[0].name[3]+'</span>';
            html += '<hr box-align="center" size="1px" width="90%" color="black" />';
            
            data.forEach(element => {
                html += '<img class="promosi" src="'+mediaLocation+element.name[2]+'" alt="promosi">';
            });

            $('#detail-promosi').html(html);
            window.location.href = "#promosi-detail";
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

// function get_vehicle() {
//     $.ajax({
//         type: 'post',
//         url: urlOdoo + "api/estimated/vehicle",
//         contentType: 'aplication/json',
//         dataType: 'json',
//         data: JSON.stringify({
//             "key_token" : "a53c6d8a114ebf02d0fb05782534c738bb8f1c8845",
//             "txt_vehicle" : $('#profile-type').val()
//         }),
//         success: function( data ) {
//             console.log(data);
//             $('#profile-type').autocomplete({
//                 minLength: 0,
//                 source: data.model,
//                 select: function( event, ui ) {
//                     $('#profile-type').val(ui.item,value);
//                     return false;
//                 }
//             })
            
//         },
//         error: function( errorThrown ){
//             console.log(errorThrown);
//         }
//     });
// }

// $('#profile-type').autocomplete({
//     source: function (request, response) {
//         $.ajax({
//             type: 'post',
//             url: urlOdoo + "api/estimated/vehicle",
//             data: {
//                 key_token: "a53c6d8a114ebf02d0fb05782534c738bb8f1c8845",
//                 txt_vehicle: $('#profile-type').val()
//             },
//             success: response,
//             dataType: 'json',
//             minLength: 2,
//             delay: 100
//         });
//     }
// });

// $("#profile-type").focusout(function() {
//     if ($("#profile-type").val() === '') {
//         $('#profile-type').val('');
//     }
// });

function get_all_reminder() {
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/get/product-reminder",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "key_token" : "a53c6d8a114ebf02d0fb05782534c738bb8f1c8845",
            "user_id" : userid
        }),
        success: function( data ) {
            var html = "";
            
            data.forEach(element => {
                html += '<div class="card-riwayat">';
                html += '<div class="item">Servis : '+element.invoice+'</div>';
                html += '<div class="item">Tanggal : '+element.invoice+'</div>';
                html += '<div class="item">Kendaraan : '+element.invoice+'</div>';
                html += '<div class="item">KM : '+element.invoice+'</div>';
                html += '<div class="item">Oli : '+element.invoice+'</div>';
                html += '<div class="item">Waktu : '+element.invoice+'</div>';
                html += '<div class="item">Notes : '+element.invoice+'</div>';
                html += '<a href="#reminder-detail" class="ui-btn btn-riwayat ui-btn-inline ui-corner-all">Detail</a>';
                html += '</div>';
            });

            $('#reminder-list').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_detail_reminder(userid) {
    $.ajax({
        type: 'get',
        url: urlOdoo + "api/get/product/reminder"+userid,
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            html += '<div class="text-reminder-title">POS Order</div>';
            html += '<div class="text-reminder">Mobeng Citraland SBY</div>';
            html += '<div class="text-reminder">Store store store</div>';
            html += '<div class="text-reminder">Store store store</div>';
            html += '<div class="text-reminder">Store store store</div>';
            html += '<div class="text-reminder">Store store store</div>';
            html += '<div class="text-reminder-title">Kondisi Yang Paling Sering Dijalani/Direncanakan</div>';
            html += '<div class="text-reminder">Kondisi lalu lintas</div>';
            html += '<div class="text-reminder">Kondisi lalu lintas</div>';
            html += '<div class="text-reminder">Kondisi lalu lintas</div>';
            html += '<div class="text-reminder">Kondisi lalu lintas</div>';
            html += '<div class="text-reminder">Kondisi lalu lintas</div>';
            html += '<div class="text-reminder-title">Hasil</div>';
            html += '<div class="text-reminder">Kondisi berkendara anda</div>';
            html += '<div class="text-reminder">Kondisi lalu lintas</div>';
            html += '<div class="text-reminder">Kondisi lalu lintas</div>';
            html += '<div class="text-reminder">Kondisi lalu lintas</div>';
            html += '<div class="text-reminder-title">Created By : Galih</div>';

            $('#detail-reminder').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_all_riwayat() {
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/transaction",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "user_id" : "26812"
        }),
        success: function( data ) {
            var html = "";
            // console.log(data);
            
            data.forEach(element => {
                html += '<div class="card-riwayat">';
                html += '<div class="item">No Invoice : '+element.invoice+'</div>';
                html += '<div class="item">Tanggal : '+element.date+'</div>';
                html += '<div class="item">Customer : '+element.customer+'</div>';
                html += '<div class="item">No. Polis : '+element.nopol+'</div>';
                // html += '<div class="item">KM : '+element.km+'</div>';
                // html += '<div class="item">Type : '+element.type+'</div>';
                html += '<a href="#riwayat-detail" onclick="get_detail_riwayat(\''+element.invoice+'\')" class="ui-btn btn-riwayat ui-btn-inline ui-corner-all">Detail</a>';
                html += '<div class="item float-right">Total Transaksi : <span class="price">Rp. '+element.harga+'</span></div>';
                html += '</div>';
                
            });

            $('#riwayat-list').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_detail_riwayat(invoice) {
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/detail/transaction",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "invoice_no" : invoice
        }),
        success: function( data ) {
            var html = "";

            for(var i = 0; i<data[0].detail_transaction.length; i++){
                console.log(data[0].detail_transaction[i].item);
            }
            // console.log(data[0].detail_transaction.length);
            html += '<div class="text-riwayat">No Invoice : '+data[0].invoice_no+'</div>';
            html += '<div class="text-riwayat">Tanggal : '+data[0].date+'</div>';
            html += '<div class="text-riwayat">Customer : '+data[0].customer+'</div>';
            html += '<div class="text-riwayat">No. Polis : '+data[0].nopol+'</div>';
            html += '<div class="text-riwayat">Km : '+data[0].km+'</div>';
            // html += '<div class="text-riwayat">Type : '+data.type+'</div>';
            html += '<hr box-align="center" size="2px" width="90%" color="black" />';
            html += '<table><thead><tr>';
            html += '<th data-priority="1" style="width:200px">Item</th>';
            html += '<th data-priority="2" style="width:20px">QTY</th>';
            html += '<th data-priority="2" style="width:65px">Harga</th>';
            html += '<th data-priority="3" style="width:65px">Disc</th>';
            html += '<th data-priority="4" style="width:65px">Subtotal</th>';
            html += '</tr></thead><tbody>';
            
            for(var i = 0; i<data[0].detail_transaction.length; i++){
                html += '<tr><td>'+data[0].detail_transaction[i].item+'</td>';
                html += '<td>'+data[0].detail_transaction[i].qty+'</td>';
                html += '<td>'+data[0].detail_transaction[i].disc+'</td>';
                html += '<td>'+data[0].detail_transaction[i].harga+'</td>';
                html += '<td>'+data[0].detail_transaction[i].subtotal+'</td></tr>';

            }

            html += '</tbody></table>';
            html += '<span class="text-total">Total Transaksi : <span class="text-total-rp">Rp. '+data[0].total_harga+'</span></span><br>';
            html += '<span class="text-ppn">*Harga sudah termasuk PPN</span>';

            $('#detail-riwayat').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}


function get_all_blog() {
    $.ajax({
        type: 'get',
        url: urlLocation + "api/articles",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            data.forEach(element => {
                html += '<div class="card-blog">';
                html += '<table><td><img src="'+mediaLocation+element.fields.img_path+'" width="80px"></td>';
                html += '<td><span class="item-text-date">'+element.fields.created_dt+'</span><br>';
                html += '<span class="item-text-judul">'+element.fields.title+'</span><br>';
                html += '<span class="item-text" style="display:block;text-overflow: ellipsis;width: 200px;overflow: hidden; white-space: nowrap;">'+element.fields.content+'</span><br>';
                html += '<span class="item-text"><a href="#blog-detail" onclick="get_detail_blog('+element.pk+')">Baca Selengkapnya ...</a></span>';
                html += '</td></table></div>';
            });
    
            $('#all-blog').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_detail_blog(id) {
    $.ajax({
        type: 'get',
        url: urlLocation + "api/get/article/"+id,
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            html += '<img src="'+mediaLocation+data[0].Images+'" alt="blog" width="100%" height="200px">';
            html += '<div role="main" class="ui-content">'+data[0].created_dt+'<br>'+data[0].Conten+'</div>';

            $('#detail-blog').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

$('#hubungi-send').click(function(e){
    var fname = $('#hubungi-fullname').val();
    var eml = $('#hubungi-email').val();
    var sbk = $('#hubungi-subject').val();
    var tm = $('#hubungi-message').val();
    if((fname != '') && (eml != '') && (sbk != '') && (tm != '')) {
        $.ajax({
            type: 'post',
            url: urlLocation + "api/add/contact",
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                "fullname" : $('#hubungi-fullname').val(),
                "email" : $('#hubungi-email').val(),
                "subject" : $('#hubungi-subject').val(),
                "txt_message" : $('#hubungi-message').val()
            }),
            success: function() {
                $.mobile.toast({
                    message: 'Data berhasil dikirim'
                });
                $('#hubungi-fullname').val('');
                $('#hubungi-email').val('');
                $('#hubungi-subject').val('');
                $('#hubungi-message').val('');
            },
            error: function( errorThrown ){
                console.log(errorThrown);
            }
        });
    } else {
        $.mobile.toast({
            message: 'Lengkapi data terlebih dahulu'
        });
    }
    
    e.preventDefault();
})