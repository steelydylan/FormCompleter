(function(){
    var notice = function($formChecker,message){
        var $notice = $("<div class='formChecker_notice'>"+message+"</div>");
        $formChecker.append($notice);
        $notice.delay(1).queue(function(next){
            $(this).addClass("active");
            next();
        }).delay(700).queue(function(next){
            $(this).removeClass('active');
            next();
        }).delay(200).queue(function(next){
            $(this).remove();
            next();
        });
    }
    var initMyBookmarklet = function(){
        $.fn.serializeObject = function(){
            var self = this,
                json = {},
                push_counters = {},
                patterns = {
                    "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                    "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
                    "push":     /^$/,
                    "fixed":    /^\d+$/,
                    "named":    /^[a-zA-Z0-9_]+$/
                };
            this.build = function(base, key, value){
                base[key] = value;
                return base;
            };
            this.push_counter = function(key){
                if(push_counters[key] === undefined){
                    push_counters[key] = 0;
                }
                return push_counters[key]++;
            };
            $.each($(this).serializeArray(), function(){

                // skip invalid keys
                if(!patterns.validate.test(this.name)){
                    return;
                }

                var k,
                    keys = this.name.match(patterns.key),
                    merge = this.value,
                    reverse_key = this.name;

                while((k = keys.pop()) !== undefined){

                    // adjust reverse_key
                    reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

                    // push
                    if(k.match(patterns.push)){
                        merge = self.build([], self.push_counter(reverse_key), merge);
                    }

                    // fixed
                    else if(k.match(patterns.fixed)){
                        merge = self.build([], k, merge);
                    }

                    // named
                    else if(k.match(patterns.named)){
                        merge = self.build({}, k, merge);
                    }
                }
                json = $.extend(true, json, merge);
            });
            return json;
        };
        var $formChecker = $("<div class='formChecker'></div>");
        var html = '<div class="formChecker_box">
           <div class="formChecker_inputBox">
               <input type="text" class="formChecker_input" value="form" placeholder="Enter the selector of the form (exp. #form .form form">
           </div>
           <textarea class="formChecker_textarea" placeholder="If you push Get-Code button, The form Json will be filled in here"></textarea>
           <div class="formChecker_btnWrap">
               <button class="formChecker_bottomBtn formCheckerJson">Get Code</button>
               <button class="formChecker_bottomBtn formCheckerSave">Save</button>
               <button class="formChecker_bottomBtn formCheckerLoad">Load</button>
               <button class="formChecker_bottomBtn formCheckerAuto">Auto Fill</button>
           </div>
        </div>';
        $formChecker.append(html);
        var style = "<style>
        .formChecker{
            background-color:rgba(0,0,0,0.3);
            width:100%;
            height:100%;
            position:fixed;
            top:0;
            left:0;
        }
        .formChecker * {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
        }
        .formChecker_box{
            position:absolute;
            background-color:#FFFFFF;
            top:50%;
            left:50%;
            width:500px;
            margin-left:-250px;
            margin-top: -78px;
            padding: 10px;
            border-radius:5px;
        }
        .formChecker_inputBox{
            width:100%;
            margin-bottom:5px;
            border: 1px solid #CCCCCC;
        }
        .formChecker_input{
            width:100%;
            display:table-cell;
            line-height: 25px;
        }
        .formChecker_btnWrap{
            display:table;
            margin-top:5px;
            float:right;
        }
        .formChecker_btn{
            display: table-cell;
            width: 1px;
            white-space: nowrap;
            background-color: #333333;
            color: #FFF;
            line-height: 25px;
            z-index: 1;
            padding: 0 20px;
            -webkit-border-bottom-right-radius: 3px;
                    border-bottom-right-radius: 3px;
            -webkit-border-top-right-radius: 3px;
                    border-top-right-radius: 3px;
            cursor: pointer;
        }
        .formChecker_textarea{
            border-radius: 3px;
            border: 1px solid #CCCCCC;
            width: 100%;
            height: 100px;
        }
        .formChecker_bottomBtn{
            background-color: #333333;
            color: #FFF;
            line-height: 25px;
            padding: 0 20px;
            border:none;
            -webkit-transition: background-color .3s;
            -o-transition: background-color .3s;
            transition: background-color .3s;
        }
        .formChecker_bottomBtn:hover{
            background-color: #AAAAAA;
        }
        .formChecker_bottomBtn:first-child{
            border-bottom-left-radius:3px;
            border-top-left-radius:3px;
        }
        .formChecker_bottomBtn:last-child{
            border-bottom-right-radius:3px;
            border-top-right-radius:3px;
        }
        .formChecker_notice{
            position: fixed;
            top: 50%;
            left: 0;
            background-color:rgba(0,0,0,0);
            padding: 10px;
            color:#FFFFFF;
            text-align: center;
            width: 100%;
            -webkit-transition: background-color .2s ease-in;
               -moz-transition: background-color .2s ease-in;
                -ms-transition: background-color .2s ease-in;
                 -o-transition: background-color .2s ease-in;
                    transition: background-color .2s ease-in;
        }
        .formChecker_notice.active{
            background-color:rgba(0,0,0,0.9);
        }
        </style>";
        $formChecker.append(style);
        $("body").append($formChecker);
        $(document).on("click",".formChecker",function(e){
            if($(e.target).hasClass('formChecker')){
                $(this).remove();
            }
        });
        $(document).on("keydown",".formChecker_input",function(e){
            var val = $(".formChecker_input").val();
            if(e.which === 13){
                $(".formChecker_textarea").val(JSON.stringify($(val).serializeObject(),null,4));
            }
        });
        $(document).on("click",".formCheckerJson",function(e){
            var val = $(".formChecker_input").val();
            $(".formChecker_textarea").val(JSON.stringify($(val).serializeObject(),null,4));
            notice($formChecker,"Finished filling in the textarea")
        });
        $(document).on("click",".formCheckerSave",function(e){
            var pathname = location.pathname;
            var key = $(".formChecker_input").val() + pathname;
            var val = JSON.stringify($(".formChecker_textarea").val());
            localStorage.setItem(key,val);
            notice($formChecker,"The data is saved in the localstorage")
        });
        $(document).on("click",".formCheckerLoad",function(e){
            var pathname = location.pathname;
            var key = $(".formChecker_input").val() + pathname;
            var data = JSON.parse(localStorage.getItem(key));
            $(".formChecker_textarea").val(data);
            notice($formChecker,"The data is loaded from the localstorage")
        });
        $(document).on("click",".formCheckerAuto",function(e){
            var data = JSON.parse($(".formChecker_textarea").val());
            for(var i in data){
                var $ele = $("[name='"+i+"']");
                var $eles = $("[name^='"+i+"\\[']");
                var type = $ele.attr("type") || $eles.attr("type");
                var val = data[i];
                if(type == "hidden"){
                    continue;
                }else if(type == "radio" || type == "checkbox"){
                    if(Array.isArray(val)){
                        $eles.each(function(){
                            for(var t = 0,n = val.length; t < n; t++){
                                if($(this).val() == val[t]){
                                    $(this).click();
                                    $(this).prop("checked",true);
                                }
                            }
                        });
                    }else{
                        $ele.each(function(){
                            if($(this).val() == val){
                                $(this).click();
                                $(this).prop("checked",true);
                            }
                        });
                    }
                }else{
                    if(Array.isArray(val)){
                        var t = 0;
                        $eles.each(function(){
                            $(this).val(val[t]);
                            t++;
                        })
                    }else{
                        $ele.val(val);
                    }
                }
            }
            notice($formChecker,"Finished filling in the form");
        });
    }
    // check prior inclusion and version
    if (window.jQuery === undefined) {
        var done = false;
        var script = document.createElement("script");
        script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js";
        script.onload = script.onreadystatechange = function(){
            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                initMyBookmarklet();
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    } else {
        initMyBookmarklet();
    }
})();