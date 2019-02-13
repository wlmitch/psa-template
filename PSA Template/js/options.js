console.log("on options");
$(document).ready(function () {
    if (localStorage.length != 0) {
        displayTemplate();
    }
    function initCatTable() {
        var table = "<tr><th></th>";
        for (var i = 0; i < days.length; i++) {
            table += "<th>" + days[i] + "</th>";
        }
        table += "</tr>";
        for (var i = 0; i < categories.length; i++) {
            table += "<tr><td>" + categories[i] + "</td>";
            for (var j = 0; j < 7; j++) {
                table += "<td><input type='text' id='C" + (i - 1) + "D" + (j + 1) + "' value=' '></td>";
            }
            table += "</tr>";
        }
        $('#categoryTable')[0].innerHTML = table;
    }

    /*intialise category selector */
    function initCat() {
        var options = $('#select-category')[0];
        for (var i = 0; i < categories.length; i++) {
            if (i == 0) {
                options.innerHTML += "<option value='none'>" + categories[i] + "</option>";
            }
            else {
                if (i == 1) {
                    options.innerHTML += "<option value='proj'>" + categories[i] + "</option>";
                }
                else {
                    var val = i - 2;
                    options.innerHTML += "<option value='" + val + "'>" + categories[i] + "</option>";
                }
            }

        }
    }
    /*initialise location table */
    function intitLocation() {
        var table = "<tr>";
        for (var i = 0; i < days.length; i++) {
            table += "<th>" + days[i] + "</th>";
        }
        table += "</tr><tr>";
        for (var i = 0; i < days.length; i++) {
            table += "<td> <select id='select-" + days[i] + "-morning'>";
            for (var j = 0; j < locations.length - 1; j++) {
                table += "<option value='" + locations[j].value + "'>" + locations[j].label + "</option>";
            }
            table += "<option selected value='" + locations[3].value + "'>" + locations[3].label + "</option></select></td>";
        }
        table += "</tr><tr>";
        for (var i = 0; i < days.length; i++) {
            table += "<td> <select id='select-" + days[i] + "-afternoon'>";
            for (var j = 0; j < locations.length - 1; j++) {
                table += "<option value='" + locations[j].value + "'>" + locations[j].label + "</option>";
            }
            table += "<option selected value='" + locations[3].value + "'>" + locations[3].label + "</option></select></td>";
        }
        table += "</tr>";
        $('#locationTable')[0].innerHTML = table;
    }
    initCatTable()
    intitLocation();

    /* change the location to 'N/A' if an absence category is selected */
    $('#select-category').change(function () {
        var category = $('#select-category')[0].options[$('#select-category')[0].selectedIndex].value;
        var nonAbs = ["proj", "2", "14", "21", "22", "23", "24", "25", "26", "39", "40", "44", "47", "48"];
        for (var i = 0; i < days.length; i++) {
            var temp_morn = $('#select-' + days[i] + '-morning')[0];
            var temp_after = $('#select-' + days[i] + '-afternoon')[0];
            for (var j = 0; j < nonAbs.length; j++) {
                if (category == nonAbs[j]) {
                    break;
                }
                else {
                    temp_morn.value = "NA";
                    temp_after.value = "NA";
                }
            }
        }
    });
    /* Save the template */
    $('#submitBtn').click(function () {
        var json = jsonConstructor();
        storeJson(json);
        //location.reload();
    });
    /* Create the JSON with all templates informations */
    function jsonConstructor() {
        var templateName = $('#templateName')[0].value;
        var id = 0;
        //var category = $('#select-category')[0].options[$('#select-category')[0].selectedIndex].value;
        while (localStorage.getItem(id) != null) {
            id++;
        }
        var template = {
            templateName: templateName,
            time: [
                { name: 'tabTime', value: [] },
                { name: 'tabCat', value: [] }
            ],
            location_morn: [],
            location_after: [],
            id: id,
            //category: category
        };
        for (var i = 0; i < days.length; i++) {
            var interTab = [];
            var interTabCat = [];
            for (var j = (-1); j < categories.length - 1; j++) {
                var k = i + 1;
                if ($("#C" + j + "D" + k)[0].value != " ") {
                    interTab.push($("#C" + j + "D" + k)[0].value);
                    interTabCat.push(j);
                }
            }
            template.time[0].value.push(interTab);
            template.time[1].value.push(interTabCat);
            var temp_morn = $('#select-' + days[i] + '-morning')[0];
            var temp_after = $('#select-' + days[i] + '-afternoon')[0];
            template.location_morn.push(temp_morn.options[temp_morn.selectedIndex].value);
            template.location_after.push(temp_after.options[temp_after.selectedIndex].value);
        }
        console.log(template.time[1].value);
        return JSON.stringify(template);
    }
    /* Store the JSON in LocalStorage to keep it saved inside the extension */
    function storeJson(parameter) {
        localStorage.setItem(JSON.parse(parameter).id, parameter)
    }
    /* Display templates in option */
    function displayTemplate() {
        for (var key in localStorage) {
            if (localStorage.getItem(key) != null) {
                disp = $('#templatesSummary')[0];
                disp.innerHTML += "<tr><h2>" + JSON.parse(localStorage.getItem(key)).templateName + "</h2><ul><button value='" + JSON.parse(localStorage.getItem(key)).id + "' id='edit'>edit</button><button value='" + JSON.parse(localStorage.getItem(key)).id + "' id='duplicate'>duplicate</button><button value='" + JSON.parse(localStorage.getItem(key)).id + "' id='delete'>delete</button></ul></tr>";
            }
        }
    }
    /* Run fuction after a click of an edit/delete/duplicate button */
    $('button').click(function (event) {
        if (event.target.id == 'delete') {
            localStorage.removeItem(event.target.value); //Delete function
            location.reload();
        }
        if (event.target.id == 'edit') {
            $('#edit-btn')[0].innerHTML = "<button  id='edit2'>Save</button>"
            editItem(event.target.value);
        }
        if (event.target.id == "duplicate") {
            duplicateItem(event.target.value);
            location.reload();
        }
    });
    /* Edit to modify a template */
    function editItem(param) {
        var tempJson = JSON.parse(localStorage.getItem(param));
        $('#templateName')[0].value = tempJson.templateName;
        $('#select-category')[0].value = tempJson.category;
        for (var i = 0; i < days.length; i++) {
            for (var j = (-1); j < categories.length - 1; j++) {
                var k = i + 1;
                if (tempJson.time[0].value[i][j] != undefined) {
                    $("#C" + j + "D" + k)[0].value = tempJson.time[0].value[i][j];
                }
            }
            var temp_morn = $('#select-' + days[i] + '-morning')[0];
            var temp_after = $('#select-' + days[i] + '-afternoon')[0];
            temp_morn.value = tempJson.location_morn[i];
            temp_after.value = tempJson.location_after[i];
        }
        $('#edit2').click(function () {
            var templateName = $('#templateName')[0].value;
            tempJson.templateName = templateName;
            for (var i = 0; i < days.length; i++) {
                var interTab = [];
                var interTabCat = [];
                for (var j = (-1); j < categories.length - 1; j++) {
                    var k = i + 1;
                    if ($("#C" + j + "D" + k)[0].value != " ") {
                        interTab.push($("#C" + j + "D" + k)[0].value);
                        interTabCat.push(j);
                    }
                }
                tempJson.time[0].value[i] = interTab;
                tempJson.time[1].value[i] = interTabCat;
                var temp_morn = $('#select-' + days[i] + '-morning')[0].value;
                var temp_after = $('#select-' + days[i] + '-afternoon')[0].value;
                tempJson.location_morn[i] = temp_morn;
                tempJson.location_after[i] = temp_after;
                localStorage.setItem(tempJson.id, JSON.stringify(tempJson));
            }
            location.reload();
        });
    }
    /* Duplicate the template */
    function duplicateItem(param) {
        var tempJ = JSON.parse(localStorage.getItem(param));
        tempJ.templateName = tempJ.templateName + "-copy";
        id = 0;
        while (localStorage.getItem(id) != null) {
            id++;
        }
        tempJ.id = id;
        storeJson(JSON.stringify(tempJ));

    }
});