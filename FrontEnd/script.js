// Récupération des travaux depuis API 
async function main(){
    const reponse = await fetch('http://localhost:5678/api/works');
    works = await reponse.json();
    generateWorks(works);