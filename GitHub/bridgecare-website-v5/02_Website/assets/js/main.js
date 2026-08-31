const menuButton=document.querySelector('.menu-btn');
const navLinks=document.querySelector('.nav-links');
if(menuButton&&navLinks){menuButton.addEventListener('click',()=>navLinks.classList.toggle('open'));}
const searchForm=document.querySelector('[data-search-form]');
if(searchForm){searchForm.addEventListener('submit',(e)=>{e.preventDefault();const q=new FormData(searchForm).get('q');alert(q?`Search prototype: ${q}`:'Enter a health topic, ingredient or product.');});}
