function getList() {
    let listCode = document.getElementById('listCode').value.toUpperCase();
    // for debugging entry
    // console.log(`List code: ${listCode}\nList code length: ${listCode.length}`);

    // AJAX duplicates when using 'shift' key (non-character, still counts as key-up)
    let statusGood = "<img src='/images/check.png' alt='Green check; status good.' >";
    let statusBad = "<img src='/images/x.png' alt='Red check; status bad.' >";

    if (listCode.length === 5) {
        $.ajax({
            url: `/list/${listCode}`,
            type: 'GET',
            error(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                document.getElementById('status').innerHTML = statusBad;
                return;
            },
            success(data, textStatus, jqXHR) {
                // console.log(data);
                if (data.list != null) {
                    document.getElementById('listTitle').innerHTML = data.list.name;
                    document.getElementById('listDisplayCode').innerHTML = `List code: <span id='innerListCode'>${data.list.code}</span>`;
                    document.getElementById('status').innerHTML = statusGood;
                    document.getElementById('listContents').innerHTML = data.list.items;
                    document.getElementById('listFoot').innerHTML = "<button type='button' class='buttonInverse' id='saveListButton'>Save</button>";
                    document.getElementById('saveListButton').addEventListener("click", updateList);
                    return;
                } else {
                    document.getElementById('listTitle').innerHTML = '';
                    document.getElementById('listContents').innerHTML = '';
                    document.getElementById('listFoot').innerHTML = '';
                    document.getElementById('listDisplayCode').innerHTML = '';
                    document.getElementById('status').innerHTML = statusBad;
                    return;
                }
            }
        });
    }
    else {
        document.getElementById('status').innerHTML = ''
        return;
    }
}

function updateList() {
    let updateObj = new Object();
    updateObj['code'] = document.getElementById('innerListCode').innerHTML;
    updateObj['items'] = document.getElementById('listContents').value;

    $.ajax({
        url: '/update',
        type: 'POST',
        data: { 'data': JSON.stringify(updateObj) },
        error(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            return;
        },
        success(data, textStatus, jqXHR) {
            // console.log('Request success.');
            // console.log(`Response data: ${data[1]}`);
            if (data[0] === '1') {
                $('#listFoot').append("<img class='saveStatus' src='/images/check.png' alt='Green check; status good.' >");
                $('.saveStatus').show();
                setTimeout(saveStatus, 2000);
            } else {
                $('#listFoot').append("<img class='saveStatus' src='/images/x.png' alt='Red check; status bad.' >");
                $('.saveStatus').show();
                setTimeout(saveStatus, 2000);
            }
            return;
        }
    });
}

function saveStatus() {
    $('.saveStatus').fadeOut(300, 'swing', () => {
        $('.saveStatus').remove();
    });
}

document.getElementById('listCode').addEventListener('keyup', (event) => {
    if (event.keyCode != '16') {
        getList();
    }
});