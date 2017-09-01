// window.vindicateClass =
window.vindicate = [];

function vindicateForm(options) {
  this.fields = [];
  this.validationSoftFail = false;
  this.validationHardFail = false;
  this.options = $.extend(true, {
      // These are the defaults.
      soft: false,
      activeForm: false,
      showSuccess: true,
      submitTo: "",
      requiredMessage: "This is a required field.",
      minLengthMessage: "You haven't reach the length",
      parent: "form-group",
      helper: "form-control-feedback",
      validationStates: {
        valid: {
          parent: "has-success",
          input: "form-control-success"
        },
        warning: {
          icon: "has-warning",
          color: "form-control-warning"
        },
        invalid: {
          icon:"has-danger",
          color:"form-control-danger"
        }
      },
      formats: {
        alpha: {
          regex: /^[a-zA-Z]+/,
          message: "This field only accepts alphabetic characters. (a-z)"
        },
        alphanumeric: {
          regex: /^[a-zA-Z0-9]+/,
          message: "This field does not accept any special characters. (a-z, 0-9)"
        },
        creditcard: {
          regex: /^d{16}/,
          message: "Please enter a valid credit card number."
        },
        date: {
          regex: /([0-9]{4}.[0-9]{1,2}.[0-9]{1,2})|([0-9]{1,2}.[0-9]{1,2}.[0-9]{4})/,
          message: "Please enter a valid date. (YYYY-MM-DD)",
        },
        decimal: {
          regex: /^\d+$/,
          message: "Please enter a decimal value (xxx.xx)"
        },
        email: {
          regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
          message: "Please enter a valid email address. (email@domain.com)"
        },
        numeric: {
          regex: /^\d+$/,
          message: "This field only accepts numbers. (0-9)"
        },
        phone: {
          regex: /^([0-9]{3}[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4})/,
          message: "Please enter a 10 digit phone number. (xxx-xxx-xxxx)"
        },
        time: {
          regex: /[0-9]{1,2}(\:[0-9]{0,2})?/,
          message: "Please enter a valid time (xx:xx)"
        },
        url: {
          regex: /^\d+$/,
          message: "Please enter a valid url. (www.website.com/example)"
        }
      }
  }, options);

  this.validate = function() {
    for (index in this.fields) {
      var field = this.fields[index].validate(this.options);
    }
  }
}

