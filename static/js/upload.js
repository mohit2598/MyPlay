function _(el) {
    return document.getElementById(el);
}

function uploadFile() {
    var file = _("videoFile").files[0];
    var file2 = _("templateFile").files[0];
    var title = _("title").value;
    var description = _("description").value;
    var tags = [];
    var genre = _('genre').value;
    var isPrivate = false;
    let temp = false || parseInt($("input[name=isPrivate]:checked").val(), 10);
    if (temp == 1) isPrivate = true;
    console.log(isPrivate);
    console.log(typeof (isPrivate));
    $("span.tag").each(function () {
        tags.push($(this).text());
    });
    console.log(tags);
    console.log(tags);

    var formdata = new FormData();
    formdata.append("file1", file);
    formdata.append("file2", file2);
    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("tags", tags);
    formdata.append("genre", genre);
    formdata.append("isPrivate", isPrivate);


    // console.log(formdata);
    var ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    ajax.addEventListener("error", errorHandler, false);
    ajax.addEventListener("abort", abortHandler, false);
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let temp = JSON.parse(this.responseText);
            if(temp.code == '1'){
                $("#success_message2").html('<i class="glyphicon glyphicon-thumbs-up"> </>' +temp.message);
                setTimeout(()=>{
                    window.location = '/';
                },2000);
            }else{
                $("#success_message2").html('<i class="glyphicon glyphicon-thumbs-down"> </>' + temp.message);
            }
        }
    };
    ajax.open("POST", "/video/upload");
    ajax.send(formdata);
}

function progressHandler(event) {
    _("loaded_n_total").innerHTML = "Uploaded " + Math.round((event.loaded) / (1024 * 1024)) + " MB of " + Math.round((event.total) / (1024 * 1024));
    var percent = (event.loaded / event.total) * 100;
    if (percent === 100) {
        _("progressBar").value = 100;
        _("status").innerHTML = '';

    }
    _("progressBar").value = Math.round(percent);
    _("status").innerHTML = Math.round(percent) + "% uploaded... please wait";
}

function completeHandler(event) {
    _("status").innerHTML = 'Success';
    _("progressBar").value = 100; //wil clear progress bar after successful upload
    // _('success_message').slideDown({ opacity: "show" }, "slow") // Do something ...

}

function errorHandler(event) {
    _("status").innerHTML = "Upload Failed";
}

function abortHandler(event) {
    _("status").innerHTML = "Upload Aborted";
}


$(document).ready(function () {
    $('#upload_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            vTalid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            title: {
                validators: {
                    stringLength: {
                        min: 10,
                    },
                    notEmpty: {
                        message: 'At least 10 char clo'
                    }
                }
            },
            description: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please supply 20 length description'
                    }
                }
            },
            genre: {
                validators: {
                    stringLength: {
                        min: 4,
                    },
                    notEmpty: {
                        message: 'Please supply video genre'
                    }
                }
            },
            video_upload: {
                validators: {
                    notEmpty: {
                        message: 'Please select a file to upload'
                    }
                }
            }
            // template_upload: {
            //     validators: {
            //         notEmpty: {
            //             message: 'Please select a template to upload'
            //         }
            //     }
            // }
        }
    })
        .on('success.form.bv', function (e) {

            $('#upload_form').data('bootstrapValidator').resetForm();

            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');
            console.log('heii');
            // Use Ajax to submit form data
            // $.post($form.attr('action'), $form.serialize(), function (result) {
            //     console.log(result);
            // }, 'json');
            uploadFile();
        });
});



