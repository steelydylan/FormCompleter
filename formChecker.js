javascript:(function(){
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
var $formChecker_box = $("<div class='formChecker_box'></div>");
var $formChecker_inputBox = $("<div class='formChecker_inputBox'></div>");
var $formChecker_input = $("<input type='text' class='formChecker_input' placeholder='フォームの要素のIDもしくはクラス名を入力'>");
var $formChecker_btn = $("<span class='formChecker_btn'>JSONデータの取得</span>");
var $formChecker_textarea = $("<textarea class='formChecker_textarea'></textarea>");
$formChecker_inputBox.append($formChecker_input,$formChecker_btn);
$formChecker_box.append($formChecker_inputBox,$formChecker_textarea);
$formChecker.append($formChecker_box);
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
	display:table;
	margin-bottom:5px;
}
.formChecker_input{
	width:100%;
	display:table-cell;
	line-height: 25px;
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
	-webkit-border-radius: 3px;
	        border-radius: 3px;
    width: 100%;
    height: 100px;
}
</style>";
$formChecker.append(style);
$("body").append($formChecker);
$(document).on("click",".formChecker",function(e){
	var val = $(".formChecker_input").val();
	if($(e.target).hasClass('formChecker')){
		$(this).remove();
	}else if($(e.target).hasClass('formChecker_btn')){
		$(".formChecker_textarea").val(JSON.stringify($(val).serializeObject()));
	}
});
$(document).on("keydown",".formChecker_input",function(e){
	var val = $(".formChecker_input").val();
	if(e.which === 13){
		$(".formChecker_textarea").val(JSON.stringify($(val).serializeObject()));
	}
});
})();