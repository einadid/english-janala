const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => displayLesson(json.data))
}
// console.log(url);

const loadLevelWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => displayLevelWord(data.data))
}
const displayLevelWord = (words) => {
    const wordContainter = document.getElementById("word-container")
    wordContainter.innerHTML = ""

    // {
    //     "id": 53,
    //     "level": 3,
    //     "word": "Candid",
    //     "meaning": "খোলামেলা / স্পষ্টবাদী",
    //     "pronunciation": "ক্যান্ডিড"
    // }

    words.forEach(word => {
        console.log(word);

        const card = document.createElement("div")
        card.innerHTML = `
        <div class="bg-white p-8 rounded-lg shadow-lg text-center w-[500px] max-w-sm  ">
    <h1 class="text-4xl font-bold mb-4">${word.word}</h1>
    <p class="text-gray-600 font-semibold mb-6">Meaning /Pronunciation</p>
    <p class="text-2xl font-semibold mb-8 font-bangla">${word.meaning} / ${word.pronunciation}</p>
    <div class="flex justify-between items-center">
      <button class=" btn bg-blue-100 text-blue-800 p-3 rounded-xl flex items-center justify-center w-12 h-12 
        hover:bg-blue-800 hover:text-white">
  <i class="fa-solid fa-circle-info"></i>
</button>

      <button class="btn bg-blue-100 text-blue-800 p-3 rounded-xl flex items-center justify-center w-12 h-12 
        hover:bg-blue-800 hover:text-white"><i class="fa-solid fa-volume-high"></i></button>
    </div>
  </div>
        `;
        wordContainter.append(card);


    });
}

const displayLesson = (lessons) => {
    // 1. get the container & empty
    const levelContainer = document.getElementById("level-container");
    // 2. get into every lessons
    for (let lesson of lessons) {
        // 3. craete element 
        console.log(lessons)
        const btnDiv = document.createElement("div")
        btnDiv.innerHTML = `
        <button  onclick="loadLevelWord('${lesson.level_no}')" class="btn btn-outline btn-primary">
              <i class="fa-solid fa-book-open"></i> Learn - ${lesson.level_no}
            </button>
        `;

        // 4. append into container
        levelContainer.append(btnDiv)
    }

};

loadLessons();