var tagsBox = new (function () {
    // ========== Options ==========
    this.options = {
        selector: ".tag-box",
        tagClass: "tag",
        parent: "tags-container",
        close: "&times;",
        seperator: [" ", ",", "-"],
        minLength: 2,
        inputName: "tags[]",
        maxInputs: 3,
        maxReached: null
    };
    this.lastValue = ""; // Store last value

    //              ========== Init ==========
    // ========== Intial the tags functionality ==========
    this.init = (newOptions = {}) => {
        // Initialize options
        var keys = Object.keys(this.options); // Get the kes of the options

        // Set new options
        for (var i = 0; i < keys.length; i++) {
            var keyName = keys[i];  // Key name of the object
            this.options[keyName] = newOptions[keyName] ? newOptions[keyName] : this.options[keyName];
        }

        // Regex
        var pattern =
            "[a-z0-9_#]{" +
            this.options.minLength +
            ",}[" +
            this.options.seperator.join("\\") +
            "]+";
        this.regex = new RegExp(pattern, "igm");

        start();
    };

    // Start the functionality
    var start = () => {
        // Select all elements
        document.querySelectorAll(this.options.selector).forEach(box => {
            // Click to focus on parent
            box.parentNode.addEventListener("click", e => {
                if (e.target.classList.contains(this.options.parent)) {
                    box.focus();
                }
            });

            // Prevent submit
            // Key up event
            box.addEventListener("keypress", e => {
                //Prevent default behaviour
                if (e.keyCode == 13 || e.which == 13) {
                    e.preventDefault();
                    return false;
                }
            });

            // Key up event
            box.addEventListener("keyup", e => {
                //Prevent default behaviour
                e.preventDefault();

                // The value of the input
                var value = box.value;

                if (e.keyCode == 13) {
                    value = value + " ";
                }

                // Backspace
                if (value == "" && this.lastValue == "" && e.keyCode == 8) {
                    // Get last tag if exists
                    var tags = document.querySelectorAll("." + this.options.tagClass);

                    if (tags.length == 0) return; // Return point

                    // Get last tag
                    var lastTag = tags[tags.length - 1];
                    var lastTagText = lastTag.firstElementChild.innerText; // Last tag text

                    // Delete the tag
                    lastTag.parentNode.removeChild(lastTag);

                    // Set the last tag value to the input value
                    box.value = lastTagText;
                    box.select();
                }

                let numberOfInputs = document.querySelectorAll(
                    "." + this.options.tagClass
                ).length;

                if (value.length > this.options.minLength) {
                    // Maximum number of inputs
                    if (numberOfInputs >= this.options.maxInputs) {
                        if (typeof this.options.maxReached == "function") {
                            // Call the callback method
                            this.options.maxReached();
                        }
                        return;
                    }

                    // Regex
                    var matches = value.match(this.regex);

                    // Add elements
                    if (matches) {
                        for (
                            var i = 0;
                            i < matches.length && i < this.options.maxInputs - numberOfInputs;
                            i++
                        ) {
                            addTagElement(matches[i], box);
                        }
                    }
                }

                // Update last value
                this.lastValue = value;
            });
        });
    };

    // Add tag element
    var addTagElement = (text, box) => {
        text = text.substr(0, text.length - 1);

        // Create new input
        var input = document.createElement("input");
        input.type = "hidden";
        input.value = text;
        input.name = this.options.inputName; // Input's name

        // Create span to contain the input
        var span = document.createElement("span");
        span.classList.add(this.options.tagClass);
        span.innerHTML = "<span>" + text + "</span>";
        span.style.position = "relative";

        // Create x icon
        var xIcon = document.createElement("span");
        xIcon.innerHTML = this.options.close;
        xIcon.style.position = "absolute";
        xIcon.classList.add("times");

        // Remove remove the tag on click on the span
        xIcon.addEventListener("click", () => {
            console.log("HERE");
            span.parentNode.removeChild(span);
        });

        // Append child to span container
        span.appendChild(input);
        span.appendChild(xIcon);

        // Append the tag to the parent element before the tag box
        box.parentNode.insertBefore(span, box);
        // Reset the value of the box
        box.value = "";
    };
})();


// Start the magic
tagsBox.init({
    maxInputs: 10,
});