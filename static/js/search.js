$("#searchClick").click(() =>{
    var query = $("#search").val();
    if(query){
        console.log(query);
        //$(location).attr('href', "/search/query/" + query)
        // $.get({url: "/search/query/" + query, success: function(result){
        //     console.log(result);
        // }});
        window.location.href = "/search/query?query=" + query;
    }
    
});