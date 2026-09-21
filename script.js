const searchbox = document.querySelector(".searchbox")

const search = document.querySelector(".search")
const bookmark = document.querySelector(".bookmark")
const random = document.querySelector(".dice")
const menu = document.querySelector(".menu")
const recipes=document.querySelector(".recipes")
const aboutrecipe=document.querySelector(".aboutrecipe")

const categories=document.querySelector(".categorie-menu")

//saving bookmark in local storage
function SaveBookmark(recipe){
    let Savedrecipe=JSON.parse(localStorage.getItem("bookmarks"));
    if(Savedrecipe===null){
        Savedrecipe=[];
    }
    Savedrecipe.push(recipe);
    localStorage.setItem("bookmarks", JSON.stringify(Savedrecipe));
} 

//creating recipe card
function createrecipecard(element){
    const card=document.createElement("div")
    const detailimage=document.createElement("img")
    const detailname=document.createElement("h2")

    card.classList.add("recipe-card");

    detailimage.src=element.strMealThumb;
    detailimage.classList.add("recipe-image");

    detailname.textContent=element.strMeal;
    detailname.classList.add("recipe-name");

    card.appendChild(detailimage);
    card.appendChild(detailname);

    recipes.appendChild(card);

    card.addEventListener("click", ()=>{
        showrecipedetails(element);
    })
}

//Show recipe details
function showrecipedetails(element){
    //hide recipe grid
    recipes.style.display = "none";

    //show recipe details
    aboutrecipe.style.display="flex";

    //clearing previous details
    aboutrecipe.innerHTML="";
            
    //creating new name 
    const recipedetailname=document.createElement("h2");
    recipedetailname.textContent=element.strMeal;
    recipedetailname.classList.add("recipe-name");

    //creating new image
    const recipedetailimage=document.createElement("img");
    recipedetailimage.src=element.strMealThumb;
    recipedetailimage.classList.add("recipe-image");

    //creating seperate div for name and image
    const imagecontainer=document.createElement("div");
    imagecontainer.classList.add("image-container");


    //instructions card
    const instructionscard=document.createElement("div");
    instructionscard.classList.add("instruction-card")

    //instructions
    const instructionstitle=document.createElement("h3");
    instructionstitle.classList.add("instructions-title");
    instructionstitle.textContent="Instructions:";
    const instructions=document.createElement("p");
    instructions.classList.add("recipe-instructions");
    instructions.textContent=element.strInstructions;

    //ingrediants
    const ingrediantstitle=document.createElement("h3");
    ingrediantstitle.classList.add("ingredients-title");
    ingrediantstitle.textContent="Ingrediants:";

    const ingrediants=document.createElement("p");
    ingrediants.classList.add("recipe-ingrediants")
    for(let i=1; i<=20; i++){
        const ingrediant=element[`strIngredient${i}`];
        const measure=element[`strMeasure${i}`];

        if(ingrediant && ingrediant.trim()!==""){
            ingrediants.textContent+=`${measure} ${ingrediant}, `;
        }
    }
    //creating a div for fav and button
    const favandbutton=document.createElement("div");
    favandbutton.classList.add("fav-and-button");

    //creating a starbutton
    const star=document.createElement("span");
    star.classList.add("material-symbols-outlined");
    star.classList.add("star-icon");
    star.textContent="star";

    if(isBookmarked(element)){
        star.classList.add("saved");
    }

    star.addEventListener("click", (event)=>{
        event.stopPropagation();
        if(isBookmarked(element)){
            RemoveBookmark(element);
            star.classList.remove("saved");
        } else{
            SaveBookmark(element);
            star.classList.add("saved");
        }
        
    })

    //creating a button
    const backbutton=document.createElement("button");
    backbutton.classList.add("back-button");
    backbutton.innerHTML="back";

    //appending all in the instruction card
    imagecontainer.appendChild(recipedetailname);
    imagecontainer.appendChild(recipedetailimage);
    instructionscard.appendChild(imagecontainer);
    instructionscard.appendChild(ingrediantstitle);
    instructionscard.appendChild(ingrediants);
    instructionscard.appendChild(instructionstitle);
    instructionscard.appendChild(instructions);
    favandbutton.appendChild(star);
    favandbutton.appendChild(backbutton);
    aboutrecipe.appendChild(instructionscard);
    aboutrecipe.appendChild(favandbutton);

    backbutton.addEventListener("click", ()=>{
        aboutrecipe.style.display="none";
        recipes.style.display="grid";
    });

}

//Getting bookmarks from local storage
function getBookmarks(){
    let SavedRecipe=JSON.parse(localStorage.getItem("bookmarks"));
    if(SavedRecipe===null||SavedRecipe.length===0){
        return;
    }
    SavedRecipe.forEach(recipe=>{
        createrecipecard(recipe);
    })
}

async function getData(){
    const mealName=searchbox.value;
    const url=`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
    const response=await fetch(url);
    const data=await response.json();

    recipes.innerHTML="";

    data.meals.forEach(element => {
        createrecipecard(element);
    });

}

function RemoveBookmark(element){
    let savedrecipe=JSON.parse(localStorage.getItem("bookmarks"));

    if(savedrecipe===null){
        return;
    }
    savedrecipe=savedrecipe.filter(item=>item.idMeal!==element.idMeal);
    localStorage.setItem("bookmarks", JSON.stringify(savedrecipe));
}

function isBookmarked(element){
    let savedrecipe=JSON.parse(localStorage.getItem("bookmarks"));

    if(savedrecipe===null){
        return false;
    }

    return savedrecipe.some(item=>item.idMeal===element.idMeal);
}

search.addEventListener("click", ()=>{
    if(searchbox.value.trim()===""){
        alert("Enter the Item");
        return;
    }
    getData();
})  

bookmark.addEventListener("click", ()=>{
    recipes.innerHTML="";
    if(!isBookmarked){
        recipes.innerHTML="There is no Bookmarks yet!"
    }
    aboutrecipe.style.display="none";
    recipes.style.display="grid";
    
    getBookmarks();
})

//random item

async function randomitem(recipe){

    const url=`https://www.themealdb.com/api/json/v1/1/random.php`;
    const response=await fetch(url);
    const data=await response.json();

    const randomIndex=Math.floor(Math.random()*data.meals.length);
    const randomrecipe=data.meals[randomIndex];
    recipes.innerHTML="";
    recipes.classList.add("random-layout");
    createrecipecard(randomrecipe);

}

random.addEventListener("click", ()=>{
    randomitem();
})

//categories

async function getcategories(){
    recipes.innerHTML = "";
    categories.innerHTML="";

    const url= "https://www.themealdb.com/api/json/v1/1/categories.php";
    const response=await fetch(url);
    const data=await response.json();
    
    data.categories.forEach((category) => {
        const li=document.createElement("li");
        li.classList.add("li");
        li.textContent=category.strCategory;
        console.log(li.textContent);
        categories.appendChild(li)
    })
    console.log(data);
}

menu.addEventListener("click", ()=>{
    if(categories.style.display==="block"){
        categories.style.display="none";
    }else{
        getcategories();
        categories.style.display="block";
    }
})