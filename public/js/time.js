$('#head #time #month').html(moment().format("MMMM"));
$('#head #time #date').html(moment().format("DD"));
$('#head #time #day').html(moment().format("dddd"));
setInterval(function () {
    $('#head #time #time_now').html(moment().format('HH:mm:ss'));
}, 1000);