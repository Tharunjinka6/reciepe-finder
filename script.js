const searchbox = document.querySelector(".searchbox")

const search = document.querySelector(".search")
const bookmark = document.querySelector(".bookmark")
const random = document.querySelector(".dice")
const menu = document.querySelector(".menu")
const recipes=document.querySelector(".recipes")

async function getData(){
    const mealName=searchbox.value;
    const url=`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
    const response=await fetch(url);
    const data=await response.json();

    recipes.innerHTML="";

    data.meals.forEach(element => {
        const image=document.createElement("img")
        image.src=element.strMealThumb;
        recipes.appendChild(image)
    });

}

search.addEventListener("click", ()=>{
    getData();
})  