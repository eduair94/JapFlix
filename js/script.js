const url = "https://japceibal.github.io/japflix_api/movies-data.json";
let data = [];
let filtered_data = [];

const elements = {
    button: document.querySelector('#btnBuscar'),
    input: document.querySelector('#inputBuscar'),
    search_result: document.querySelector('.list-group-item').cloneNode(true),
    list: document.querySelector('#lista'),
    modal: document.querySelector('.offcanvas'),
    form: document.querySelector('#form_search')
}
// Make search result list visible.
elements.search_result.classList.remove('d-none')

getJSONData(url).then(res=> {
    if(res.status === 'ok') {
        data = res.data;
    }
    elements.button.click();
})


const compare_text = (val, search) => {
    return ` ${val.toLowerCase()}`.includes(search);
}

const compare_genre = (val, search) => {
    return val.some(({name})=> name && ` ${name.toLowerCase()}`.includes(search));
}

const mark_text = (text, mark) => {
    const mRegex = new RegExp(mark, 'gi');
    return text.replace(mRegex, `<span class="bg-warning">${mark}</span>`);
}

const addData = function ({title, overview, genres, budget, revenue, runtime, release_date}, valX){
    const m = elements.modal;
    m.querySelector('.offcanvas-title').innerHTML = mark_text(title, valX);
    m.querySelector('.offcanvas-description').innerHTML = mark_text(overview, valX);
    m.querySelector('.offcanvas-genres span').innerHTML = mark_text(genres.map(({name})=> name).join(' - '), valX);

    m.querySelector('.offcanvas-year').innerHTML = new Date(release_date).getFullYear();
    m.querySelector('.offcanvas-runtime').innerHTML = runtime + ' mins';
    m.querySelector('.offcanvas-budget').innerHTML = '$' + budget
    m.querySelector('.offcanvas-revenue').innerHTML = '$' + revenue
}

const search = (val, add_space = true) => {
    let valueL = val.trim().toLowerCase();
    const valX = valueL;
    if(add_space) {
        valueL = ` ${valueL}`;
    }
    const filtered_data = data.filter(el=> 
        ['title', 'tagline', 'overview']
        .some(key=> el[key] && compare_text(el[key], valueL)) || compare_genre(el.genres, valueL));
    elements.list.innerHTML = '';
    if(!filtered_data.length && add_space) {
        return search(val, false);
    }
    for(const s of filtered_data)  {
        const {title, tagline, vote_average} = s;
        const element = elements.search_result.cloneNode(true);
        element.onclick = function() {
            addData(s, valX);
        };
        element.querySelector('.title').innerHTML = mark_text(title, valX);
        element.querySelector('.tagline').innerHTML = mark_text(tagline, valX);
        const score = Math.round(vote_average * 5 / 10)
        element.querySelectorAll('.stars span').forEach((element, index) => {
            if(index < score) {
                element.classList.add('checked');
            }
        });
        elements.list.appendChild(element);
    } 

}

elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = elements.input.value;
    if(val) {
        search(val);
    } else {
        elements.list.innerHTML = '';
    }
})