function vindicateField($element) {
  this.element = $element;
  this.formGroup = this.element.closest(".form-group");
  this.formFeedback = this.formGroup.find(".form-control-feedback");
  this.id = this.element.attr("id");
  this.data = this.element.data("vindicate").split("|");
  this.validationSoftFail = false;
  this.validationHardFail = false;
  this.fieldType = "*"
  this.required = false;
  this.requiredField = false;
  this.format = false;
  this.group = false;
  this.minLength = false;
  this.matchValue = false;
  this.matchField = false;

  // Determine type of input field
  if (this.element.is(":text")) {
    this.fieldType = "text"
  }
  else if (this.element.is(":checkbox")) {
    this.fieldType = "checkbox"
  }
  else if (this.element.is(":radio")) {
    this.fieldType = "radio"
  }
  else {
    console.warn("Vindicate - Unknown element");
  }
  // Object Methods
  this.init = function() {
    // Process Options
    for (option in this.data) {
      var input_option = this.data[option];
      if (input_option == "required") {
        this.required = true;
      }
      else if (input_option.substring(0,9) == "required:") {
        this.requiredField = input_option.substring(9,input_option.length)
      }
      else if (input_option.substring(0,7) == "format:") {
        this.format = input_option.substring(7,input_option.length)
      }
      else if (input_option.substring(0,6) == "group:") {
        this.group = input_option.substring(6,input_option.length)
        this.element.data("vindicate-group", this.group)
      }
      else if (input_option.substring(0,4) == "min:") {
        this.minLength = input_option.substring(4,input_option.length)
      }
      else if (input_option.substring(0,7) == "equals:") {
        this.matchValue = input_option.substring(7,input_option.length)
      }
      else if (input_option.substring(0,6) == "match:") {
        this.matchField = input_option.substring(6,input_option.length)
      }
    }
    return true;
  }

  this.init();

  this.validatePrep = function() {
    this.formFeedback.text("");
    if (this.validationSoftFail) {
      this.element.removeClass("form-control-warning");
      this.formGroup.removeClass("has-warning");
      this.validationSoftFail = false;
    }
    if (this.validationHardFail) {
      this.element.removeClass("form-control-danger");
      this.formGroup.removeClass("has-danger");
      this.validationHardFail = false;
    }
  }

  this.validateComplete = function(options) {
    if (this.validationHardFail) {
      this.element.addClass("form-control-danger");
      this.formGroup.addClass("has-danger");
      this.formFeedback.text(this.validationMessage);
    }
    else {
      if (this.validationSoftFail) {
        this.element.addClass("form-control-warning");
        this.formGroup.addClass("has-warning");
        this.formFeedback.text(this.validationMessage);
      }
      else {
        if (options.showSuccess) {
          this.element.addClass("form-control-success");
          this.formGroup.addClass("has-success");
        }
      }
    }
  }

  this.validateRequiredField = function(options) {
    if (this.requiredField.indexOf("[") > -1) {
      // requiredField values
    }
    return true;
  }

  this.validateRequired = function(options) {
    if (this.fieldType == "text"){
      if (this.element.val().length == 0) {
        this.validationSoftFail = true;
        this.validationMessage = options.requiredMessage;
        return false;
      }
    }
    if (this.fieldType == "checkbox") {
      if (!this.element.is(":checked")) {
        this.validationSoftFail = true;
        this.validationMessage = options.requiredMessage;
        return false;
      }
    }
    if (this.fieldType == "radio") {
      if (this.group) {
        if ($('[data-vindicate*="group:' + this.group + '"]:checked').length == 0) {
          this.validationSoftFail = true;
          this.validationMessage = options.requiredMessage;
          return false;
        }
      }
      else {
        if (!this.element.is(":checked")) {
          this.validationSoftFail = true;
          this.validationMessage = options.requiredMessage;
          return false;
        }
      }
    }
    return true;
  }

  this.validateFormat = function(options) {
    strict_validation = ["alpha", "alphanumeric", "creditcard", "date", "decimal","email","numeric", "phone", "time", "url"]
    for (index in strict_validation) {
      format = strict_validation[index];
      if (this.format == format) {
        if (!this.element.val().match(options.formats[format].regex)) {
          this.validationHardFail = true;
          this.validationMessage = options.formats[format].message;
        }
      }
    }
    if (this.format == "custom") { // THIS IS NOT YET IMPLEMENTED
      if (!this.element.val().match(options.formats.date.regex)) {
        this.validationHardFail = true;
        this.validationMessage = options.formats.date.message;
      }
    }
  }

  this.validateMinLength = function(options) {
    if (this.element.val().length < this.minLength) {
      this.validationSoftFail = true;
      this.validationMessage = options.minLengthMessage;
    }
  }

  this.validate = function(options){
    this.validatePrep(options);
    if (this.requiredField){
      this.required = this.validateRequiredField(options);
    }
    if (this.required){
      if (!this.validateRequired(options)) {
        return this.validateComplete(options); // If required but no value, skip validations
      }
    }
    else {
      // Check for empty and exit?
    }
    if (this.format){
      this.validateFormat(options);
    }
    if (this.minLength){
      this.validateMinLength(options);
    }
    return this.validateComplete(options);
  }

}


(function ( $ ) {
    $.fn.vindicate = function() {
      action = "init";
      options = {};
      if (arguments.length == 1) {
        if (typeof(arguments[0]) == "string") {
          action =  arguments[0];
        }
        else {
          options =  arguments[0];
        }
      }
      else if (arguments.length == 2) {
        action = arguments[0];
        options = arguments[1];
      }

      var $form_this = $(this);
      var form_index = $form_this.data("vindicate-index");

      if (action == "init") {
        var vin = new vindicateForm(options);
        vin.fields = $form_this.find(":input").map(function() {
          var $input_this = $(this);
            if ($input_this.attr('data-vindicate')) {
              var field = new vindicateField($input_this);
              return field;
            }
          }).toArray();
        if (form_index) {
          window.vindicate[form_index] = vin;
        }
        else {
          window.vindicate.push(vin);
          form_index = (window.vindicate.length-1); // Minus 1 because array is 0 based
          $form_this.data("vindicate-index", form_index)
        }
        console.log("Vindicate - Form Initialized", vin);
      }
      if (action == "validate") {
        var vin = window.vindicate[form_index];
        var validation = vin.validate();
      }
    };

}( jQuery ));
