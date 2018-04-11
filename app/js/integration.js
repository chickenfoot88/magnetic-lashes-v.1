var Leadrock = {
    track_id: null,
    wms_id: null,
    formSelectors: {
        formsClassName: 'form',
        name: '.name',
        phone: '.phone',
        email: '.email',
        other: false,
        price: '.price'
    },
    thankYouCallback: false,
    errorCallback: false,
    facebook_id: false,
    currency: 'USD',
    goalName: 'Purchase',
    urlConfig: {
        api: '//{DOMAIN}/api/integration',
        thankYouPage: false
    },
    trackUrl: false,
    trackCallback: false,
    clickIdParamName: 'click_id',
    init: function(params) {
        Leadrock.setConfigParams(params);
        if (Leadrock.trackUrl !== false) {
            Leadrock.loadRemoteConfigAfterTrack();
        } else {
            Leadrock.loadRemoteConfig();
        }
    },
    apiDomain: function () {
        var scripts = document.getElementsByTagName('script');
        var getLocation = function(href) {
            var l = document.createElement("a");
            l.href = href;
            return l;
        };
        for (var i = 0; i < scripts.length; i++) {
            var url = scripts[i].src;
            if (url.indexOf('lead') >= 0 && url.indexOf('rock') >= 0 && url.indexOf('integration.js') >= 0) {
                var l = getLocation(url);
                return l.hostname;
            }
        }
        return 'leadrock.com';
    },
    getLandingDomain: function(){
        return window.location.protocol + '//' + window.location.host;
    },
    setConfigParams: function(params) {
        if (params.goal !== undefined) {
            Leadrock.goalName = params.goal;
        }
        if (params.formSelectors !== undefined) {
            if (params.formSelectors.formsClassName !== undefined) {
                Leadrock.formSelectors.formsClassName = params.formSelectors.formsClassName;
            }
            if (params.formSelectors.name !== undefined) {
                Leadrock.formSelectors.name = params.formSelectors.name;
            }
            if (params.formSelectors.phone !== undefined) {
                Leadrock.formSelectors.phone = params.formSelectors.phone;
            }
            if (params.formSelectors.phone !== undefined) {
                Leadrock.formSelectors.phone = params.formSelectors.phone;
            }
            if (params.formSelectors.email !== undefined) {
                Leadrock.formSelectors.email = params.formSelectors.email;
            }
            if (params.formSelectors.other !== undefined) {
                Leadrock.formSelectors.other = params.formSelectors.other;
            }
            if (params.thankYouCallback !== undefined && typeof params.thankYouCallback === 'function') {
                Leadrock.thankYouCallback = params.thankYouCallback;
            }
            if (params.errorCallback !== undefined && typeof params.errorCallback === 'function') {
                Leadrock.errorCallback = params.errorCallback;
            }
        }
        if (params.urlConfig !== undefined) {
            if (params.urlConfig.thankYouPage !== undefined) {
                Leadrock.urlConfig.thankYouPage = params.urlConfig.thankYouPage;
            }
        }
        if (params.clickIdParamName !== undefined) {
            Leadrock.clickIdParamName = params.clickIdParamName;
        }
        if (params.trackUrl !== undefined) {
            Leadrock.trackUrl = params.trackUrl;

            var clickId = Leadrock.getUrlParam(Leadrock.clickIdParamName);
            var index = Leadrock.trackUrl.indexOf('{clickid}');
            if (index !== -1 && clickId) {
                Leadrock.trackUrl = Leadrock.trackUrl.substring(0, index) + clickId;
            }
        }
        if (params.trackCallback !== undefined && typeof params.trackCallback === 'function') {
            Leadrock.trackCallback = params.trackCallback;
        }
        Leadrock.urlConfig.api = Leadrock.urlConfig.api.replace('{DOMAIN}', Leadrock.apiDomain());
    },
    getUrlParam: function (param) {
        var results = new RegExp('[\?&]' + param + '=([^&#]*)').exec(window.location.href);
        return results ? results[1] : false;
    },
    setConfigLoaded: function(config) {
        if (config.facebook_id !== undefined) {
            Leadrock.facebook_id = config.facebook_id;
        }
        if (config.thankyou_url !== undefined && config.thankyou_url !== null) {
            Leadrock.urlConfig.thankYouPage = config.thankyou_url;
        }
        if (config.wms_id !== undefined) {
            Leadrock.wms_id = config.wms_id;
        }
        if (config.click_id !== undefined && Leadrock.trackCallback !== false) {
            Leadrock.trackCallback(config.click_id);
        }
    },
    loadRemoteConfig: function(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', Leadrock.urlConfig.api + '/config?domain=' + Leadrock.getLandingDomain(), true);
        xhr.withCredentials = true;
        xhr.onload = function() {
            Leadrock.setConfigLoaded(JSON.parse(xhr.responseText));
            Leadrock.loadFullReadyConfiguration();
        };

        xhr.send();
    },
    loadRemoteConfigAfterTrack: function(){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', Leadrock.trackUrl, true);
        xhr.withCredentials = true;
        xhr.onload = function() {
            Leadrock.loadRemoteConfig();
        };

        xhr.send();
    },
    loadFullReadyConfiguration: function() {
        Leadrock.insertTrackingCode();
        Leadrock.setEventListeners();
    },
    insertTrackingCode: function(){
        Leadrock.addFacebookCode('PageView');
    },
    addFacebookCode: function(eventName){
        if (Leadrock.facebook_id !== false) {
            var img = document.createElement('img'),
                url = 'https://www.facebook.com/tr?id=' + Leadrock.facebook_id + '&ev=' + eventName + '&noscript=1';
            if (eventName == 'Purchase') {
                var element = document.querySelector(Leadrock.formSelectors.price);
                if (element !== null) {
                    url += '&cd[value]=' + element.value + '&cd[currency]=' + Leadrock.currency;
                }
            }
            img.src = url;
            img.height = 1;
            img.width = 1;
            img.setAttribute('style', 'display:none');

            document.body.appendChild(img);
        }
    },
    setEventListeners: function(){
        var forms = document.getElementsByClassName(Leadrock.formSelectors.formsClassName);
        for (i = 0; i < forms.length; i++) {
            var form = forms[i];
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                Leadrock.conversion(this);
            }, false);
        }
    },
    conversion: function(form){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', Leadrock.urlConfig.api + '/conversion?domain=' + Leadrock.getLandingDomain(), true);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = function() {
            Leadrock.applyConversionResult(JSON.parse(xhr.responseText));
        };

        xhr.send(Leadrock.collectConversionData(form));
    },
    collectConversionData: function(form){
        var data = {
            goal: Leadrock.goalName
        }, element;

        var serialize = function(obj, prefix) {
            var str = [], p;
            for(p in obj) {
                if (obj.hasOwnProperty(p)) {
                    var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                    str.push((v !== null && typeof v === "object") ?
                        serialize(v, k) :
                        encodeURIComponent(k) + "=" + encodeURIComponent(v));
                }
            }
            return str.join("&");
        };

        element = form.querySelector(Leadrock.formSelectors.name);
        if (element !== null) {
            data.name = element.value;
        }
        element = form.querySelector(Leadrock.formSelectors.phone);
        if (element !== null) {
            data.phone = element.value;
        }
        element = form.querySelector(Leadrock.formSelectors.email);
        if (element !== null) {
            data.email = element.value;
        }
        element = form.querySelector(Leadrock.formSelectors.price);
        if (element !== null) {
            data.price = element.value;
        }

        var elements = form.querySelectorAll(Leadrock.formSelectors.other);
        if (elements.length > 0) {
            data.other = [];
            var putToOther = function(other, name, value) {
                var arrayName = name.split(/\[|\]/);
                if (arrayName.length > 1) {
                    var temp = other;
                    for (g = 0; g < (arrayName.length - 2); g++) {
                        if (arrayName[g] === '') {
                            continue;
                        }
                        if (typeof temp[arrayName[g]] === "undefined") {
                            temp[arrayName[g]] = [];
                        }
                        temp = temp[arrayName[g]];
                    }
                    temp[arrayName[g]] = value;
                } else {
                    other[name] = value;
                }
            };
            for (i = 0; i < elements.length; i++) {
                element = elements[i];
                var name = element.name;

                if (name) {
                    switch (element.nodeName) {
                        case 'INPUT':
                            switch(element.type) {
                                case 'checkbox':
                                case 'radio':
                                    if (element.checked) {
                                        putToOther(data.other, name, element.value);
                                    }
                                    break;
                                default:
                                    putToOther(data.other, name, element.value);
                            }
                            break;
                        case 'SELECT':
                            var selectedOption = element.options[element.selectedIndex];
                            putToOther(data.other, name, selectedOption ? selectedOption.value : '');
                            break;
                        case 'TEXTAREA':
                            putToOther(data.other, name, element.value);
                            break;
                    }
                }
            }
        }

        return serialize(data);
    },
    clearForm: function(){
        var forms = document.getElementsByClassName(Leadrock.formSelectors.formsClassName);

        for (i = 0; i < forms.length; i++) {
            var form = forms[i];
            form.reset();
        }
    },
    applyConversionResult: function(result) {
        Leadrock.clearForm();
        var isContinue = true,
            leadId = result.lead_id === undefined ? 0 : result.lead_id;
        Leadrock.addFacebookCode(Leadrock.goalName);
        if (Leadrock.thankYouCallback !== false) {
            isContinue = Leadrock.thankYouCallback(leadId) === true;
        }
        if (isContinue === true) {
            return Leadrock.redirectToThankYouPage(leadId);
        }
        return isContinue;
    },
    redirectToThankYouPage: function (leadId) {
        console.log(Leadrock.urlConfig.thankYouPage);
        if (Leadrock.urlConfig.thankYouPage !== null && Leadrock.urlConfig.thankYouPage.length > 0) {
            window.location.href = Leadrock.urlConfig.thankYouPage.replace('{leadId}', leadId);
            return false;
        } else {
            alert('Thank you for your order, we will contact you shortly. Your order ID is ' + leadId);
            return true;
        }
    }
};
