$(document).ready(function () {
    
    // $("#login-form").submit(function(event){
    //     $.ajax({
    //         url: '',
    //         method: "POST",
    //         data: "",

    //     success: function (resp) {
    //         if(resp.success){
    //             queryParams = parseParams(window.location.search);
    //             if(queryParams.next){
    //                 window.location.href = queryParams.next
    //             }else{
    //                 window.location.href = resp.nextRedirect
    //             }
                
    //         }
    //     },
    //     error: function(resp){
    //         alert("Error: ");
    //     }
    //     })
    // })

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
            alert("Error: ");
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