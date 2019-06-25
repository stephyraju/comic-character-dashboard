// info modal to show when page load
$(document).ready(function() {
    $("#myModal").modal('show');
});
//reset filters

$('#reset-filters').click(function() {
    dc.filterAll();
    dc.renderAll();
});
