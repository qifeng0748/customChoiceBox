/**
* 自定义选择框
* var choiceBox = new CustomChoiceBox({
*    wrapper: $('#forms'),
*    radio: {class: 'my_radio', checkedClass: 'my_radio_active', disabledClass: 'my_radio_disabled'},
*    checkbox: {class: 'my_check', checkedClass: 'my_check_active', disabledClass: 'my_check_disabled'},
*    events: {'click': function (){}, 'mouseover': fn}
* });
*
* 参数说明：
* 
* wrapper: 指定一个外层容器，将容器内的radio和checkbox替换为自定义选择框。
* 
* radio: radio的样式，自定义选择框样式class，选择样式checkedClass,禁用样式disabledClass
*            
* checkbox: checkbox的样式，自定义选择框样式class，选择样式checkedClass,禁用样式disabledClass
* 
* events：绑定多个事件，{'click': function (){}, 'mouseover': fn}，可选 
* 
* 方法说明：
* 
* CustomChoiceBox.refreshState(choiceBox); // 每次选择框改变状态或添加选择框，用来刷新自定义选择框样式
*
*/

function CustomChoiceBox(opt) {
    this.wrapper = $(opt.wrapper);
    this.events = opt.events;
    this.wrap = opt.wrap || $('<span></span>');
    this.inputs = this.wrapper.find("input[type='radio'],input[type='checkbox']");

    this.radioClass = opt.radio.className || '';
    this.checkboxClass = opt.checkbox.className || '';

    this.radioCheckedClass = opt.radio.checkedClass || '';
    this.checkboxCheckedClass = opt.checkbox.checkedClass || '';

    this.radioDisabledClass = opt.radio.disabledClass || '';
    this.checkboxDisabledClass = opt.checkbox.disabledClass || '';
    
    this.keyNo = 0;  // 自增key
    
    this.init();
}

// 初始化元素
CustomChoiceBox.prototype.initEles = function(obj) {
    var obj = $(obj);
    var customChoiceBox = $('<span></span>');
    var label = $("label[for='" + obj.attr("id") + "']");
    var type = obj.attr("type");

    obj.wrap(this.wrap);
    obj.parent().append(label);
    obj.parent().css('position', 'relative');

    if (type === 'radio') {
       customChoiceBox.addClass(this.radioClass);
    }

    if (type === 'checkbox') {
        customChoiceBox.addClass(this.checkboxClass);
    }

    customChoiceBox.insertBefore(obj);

    obj.css({opacity: 0, position: "absolute", top: 0, left: 0});

    obj.attr({"data-custom": "true", "data-key": "ccbNo_" + this.keyNo});
    customChoiceBox.attr({"data-key": obj.attr("data-key")});
    this.keyNo++;
};

// 初始化所有自定义选择框
CustomChoiceBox.prototype.initAllEles = function() {
    var self = this;
    var inputs = this.inputs;

    inputs.each(function (){
        if ($(this).attr("data-custom") !== "true") {
            self.initEles(this);
        }
    });
};

// 添加事件
CustomChoiceBox.prototype.addEvent = function(obj) {
    var obj = $(obj);
    var self = this;

    // 当input选择状态改变时，更新对应的自定义选择框样式
    if ($(this).attr("data-custom") !== "true") {
        obj.bind('change',function(){
            self.updateClass(obj);
        });
    }
};

// 更新自定义选择框样式
CustomChoiceBox.prototype.updateClass = function(obj) {
    var obj = $(obj);
    var dataKey = obj.attr("data-key");
    var customChoiceBox = $("span[data-key=" + dataKey + "]");
    var disabledClass = obj.attr("type") === 'checkbox' ? this.checkboxDisabledClass : this.radioDisabledClass;

    if (obj.attr("type") === 'checkbox') {

        if (obj.prop("checked")) {
            customChoiceBox.addClass(this.checkboxCheckedClass);
        } else {
            customChoiceBox.removeClass(this.checkboxCheckedClass);
        }
    }

    for (var i = 0, len = this.inputs.length; i < len; i++) {
        var input = $(this.inputs[i]);
        var inputKey = input.attr("data-key");
        var customInput = $("span[data-key=" + inputKey + "]");

        if ($(this.inputs[i]).attr("type") === 'radio') {

            if ($(this.inputs[i]).prop("checked")) {
                customInput.addClass(this.radioCheckedClass);
            } else {
                customInput.removeClass(this.radioCheckedClass);
            }
        }    
    }

    if (obj.prop("disabled")) {
        customChoiceBox.addClass(disabledClass);
    } else {
        customChoiceBox.removeClass(disabledClass);
    }
};

CustomChoiceBox.prototype.updateAllClass = function() {
    var self = this;
    this.inputs.each(function(){
        self.updateClass(this);
    });
}

// 绑定事件
CustomChoiceBox.prototype.bindEvent = function(events) {
    if ($.isEmptyObject(events)) {
        return;
    }

    var self = this;
    var inputs = this.inputs;

    inputs.each(function() {
        if ($(this).attr("data-custom") !== "true") {
            for (var i in events) {
                $(this).bind(i, function (){
                    events[i]();
                    self.updateClass(this);
                });
            }
        }
    });
};

// 为所有选择框添加事件
CustomChoiceBox.prototype.addAllEvent = function(){
    var inputs = this.inputs;
    var self = this;

    inputs.each(function(){
        self.addEvent(this);
    });
};

CustomChoiceBox.prototype.init = function() {
    this.initAllEles();
    this.addAllEvent();
    this.bindEvent(this.events);
    this.updateAllClass();
};

CustomChoiceBox.refreshState = function(self) {
    self.inputs = self.wrapper.find("input[type='radio'],input[type='checkbox']");

    self.updateAllClass();

    self.inputs.each(function (){
        self.initAllEles();
        self.addAllEvent();
        self.bindEvent(self.events);
    });
};