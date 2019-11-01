let wwEndpoint = {
    init: () => {

        //document.querySelector('#btnMainSearch').removeEventListener('click', mainSearch);
        //if (typeof wwEndpoint === "function") document.querySelector('#btnMainSearch').removeEventListener('click', wwEndpoint.search);
        //document.querySelector('#btnMainSearch').addEventListener('click', wwEndpoint.search);
        //document.querySelector('#btnEndpointCancelar').addEventListener('click', wwEndpoint.clear ,false);
        //document.querySelector('#btnEndpointNovo').addEventListener('click', wwEndpoint.clear ,false);
        //document.querySelector('#sizeEndpoint').addEventListener('change', wwEndpoint.search ,false);
        //document.querySelector('#paginationEndpoint').addEventListener('click', wwEndpoint.setPage, false);
        document.querySelector('#tableEndpoint > tbody').addEventListener('click', wwEndpoint.delete ,false);
        document.querySelector('#tableEndpoint > tbody').addEventListener('click', wwEndpoint.edit ,false);
        //document.querySelector('#btnEndpointGravar').addEventListener('click', wwEndpoint.sendEdit, false);

        document.querySelectorAll('thead tr th').forEach(th => {
            th.addEventListener('click', wwEndpoint.setSort, false);
        });
        wwEndpoint.search(null);        
    },
    sortDirection: "id,asc",
    setSort: (event) => {
        let th = event.target.closest('th');
        let thDataColumn = th.getAttribute('data-column');
        let sortFieldName = _.snakeCase(thDataColumn);
        let sortDirection;
        if(th.firstElementChild.classList.contains('fa-sort')){
            sortDirection = "asc";
            th.firstElementChild.classList.remove('fa-sort');
            th.firstElementChild.classList.add('fa-sort-asc');
        }else if(th.firstElementChild.classList.contains('fa-sort-desc')){
            sortDirection = "asc";
            th.firstElementChild.classList.remove('fa-sort-desc');
            th.firstElementChild.classList.add('fa-sort-asc');
        }else if(th.firstElementChild.classList.contains('fa-sort-asc')){
            sortDirection = "desc";
            th.firstElementChild.classList.remove('fa-sort-asc');
            th.firstElementChild.classList.add('fa-sort-desc');
        }
        wwEndpoint.sortDirection = sortFieldName+","+sortDirection;
        wwEndpoint.search();
    },
    clear: (event) => {
        event.preventDefault();
        wwEndpoint.tr = null;
        wwEndpoint.item = null;
        document.querySelector('#formEndpoint').reset(); 
        document.querySelector("#rowFormEndpoint").classList.remove('bg-light');
        document.querySelector('#mainSearch').focus();
    },
    delete: (event) => {
        event.preventDefault();
        wwEndpoint.tr = event.target.closest('tr');
        let el = event.target.classList.contains('fa-trash');
        if(el){
            alert('remover.....');
        }
    },
    edit: (event) => {
        //debugger;
        event.preventDefault();
        $('#editar-tab').click();
        wwEndpoint.tr = event.target.closest('tr');
        let el = event.target.classList.contains('fa-pencil-square-o');
        let chk = '';
        if(el){
            if(isDate(_.trim(wwEndpoint.tr.children[2].textContent), 'dd/MM/yyyy')){
                chk = 'DISABLED';
            }
            wwEndpoint.item = {
                wwEndpointId: wwEndpoint.tr.children[0].textContent,
                wwEndpointDescr: wwEndpoint.tr.children[1].textContent,
                wwEndpointDisabled: chk
            };
            if(wwEndpoint.item){
               // wwStart.populate(document.querySelector('#formEndpoint'), wwEndpoint.item);
            }
            //document.querySelector("#rowFormEndpoint").classList.add('bg-light');
        }
    },
    sendEdit: (event) => {
        event.preventDefault();
        let id = document.querySelector('#wwEndpointId');
        let descr = document.querySelector('#wwEndpointDescr');
        let disabled = document.querySelector('#wwEndpointDisabled');
        let method = 'PUT';
        let url = `http://localhost:3000/data/endpoints/${id.value}`;
        let json = {
            id: id.value,
            descr: descr.value,
            disabled: formatDate(new Date(), 'dd/MM/yyyy')
        };
        if(!id.value){
            delete json['id'];
            method = 'POST';
            url = `http://localhost:3000/data/endpoints`;
        }
        if(!descr.value){
            alert('Descrição é requerida!');
            descr.focus();
            return false;
        }
        if(!disabled.checked){
            delete json['disabled'];
        }
        fetch(url, { 
            method: method,
            headers: wwStart.headers,
            body: JSON.stringify(json)
        }).then(response => {
            return response.json();            
        }).then(response => {
            let disabled = '';
            if(response.disabled){
                disabled = response.disabled;
            } 
            if(wwEndpoint.tr){
                wwEndpoint.tr.children[1].textContent = response.descr;
                wwEndpoint.tr.children[2].textContent = disabled;
            }else{
                wwEndpoint.search(event, '%'); 
            }
            wwEndpoint.tr = null;
            //document.querySelector('#btnEndpointCancelar').click();
            document.querySelector('#formEndpoint').reset(); 
            wwEndpoint.clear(event);    
        });
    },
    search: (event) => {
        //debugger;
        let descr = document.querySelector('#endpointSearch').value;
        if(!descr) descr = '%';
        if(!descr){
            alert(`Preencha algum valor para uma pesquisa valida!`);
            return false;
        }
        let url = 'http://localhost:3000/source/data/endpoints/pageable.json';
        // OK -encodeURI(url) client side
        //url += '?descr='.concat(encodeURI(descr));
        //url += '&size='.concat(document.querySelector('#sizeEndpoint').value);
        //url += '&page='.concat(wwEndpoint.page);
        //url += '&sort='.concat(wwEndpoint.sortDirection);

        fetch(url, { 
            method: 'GET',
            headers: {
                "Authorization": "Basic YWxhZGRpbjpvcGVuc2VzYW1l",
                "Content-Type": "application/json"
            }
        }).then(response => {
                return response.json();            
        }).then(response => {
            return wwEndpoint.list = response;
        }).then(data => {
            let options = {
                data: data, 
                page: wwEndpoint.page, 
                tabId: '#tableEndpoint', 
                pageId: '#paginationEndpoint'
            };
            wwDataTable.setTable(options);
            wwEndpoint.options = options;
        });
    },
    options: null,
    tr: null, 
    item: {},
    setPage: (event) => {
        if(event.target.nodeName=='UL'){
            return false;
        }
        if(event.target.text=="Anterior"){
            let prev = 0;
            if((wwEndpoint.page-1) > 0){
                prev = (wwEndpoint.page-1) ;
            }
            wwEndpoint.page = prev;
            wwEndpoint.search(event);
            return;
        }
        if(event.target.text=="Próximo"){
            let next = wwEndpoint.page;
            if((wwEndpoint.page+1) < wwEndpoint.options.data.totalPages){
                next = (wwEndpoint.page+1)  ;
            }
            wwEndpoint.page = next;
            wwEndpoint.search(event);
            return;
        }
        wwEndpoint.page = new Number(event.target.text)-1;
        wwEndpoint.search(event);
    },
    page: 0,
    list: []
};
//wwEndpoint.init();