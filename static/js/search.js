$("#searchClick").click(() =>{
    var query = $("#search").val();
    console.log(query);
    $.ajax({url: "search/query/" + query, success: function(result){
        console.log(result);
    }});
})