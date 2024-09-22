$(function(){
	$('#dataTable1').DataTable({
            "destroy": true,
            "aLengthMenu": [
                [20, 60, 90, -1],
                [20, 60, 90, "All"] // change per page values here
            ],
            // set the initial value
            "iDisplayLength": 20,
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