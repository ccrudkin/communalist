function creatNewList() {
    $.ajax({
        url: 'newList',
        type: 'GET',
        error(jqXHR, status, errorThrown) {
            console.log(errorThrown);
            return;
        },
        success(data, status, jqXHR) {
            console.log(data);
            // alert and information here
            return;
        }
    });
}

document.getElementById('newListButton').addEventListener('click', createNewList);