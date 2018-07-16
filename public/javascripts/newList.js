function createNewList() {
    $.ajax({
        url: 'new',
        type: 'GET',
        error(jqXHR, status, errorThrown) {
            console.log(errorThrown);
            return;
        },
        success(data, status, jqXHR) {
            console.log(`New list data:\n${data}`);
            document.getElementById('listCode').value = data[1];
            getList();
            return;
        }
    });
    return;
}

document.getElementById('newListButton').addEventListener('click', createNewList);