// ****************************************
// Return the nth instance of a substring
// ****************************************
function GetSubstringIndex(str, substring, n) {
    var times = 0, index = null;
    while (times < n && index !== -1) {
        index = str.indexOf(substring, index+1);
        times++;
    }
    return index;
}

// ****************************************
// Update the meta fields
// ****************************************
function updateMeta() {
    // Eyes wide open for this giant hack. I'm reading the metric HTML (converted from
    // markdown in build process) and pulling substrings out to place on the page via
    // ill-advised lefty-righty kind of crap. I should probably be beaten for this.
    // Given the proclivity of the project partners to edit the metadata nearly
    // continuously for years, markdown made the most sense, and to process the result
    // into my various buckets requires this kind of hacky stuff. Needless to say you'll
    // need to update this if you screw with the metadata markdown layout at all.
    $.ajax({
        url: 'data/meta/' + $("#metric").val() + '.html',
        type: 'GET',
        dataType: 'text',
        success: function (data) {
            $('.meta-subtitle').html(
                data.substring(GetSubstringIndex(data, '</h2>', 1) + 5, GetSubstringIndex(data, '<h3', 1))
            );
            $('.meta-important').html(
                data.substring(GetSubstringIndex(data, '</h3>', 1) + 5, GetSubstringIndex(data, '<h3', 2))
            );
            $('.meta-about').html(
                data.substring(GetSubstringIndex(data, '</h3>', 2) + 5, GetSubstringIndex(data, '<h3', 3))
            );
            $('.meta-resources').html(
                data.substring(GetSubstringIndex(data, '</h3>', 3) + 5, data.length)
            );

            // make meta tables (jesus tables really?) from markdown get the bootstrap table class
            $('.meta-container table').addClass('table table-condensed');
        },
        error: function (error, status, desc) {
            //console.log(status, desc);
        }
    });

}
