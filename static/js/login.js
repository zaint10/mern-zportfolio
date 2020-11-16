$(document).ready(function () {
    

    $("#login-form").ajaxForm({
        method: "POST",
        success: function (resp) {
            if(resp.success){
                queryParams = parseParams(window.location.search);
                if(queryParams.next){
                    window.location.href = queryParams.next
                }else{
                    window.location.href = resp.nextRedirect
                }
                
            }
        },
        error: function(resp){
            console.log(resp)
            alert("Error: " );
        }
    });
});


const parseParams = (querystring) => {

    // parse query string
    const params = new URLSearchParams(querystring);

    const obj = {};

    // iterate over all keys
    for (const key of params.keys()) {
        if (params.getAll(key).length > 1) {
            obj[key] = params.getAll(key);
        } else {
            obj[key] = params.get(key);
        }
    }

    return obj;
};