// সব লেসন লোড করা
const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => displayLesson(json.data))
}

const manageSpinner = (status) => {
    if (status == true) {
        document.getElementById("spinner").classList.remove("hidden")
        document.getElementById("word-container").classList.add("hidden")
    } else {
        document.getElementById("word-container").classList.remove("hidden")
        document.getElementById("spinner").classList.add("hidden")
    }
}

// active class রিমুভ করা
const remoevActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn")
    lessonButtons.forEach(btn => btn.classList.remove("active"))
}

// নির্দিষ্ট লেভেলের word লোড করা
const loadLevelWord = (id) => {
    manageSpinner(true)
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            remoevActive()
            const clickBtn = document.getElementById(`lesson-btn-${id}`)
            if (clickBtn) {
                clickBtn.classList.add("active")
            }
            displayLevelWord(data.data)
        })
}

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url);
    const details = await res.json()
    displayWordSetails(details.data)
}

const displayWordSetails = (word) => {
    console.log(word)

    // synonyms কে dynamic বানাই
    let synonymsHTML = "";
    if (word.synonyms && word.synonyms.length > 0) {
        word.synonyms.forEach(syn => {
            synonymsHTML += `<span class="btn m-1">${syn}</span>`;
        });
    } else {
        synonymsHTML = `<p class="text-gray-500">কোন সমার্থক শব্দ পাওয়া যায় নি</p>`;
    }

    const detailsBox = document.getElementById("details-container")
    detailsBox.innerHTML = `
      <div class="mb-4">
        <h2 class="font-bold text-2xl">${word.word} 
            (<i class="fa-solid fa-microphone"></i> : ${word.pronunciation})
        </h2>
      </div>

      <div class="mb-4">
        <h2 class="font-bold">Meaning</h2>
        <p class="font-bangla">${word.meaning}</p>
      </div>

      <div class="mb-4">
        <h2 class="font-bold">Example</h2>
        <p>${word.sentence}</p>
      </div>

      <div class="mb-4">
        <h2 class="font-bangla font-semibold">সমার্থক শব্দ গুলো</h2>
        ${synonymsHTML}
      </div>
    `;

    document.getElementById("word_modal").showModal()
}


// word গুলো দেখানো
const displayLevelWord = (words) => {
    const wordContainter = document.getElementById("word-container")
    wordContainter.innerHTML = ""

    if (!words || words.length === 0) {
        wordContainter.innerHTML = `
            <div class="font-bangla text text-center col-span-full my-16">
                <img class="mx-auto mb-5" src="./assets/alert-error.png" alt="">
                <p class="text-gray-600 text-xl">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h1 class="font-bangla font-semibold mt-5 text-4xl">নেক্সট Lesson এ যান</h1>
            </div>
        `
        manageSpinner(false)
        return;
    }

    words.forEach(word => {
        const card = document.createElement("div")
        card.innerHTML = `
            <div class="bg-white p-8 rounded-lg shadow-lg text-center w-[500px] max-w-sm">
                <h1 class="text-4xl font-bold mb-4">${word.word ? word.word : "শব্দ পাওয়া যায় নি"}</h1>
                <p class="text-gray-600 font-semibold mb-6">Meaning / Pronunciation</p>
                <p class="text-2xl font-semibold mb-8 font-bangla">
                    ${word.meaning ? word.meaning : "অর্থ পাওয়া যায় নি"} / 
                    ${word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায় নি"}
                </p>
                <div class="flex justify-between items-center">
                    <button onclick= "loadWordDetail(${word.id})" class="btn bg-blue-100 text-blue-800 p-3 rounded-xl flex items-center justify-center w-12 h-12
                        hover:bg-blue-800 hover:text-white">
                        <i class="fa-solid fa-circle-info"></i>
                    </button>
                    <button class="btn bg-blue-100 text-blue-800 p-3 rounded-xl flex items-center justify-center w-12 h-12
                        hover:bg-blue-800 hover:text-white">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
            </div>
        `;
        wordContainter.append(card);
    });
    manageSpinner(false)
}

// লেসন বাটন দেখানো
const displayLesson = (lessons) => {
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "" // আগের ডাটা ক্লিয়ার

    lessons.forEach(lesson => {
        const btnDiv = document.createElement("div")
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" 
                onclick="loadLevelWord('${lesson.level_no}')"
                class="btn btn-outline btn-primary lesson-btn">
                <i class="fa-solid fa-book-open"></i> Learn - ${lesson.level_no}
            </button>
        `;
        levelContainer.append(btnDiv)
    })
}



// প্রথমে সব লোড করো
loadLessons();


document.getElementById("btn-search").addEventListener("click", () => {
    remoevActive()
    const input = document.getElementById("input-search")
    const searchValue = input.value.trim().toLowerCase()

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then(res => res.json())
        .then(data => {
            const allWords = data.data
            console.log(allWords)
            const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue)
            )
            displayLevelWord(filterWords)
        })

})