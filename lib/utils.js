var get = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function(){
        if(xhr.readyState ==  4){
            callback(xhr.responseText, xhr.status);
        }
    };
    xhr.send();
};

module.exports = {
    get: get
};