function getList() {
    let listCode = document.getElementById('listCode').value.toUpperCase();
    // for debugging entry
    // console.log(`List code: ${listCode}\nList code length: ${listCode.length}`);

    // AJAX duplicates when using 'shift' key (non-character, still counts as key-up)
    let statusGood = "<img src='/images/check.png' >";
    let statusBad = "<img src='/images/x.png' >";

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
                console.log(data);
                if (data.list != null) {
                    document.getElementById('listTitle').innerHTML = data.list.name;
                    document.getElementById('status').innerHTML = statusGood;
                    document.getElementById('listContents').innerHTML = listFormat(data);
                    document.getElementById('saveListButton').addEventListener("click", updateList);
                    return;
                } else {
                    document.getElementById('listTitle').innerHTML = '';
                    document.getElementById('listContents').innerHTML = '';
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

function listFormat(data) {
    let list = data.list;
    let listHTML = "<div class='listRow listHeading'>" +
            "<span id='item'>Item</span>" +
            '<span id="details">Details</span>' +
            '<span id="claimed">Claimed</span>' +
        '</div>';
    for (item in list.items) {
        listHTML = listHTML +
            "<div class='listRow'>" +
                `<span id='itemID'>${item}</span>` + 
                `<textarea id='item' rows='1'>${list.items[item].name}</textarea>` +
                `<textarea id='details' rows='1'>${list.items[item].details}</textarea>` + 
                `<span id='claimed'>${list.items[item].claimed}</span>` +
            "</div>";
    }

    listHTML = listHTML + "<button type='button' class='buttonInverse' id='saveListButton'>Save</button>"
    return listHTML;
}

function updateList() {
    let children = $('#listContents').children();
    console.log(children);
    let updateObj = new Object();    
    for (let i = 1; i < children.length - 1; i++) {
        console.log(children[i].children[0].innerHTML);
        updateObj[`${children[i].children[0].innerHTML}`] = {
            'name': children[i].children[1].innerHTML,
            'details': children[i].children[2].innerHTML,
            'claimed': children[i].children[3].innerHTML
        };
    }

    $.ajax({
        url: '/update',
        type: 'POST',
        data: updateObj,
        error(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            return;
        },
        success(data, textStatus, jqXHR) {
            console.log('Request success.');
            return;
        }
    });
}

document.getElementById('listCode').addEventListener('keyup', (event) => {
    if (event.keyCode != '16') {
        getList();
    }
});