(function ( $ ) {

    $.fn.vindicate = function( options ) {
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            soft: true,
            activeForm: false,
            submitTo: "",
            requiredMessage: "This is a required field."
            formatMessages: {
              date: "Please enter a valid date. (YYYY-MM-DD)",
              time: "Please enter a valid time (xx:xx)",
              numeric: "This field only accepts numbers. (0-9)",
              alphanumeric: "This field does not accept any special characters. (a-z, 0-9)",
              email: "Please enter a valid email address. (email@domain.com)",
              decimal: "Please enter a decimal value (xxx.xx)",
              url: "Please enter a valid url. (www.website.com/example)",
              phone7: "Please enter a 7 digit phone number. (xxx-xxxx)",
              phone10: "Please enter a 10 digit phone number. (xxx-xxx-xxxx)"
              creditcard: "Please enter a valid credit card number."
            }
            parent: "form-group"
            helper: "help-block"
            validationStates: {
              valid: {
                icon: "fa fa-check",
                color: "#0F0"
                },
              warning: {
                icon: "fa fa-exclamation",
                color: "orange"
                },
              invalid: {
                icon:"fa fa-exclamation-circle",
                color:"#A00"
                }
              }
        }, options );

        // Greenify the collection based on the settings variable.
        return this.css({
            color: settings.color,
            backgroundColor: settings.backgroundColor
        });

    };

}( jQuery ));
