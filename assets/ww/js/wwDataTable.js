/*
*** HTML TABLE MODEL ***
<table id="ltsIdentificacao" class="table table-sm nowrap mt-2" style="width: 100%">
    <thead>
        <tr>
            <th data-column="id">Matrícula</th>
            <th data-column="nome">Nome/Empresa</th>
            <th data-column="CPF">CPF/CNPJ</th>
            <th data-column="dataNascimento">Dt. Nascimento</th>
            <th data-column="telefone">Telefone</th>
        </tr>
    </thead>
    <tbody></tbody>
</table>
*/
let wwDataTable = {
    //options = {data, page, tabId, pageId}
    setTable: (options) => {

        let table = document.querySelector(options.tabId);
        let theadTr = document.querySelector(options.tabId.concat(' > thead > tr'));
        let tbody =  document.querySelector(options.tabId.concat(' > tbody'));
        
        //LIMPA TABELA A CADA PESQUISA
        wwDataTable.clearTable(options);

        //VALIDA EXISTÊNCIA DE CONTEÚDO
        if(!options.data.totalElements){
            //alertify.message('Nenhum registro encontrado!');
            return false;
        }

        options.data.content.forEach(keyValue => {
            let tr = document.createElement('tr');
            wwDataTable.setTheadTr(theadTr, keyValue, tr);
            tbody.appendChild(tr);
        });
        if(options.pageId && new Number(options.data.totalPages)>0){ 
            let total = new Number(options.data.totalPages);
            let objPagination = document.querySelector(options.pageId);
            objPagination.innerHTML = "";
            //for(let i=0; i<new Number(options.data.totalPages); i++){
            //   if(i<21){
            //        wwDataTable.setPageBtn(objPagination, options, i);
            //    }
            //}
            //wwDataTable.__setPagination(objPagination, options); 
            console.log("options.data.first "+options.data.first);
            console.log("options.data.last "+options.data.last );
            console.log("options.data.number "+options.data.number );
            console.log("options.data.size "+options.data.size );
            console.log("options.data.totalElements "+options.data.totalElements);
            console.log("options.data.totalPages "+options.data.totalPages );
            console.log("options.page "+options.page );
            $(options.pageId).pagination({
                pages: options.data.totalPages,
                currentPage: options.data.number,
                ellipsePageSet: false,
                prevText: "Anterior",
                nextText: "Próximo"
            });
            
        }
    },
    setTheadTr: (theadTr, keyValue, tr) => {
        for(let th in theadTr.cells){
            if (theadTr.cells[th] instanceof HTMLElement){
                //debugger;
                let colDetail = theadTr.cells[th].getAttribute("data-detail");
                let colName = theadTr.cells[th].getAttribute('data-column'); 
                let colAlias = theadTr.cells[th].getAttribute('data-alias');
                let colMask = theadTr.cells[th].getAttribute('data-mask'); 
                let colLimit = theadTr.cells[th].getAttribute('data-limit'); 
                let colIcon = theadTr.cells[th].getAttribute('data-icon');
                let colImg = theadTr.cells[th].getAttribute('data-image');
                let colOptions = {
                    mask: colMask,
                    limit: colLimit,
                    icons: colIcon,
                    alias: colAlias,
                    detail: colDetail,
                    image: colImg
                }; 
                if(colOptions.icons){
                    let icons = colOptions.icons.split(',');
                    wwDataTable.__setTdIcons(icons, tr);
                }else if(colOptions.image){
                    // - TODO ---------------------
                    // - IMAGE IN TABLE
                    // - IMAGE PREVIEW ON MOUSEOVER
                    // ----------------------------
                    wwDataTable.__setTdImage(keyValue, colOptions.image, tr);
                }else{   
                    for(let key in keyValue) {
                        if(colName == key){  
                            if(colOptions.alias) {                                    
                                colName = colAlias;
                            }  
                            let value = wwDataTable.setMask(jsonPath(keyValue, colName)[0] , colOptions);
                            wwDataTable.__setTdValue(colOptions, value, tr, keyValue);
                        }
                    }
                }
            }
        }
    },
    clearTable: (options) => {
        document.querySelectorAll(options.tabId.concat(' > tbody tr')).forEach((row) => {
            row.remove();
        });
    },
    __setTdIcons:(icons, tr) => {
        let td = document.createElement('td');            
        td.setAttribute('class', 'text-nowrap text-right');
        for(let i=0; i<icons.length; i++){        
            let iTag = wwDataTable.__getTableIcon(icons[i]);
            td.appendChild(iTag);
        }
        tr.appendChild(td);
    },
    __setTdImage: (keyValue, xPath, tr) => {
 
        let obj = jsonPath(keyValue, xPath)[0];
        let td = document.createElement('td');            
            td.setAttribute('class', 'text-nowrap text-left');
        let img = document.createElement('img');
            img.setAttribute('class', 'img-in-table zoom');
            img.setAttribute('src', obj.path.concat(obj.name));
        td.appendChild(img);
        tr.appendChild(td);

    },
    __setTdValue: (colOptions, value, tr, keyValue) => {
        //debugger;
        let i = document.createElement('i');
            i.setAttribute('class', 'fa fa-plus text-info');
            i.setAttribute('aria-hidden', true);
            i.setAttribute('onclick', 'wwDataTable.togleDetail(this)');
            //i.setAttribute('style', 'color:green');
        let txt = document.createTextNode(" "+wwDataTable.__setLimit(colOptions, value));
        let td = document.createElement('td');
            td.setAttribute('title', value);
            td.setAttribute('class', 'text-nowrap');

        let ArrDet = null;
        let brandContent = null;

            if(colOptions.detail){
                ArrDet = colOptions.detail.split(',');
                brandContent = jsonPath(keyValue, ArrDet[0]);
            }
            if(brandContent){                
                let div = document.createElement('div');
                let spanContent = document.createTextNode(ArrDet[1]+': ');
                let span = document.createElement('span');
                    span.setAttribute('class', 'font-weight-bold');
                    span.appendChild(spanContent);                
                let divContent = document.createTextNode(brandContent);
                    div.setAttribute('class', 'el-hide div-detail');
                    div.appendChild(span);
                    div.appendChild(divContent);
                td.appendChild(i); 
                td.appendChild(txt); 
                td.appendChild(div);                
            }else{
                td.appendChild(txt); 
            }
        tr.appendChild(td);
    },
    __getTableIcon: (icon) => {
        let fa = 'fa-bug';
        switch(icon){
            case '_TRASH':
                fa = 'fa-trash';
                break;
            case '_EDIT':
                fa = 'fa-pencil-square-o';
                break;
            case '_ANCHOR':
                fa = 'fa-anchor';
                break;
            case '_IMG':
                fa = 'fa-pencil-square';
                break;
        }
        let i = document.createElement('i');
            i.setAttribute('class', 'ml-3 fa fa-lg '+fa);
            i.setAttribute('aria-hidden', true);
        return i;
    },
    togleDetail: (i) => {
        let div = i.nextSibling.nextSibling;
        i.classList.toggle('fa-minus');
        div.classList.toggle('el-hide');
    },
    getBtn: (i, label, objPagination, options) => {

        let li = document.createElement('li');
        
        if((label)==new Number(options.page)+1){
            li.setAttribute('class', 'page-item active');
        }else{
            li.setAttribute('class', 'page-item');
        }

        let a = document.createElement('a');
            a.setAttribute('class', 'page-link');
            a.setAttribute('href', '#');
        let aNumber = document.createTextNode(label);

        a.appendChild(aNumber);
        li.appendChild(a);
        objPagination.appendChild(li);
    },
    __setPagination: (objPagination, options) => {
        /*
            - Limpar objPagination;
            - [ << ][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ ... ][ >> ]
        */
        objPagination.innerHTML = "";
        /*
        Label deve ter lógica para navegar pela numeração entre posições fixas 1 ~ 5.
        Ao clicar em quinta posição somar mais 4 à cada posição, ex.:

        */
        for(let i=0; i<8; i++){
            if(i==0){
                //[ << ] - Se Pg. atual igual a 1 desativado, senão ativado => Primeira;
                wwDataTable.getBtn(i, "<<", objPagination, options);
            }
            if(i>0 && i<6){
                //DE 1 ~ 5 - Active posicional, manter posição cental preferencialmente em Active               
                wwDataTable.getBtn(i, (i + new Number(options.page)), objPagination, options);
                if(i + new Number(options.page)==options.data.totalPages) return;
            }
            if(i==6){
                //... - Sempre desativado, apenas um separador
                wwDataTable.getBtn(i, "...", objPagination, options);
            }
            if(i==7){
                // >> - se pg atual for a última desativado
                wwDataTable.getBtn(i, ">>", objPagination, options);
            }
        }          
    },
    __setLimit: (colOptions, str) => {
        //LIMIT
        if(colOptions.limit){
            if(str.length > new Number(colOptions.limit)){
                str = str.slice(0, colOptions.limit).concat('...');
            }
        }
        return str;
    },
    setMask: (value, colOptions) => {
        let str = new String(value);
        let mask = colOptions.mask;

        //NULL
        if(!value){
            return "";
        }

        //MASK
        if(mask){
            switch(mask){
                case 'TELEFONE':
                    if(str.length==11) mask = '(00) 00000-0000';
                    if(str.length==9) mask = '00000-0000';
                    if(str.length==10) mask = '(00) 0000-0000';
                    if(str.length==8) mask = '0000-0000';
                    break;
                case 'CPF_CNPJ': //184.840.038-17
                    if(str.length>11) mask = '00.000.000/000-00';
                    if(str.length<=11) mask = '000.000.000-00';
                    break;
                case 'RG_IE': //20.330.138-8
                    mask = '00.000.000-0';
                    break;
            }

            var formatter = new StringMask(mask, {reverse: true});
            return formatter.apply(str);
        }

        return new String(str);
    }
};