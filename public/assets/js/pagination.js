
$(function(){
    dbtable =  $('#dataTable').DataTable({
            "destroy":true,
            "aLengthMenu": [
                [200, 600, 900, -1],
                [200, 600, 900, "All"] // change per page values here
            ],
            // set the initial value
            "iDisplayLength": 200,
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ dòng",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                }
            },
            "aoColumnDefs": [{
                'bSortable': false,
                'aTargets': [0]
            }
            ],
            "pagingType": "full_numbers",
            dom: 'Bfrtip',
            buttons: [{
                extend: 'excelHtml5',
                customize: function (xlsx) {
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];

                    // jQuery selector to add a border
                    $('row c[r*="10"]', sheet).attr('s', '25');
                }
            }]
        });
})