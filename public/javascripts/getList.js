function getList() {
    let listCode = document.getElementById('listCode').value;

    console.log(`List code: ${listCode}\nList code length: ${listCode.length}`);

    if (listCode.length === 5) {
        $.ajax({
            url: `/list/${listCode}`,
            type: 'GET',
            error(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                document.getElementById('statusBad').innerHTML = 'X';
                document.getElementById('statusGood').innerHTML = '';
            },
            success(data, textStatus, jqXHR) {
                document.getElementById('listTitle').innerHTML = data.title;
                document.getElementById('statusGood').innerHTML = 'OK'
                document.getElementById('statusBad').innerHTML = '';
            }
        });
    }
    else {
        return;
    }
}


document.getElementById('listCode').addEventListener('keyup', getList);