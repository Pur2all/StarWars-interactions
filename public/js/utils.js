function htmlDecode(input)
{
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

//Funzioni che riguardano la paginazione
function spawnPagination(size)
{
  if(size <= 0){return;}
  numbOfPages = 0;
  if(size <= 6)
    numbOfPages = 1;
  else
    numbOfPages = Math.floor(size/6);
  const paginator = document.getElementById("paginator");
  htmlCodeForPaginator = '<li class="page-item disabled"> <a class="page-link" onclick="prevPage();" tabindex="-1">Precedente</a></li>';
  for(i = 0; i < numbOfPages; i++)
  {
    if(i == 0)
      htmlCodeForPaginator+='<li class="page-item active"><a class="page-link" onclick="setPage(1)";>1</a></li>';
    else
      htmlCodeForPaginator+='<li class="page-item"><a class="page-link" onclick="setPage('+(i+1)+');">'+(i+1)+'</a></li>';  
  }
  if(numbOfPages == 1)
    htmlCodeForPaginator += '<li class="page-item disabled"><a class="page-link" onclick="nextPage();" tabindex="-1">Successivo</a></li>';
  else
    htmlCodeForPaginator += '<li class="page-item"> <a class="page-link" onclick="nextPage();" tabindex="-1">Successivo</a></li>';
  paginator.innerHTML = htmlCodeForPaginator;
}

//Ancora da implementare sono la logica del paginatore
function nextPage()
  {
    //Individuare il numero di pagina
    count = 6*(numPage-1);
    films.forEach(element => 
    {
      console.log(element)
    }); 
    filmsStringHTML = '';
    return filmsStringHTML;
  }
  function prevPage()
  {

  }
  function setPage(numPage)
  {

  }