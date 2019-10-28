$('.modal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget);
    let modal = $(this);
    let template = `<i class="${$(button).children().attr('class')}"></i> ${$(button).text().trim()}`;
    modal.find('.modal-title').html(template);
});

$('div.modal-footer > button.btn.btn-primary').on('click', function(event){
   
    let button = $('#modalLabel').text().trim();
    let classIcon = 'fa fa-folder';
    let size = '';
    let link = '';

    if(button.includes('File')){
        classIcon = 'fa fa-file-text-o';
        size = '0 B';
        link = 'textEditorSource.html?fileId=0';
    }

    let template = `<tr>
                        <td>
                            <a href="${link}"><i class="${classIcon}" aria-hidden="true"></i> ${$('#name').val()}</a>
                        </td>
                        <td class="txt-r">${size}</td>
                        <td>${new Date().toLocaleDateString()}</td>
                        <td>${$('#message').val()}</td>
                    </tr>`;

    $('table tbody > tr:first').before(template);
    $('#modalCreateFolder').modal('hide');
});