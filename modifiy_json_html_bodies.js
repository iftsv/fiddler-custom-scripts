/*
Example of Fiddler custom script to modify response body of two HTTP requests:
	- the first request  https://exampledomain.com/check?random_parameter=random_value returns JSON {"testRequired": false} and the body of response is modified to {"testRequired": true
	- the second request https://exampledomain.com/prompt?random_parameter=random_value returns HTML code and url of test_script_prod.js script is modified to test_script_debug.js
*/


static function OnBeforeResponse(oSession: Session) {

    if (oSession.HostnameIs("exampledomain.com") && oSession.uriContains("/check/")){
        var oBody = System.Text.Encoding.UTF8.GetString(oSession.responseBodyBytes);            
        var j = Fiddler.WebFormats.JSON.JsonDecode(oBody);
        j.JSONObject["testRequired"] = true;
        var modBytes = Fiddler.WebFormats.JSON.JsonEncode(j.JSONObject);
        var mod = System.Text.Encoding.UTF8.GetBytes(modBytes);
        oSession.ResponseBody = mod;
    }
        
    if (oSession.HostnameIs("exampledomain.com") && oSession.uriContains("/prompt/")){
        var oBody = System.Text.Encoding.UTF8.GetString(oSession.responseBodyBytes);
        var modBytes = oBody.Replace("test_script_prod.js", "test_script_debug.js");
        var mod = System.Text.Encoding.UTF8.GetBytes(modBytes);
        oSession.ResponseBody = mod;
    }
}
