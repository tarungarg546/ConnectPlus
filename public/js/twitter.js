function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }
    document.body.appendChild(form);
    form.submit();
}
$(function(){
    var flag=0;
    buttons = document.getElementsByClassName("button")
    console.log(buttons)
    for(var button_index=0; button_index<buttons.length; button_index++) {
        (function(index){
            buttons[index].onclick = function(ev) {
                console.log(index)
                ev.preventDefault()
                if(index == 1) {
                    console.log(index, "inside")
                    getLocation();
                    flag=1;
                } else {
                    if(flag == 0) {
                        alert('You Must share Your location First');
                    } else {
                        var name=prompt('Enter Your twitter handler',name);
                        var req=encodeURI('geocode='+lat+','+lang+',5KM');
                        post('/profile',{name:name,lat:lat,lang:lang});
                    }
                }

            }
        })(button_index);
        
    }
});