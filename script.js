
/* =========================================
   FITTOGETHER
   Geen localStorage: gegevens worden niet
   bewaard nadat de pagina wordt ververst.
========================================= */


/* =========================================
   GEGEVENS
========================================= */

let userName = "";
let userSport = "";

let friends = [
    { name: "Vriend 1", sport: "Fitness" },
    { name: "Vriend 2", sport: "Hardlopen" }
];

let activities = [];
let completedActivities = 0;
let streak = 0;
let joinedChallenges = 0;

let plannedMeals = [];
let joinedChallengeIds = [];


/* =========================================
   SCHERM WISSELEN
========================================= */

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(function(screen) {
        screen.classList.remove("active");
    });

    const selectedScreen = document.getElementById(screenId);

    if (!selectedScreen) {
        console.warn("Scherm niet gevonden:", screenId);
        return;
    }

    selectedScreen.classList.add("active");

    document.querySelectorAll(".bottom-nav").forEach(function(nav) {
        nav.querySelectorAll(".nav-button").forEach(function(button) {
            button.classList.toggle(
                "active-nav",
                button.getAttribute("onclick")?.includes(screenId) === true
            );
        });
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    updateAll();
}


/* =========================================
   NAAM OPSLAAN TIJDENS DE SESSIE
========================================= */

function saveName() {
    const input = document.getElementById("name-input");
    const name = input.value.trim();

    if (name === "") {
        alert("Vul eerst je naam in.");
        return;
    }

    userName = name;

    const profileName = document.getElementById("profile-name");
    const homeTitle = document.getElementById("home-title");

    if (profileName) profileName.textContent = userName;
    if (homeTitle) homeTitle.textContent = "Hoi " + userName + "!";

    showScreen("home-screen");
}


/* =========================================
   PROFIEL OPENEN
========================================= */

function openEditProfile() {
    const nameInput = document.getElementById("edit-name-input");
    const sportInput = document.getElementById("edit-sport-input");

    if (nameInput) nameInput.value = userName;
    if (sportInput) sportInput.value = userSport;

    showScreen("edit-profile-screen");
}


/* =========================================
   PROFIEL AANPASSEN
========================================= */

function saveProfileChanges() {
    const nameInput = document.getElementById("edit-name-input");
    const sportInput = document.getElementById("edit-sport-input");

    const newName = nameInput.value.trim();
    const newSport = sportInput.value;

    if (newName === "") {
        alert("Vul een naam in.");
        return;
    }

    if (newSport === "") {
        alert("Kies een sport.");
        return;
    }

    userName = newName;
    userSport = newSport;

    const profileName = document.getElementById("profile-name");
    const profileSport = document.getElementById("profile-sport");
    const profileSportOption = document.getElementById("profile-sport-option");
    const homeTitle = document.getElementById("home-title");

    if (profileName) profileName.textContent = userName;
    if (profileSport) profileSport.textContent = userSport;
    if (profileSportOption) profileSportOption.textContent = userSport;
    if (homeTitle) homeTitle.textContent = "Hoi " + userName + "!";

    showScreen("profile-screen");
    alert("Je profiel is aangepast!");
}


/* =========================================
   VRIEND ZOEKEN
========================================= */

function searchFriend() {
    const input = document.getElementById("friend-input");
    const name = input.value.trim();

    if (name === "") {
        alert("Vul een gebruikersnaam in.");
        return;
    }

    const resultName = document.getElementById("searched-friend-name");
    const result = document.getElementById("friend-result");

    if (resultName) resultName.textContent = name;
    if (result) result.classList.remove("hidden");
}


/* =========================================
   VRIEND TOEVOEGEN
========================================= */

function addFriend() {
    const name = document
        .getElementById("searched-friend-name")
        .textContent.trim();

    if (name === "") return;

    const alreadyExists = friends.some(function(friend) {
        return friend.name.toLowerCase() === name.toLowerCase();
    });

    if (alreadyExists) {
        alert("Deze vriend staat al in je vriendenlijst.");
        return;
    }

    friends.push({
        name: name,
        sport: "Sportliefhebber"
    });

    const friendInput = document.getElementById("friend-input");
    const result = document.getElementById("friend-result");

    if (friendInput) friendInput.value = "";
    if (result) result.classList.add("hidden");

    updateAll();
    showScreen("friends-screen");

    alert(name + " is toegevoegd aan je vrienden!");
}


/* =========================================
   VRIENDENLIJST BIJWERKEN
========================================= */

function updateFriendsList() {
    const list = document.getElementById("friends-list");
    if (!list) return;

    list.innerHTML = "";

    friends.forEach(function(friend) {
        const card = document.createElement("div");
        card.className = "friend-card";

        const avatar = document.createElement("div");
        avatar.className = "friend-avatar";
        avatar.textContent = "👤";

        const info = document.createElement("div");
        info.className = "friend-info";

        const name = document.createElement("strong");
        name.textContent = friend.name;

        const sport = document.createElement("p");
        sport.textContent = friend.sport;

        const dot = document.createElement("span");
        dot.className = "online-dot";

        info.appendChild(name);
        info.appendChild(sport);
        card.appendChild(avatar);
        card.appendChild(info);
        card.appendChild(dot);
        list.appendChild(card);
    });

    const count = document.getElementById("friend-count");

    if (count) {
        count.textContent =
            friends.length +
            (friends.length === 1 ? " vriend" : " vrienden");
    }
}


/* =========================================
   VRIENDEN IN KEUZELIJSTEN
========================================= */

function updateFriendOptions() {
    ["friends-select", "meal-friends"].forEach(function(id) {
        const select = document.getElementById(id);
        if (!select) return;

        const previousValue = select.value;
        select.innerHTML = "";

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Kies een vriend";
        select.appendChild(placeholder);

        friends.forEach(function(friend) {
            const option = document.createElement("option");
            option.value = friend.name;
            option.textContent = friend.name;
            select.appendChild(option);
        });

        if (friends.some(function(friend) {
            return friend.name === previousValue;
        })) {
            select.value = previousValue;
        }
    });
}


/* =========================================
   ACTIVITEIT PLANNEN
========================================= */

function createActivity() {
    const sport = document.getElementById("sport-input").value;
    const date = document.getElementById("date-input").value;
    const time = document.getElementById("time-input").value;
    const selectedFriends = document.getElementById("friends-select").value;

    if (!sport || !date || !time || !selectedFriends) {
        alert("Vul alle gegevens in.");
        return;
    }

    if (date < getTodayString()) {
        alert("Kies vandaag of een datum in de toekomst.");
        return;
    }

    const activity = {
        sport: sport,
        date: date,
        time: time,
        friends: selectedFriends,
        completed: false
    };

    activities.push(activity);

    const activitySport = document.getElementById("activity-sport");
    const activityDate = document.getElementById("activity-date");
    const activityTime = document.getElementById("activity-time");
    const activityFriends = document.getElementById("activity-friends");
    const nextActivity = document.getElementById("next-activity");
    const nextDetails = document.getElementById("next-activity-details");

    if (activitySport) activitySport.textContent = sport;
    if (activityDate) activityDate.textContent = formatDate(date);
    if (activityTime) activityTime.textContent = time;
    if (activityFriends) activityFriends.textContent = selectedFriends;
    if (nextActivity) nextActivity.textContent = sport;

    if (nextDetails) {
        nextDetails.textContent =
            formatDate(date) + " • " + time + " • " + selectedFriends;
    }

    updateAll();
    showScreen("activity-view-screen");
}


/* =========================================
   DATUM WEERGEVEN
========================================= */

function formatDate(dateString) {
    if (!dateString) return "-";

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long"
    });
}


function getTodayString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}


/* =========================================
   ACTIVITEIT VOLTOOIEN
========================================= */

function completeActivity() {
    if (activities.length === 0) {
        alert("Er is nog geen activiteit gepland.");
        return;
    }

    const activity = activities[activities.length - 1];

    if (activity.completed) {
        alert("Deze activiteit is al voltooid.");
        return;
    }

    activity.completed = true;

    completedActivities = activities.filter(function(item) {
        return item.completed;
    }).length;

    streak++;

    updateAll();

    alert(
        "Goed gedaan! Je activiteit is voltooid. Je streak is nu " +
        streak + (streak === 1 ? " dag!" : " dagen!")
    );

    showScreen("home-screen");
}


/* =========================================
   MEEDOEN AAN CHALLENGE
========================================= */

function joinChallenge(button) {
    const card = button.closest(".challenge-card");
    const challengeId = card ? card.dataset.challenge : "";

    if (!challengeId) return;

    if (joinedChallengeIds.includes(challengeId)) {
        return;
    }

    joinedChallengeIds.push(challengeId);
    joinedChallenges = joinedChallengeIds.length;

    updateAll();

    alert(
        "Je doet nu mee aan deze challenge! " +
        "Je voortgang verandert wanneer je de bijbehorende actie uitvoert."
    );
}


/* =========================================
   AANTAL ACTIEVE CHALLENGES
========================================= */

function updateChallengeCount() {
    const counter = document.getElementById("joined-challenges");
    if (!counter) return;

    counter.textContent = joinedChallenges + " actief";
}


/* =========================================
   MAALTIJD PLANNEN
========================================= */

function planMeal() {
    const meal = document.getElementById("meal-input").value.trim();
    const date = document.getElementById("meal-date").value;
    const selectedFriend = document.getElementById("meal-friends").value;

    if (!meal || !date || !selectedFriend) {
        alert("Vul alle gegevens in.");
        return;
    }

    if (date < getTodayString()) {
        alert("Kies vandaag of een datum in de toekomst.");
        return;
    }

    plannedMeals.push({
        meal: meal,
        date: date,
        friends: selectedFriend
    });

    document.getElementById("meal-input").value = "";
    document.getElementById("meal-date").value = "";
    document.getElementById("meal-friends").value = "";

    updateAll();

    alert("Maaltijd gepland!");
}


/* =========================================
   GEPLANDE MAALTIJDEN WEERGEVEN
========================================= */

function updatePlannedMealsDisplay() {
    const box = document.getElementById("planned-meal");
    const text = document.getElementById("planned-meal-text");

    if (!box || !text) return;

    if (plannedMeals.length === 0) {
        box.classList.add("hidden");
        text.textContent = "";
        return;
    }

    box.classList.remove("hidden");

    text.textContent = plannedMeals.map(function(item, index) {
        return (
            (index + 1) + ". " +
            item.meal + " • " +
            formatDate(item.date) + " • met " +
            item.friends
        );
    }).join("\n");
}


/* =========================================
   CHALLENGEVOORTGANG
========================================= */

function updateChallengeProgress() {
    /*
       Sportieve week:
       verschillende geplande dagen tellen mee.

       Samen sporten:
       geplande activiteiten met een gekozen vriend tellen mee.

       Gezond eten:
       geplande maaltijden tellen mee.
    */

    const plannedDays = new Set(
        activities.map(function(activity) {
            return activity.date;
        })
    ).size;

    const activitiesWithFriends = activities.filter(function(activity) {
        return activity.friends && activity.friends.trim() !== "";
    }).length;

    const progressByChallenge = {
        week: {
            current: plannedDays,
            goal: 7
        },
        friends: {
            current: activitiesWithFriends,
            goal: 3
        },
        food: {
            current: plannedMeals.length,
            goal: 2
        }
    };

    document.querySelectorAll(".challenge-card").forEach(function(card) {
        const id = card.dataset.challenge;
        const info = progressByChallenge[id];

        if (!info) return;

        const current = Math.min(info.current, info.goal);
        const percentage = Math.round((current / info.goal) * 100);

        const counter = card.querySelector(".challenge-progress span");
        const bar = card.querySelector(".challenge-progress .progress-fill");
        const button = card.querySelector("button");
        const joined = joinedChallengeIds.includes(id);

        if (counter) {
            counter.textContent = current + " / " + info.goal;
        }

        if (bar) {
            bar.style.width = percentage + "%";
        }

        if (button) {
            if (current >= info.goal) {
                button.textContent = "Voltooid ✓";
                button.disabled = true;
            } else if (joined) {
                button.textContent = "Je doet mee ✓";
                button.disabled = true;
            } else {
                button.textContent = "Meedoen";
                button.disabled = false;
            }
        }

        card.classList.toggle(
            "challenge-complete",
            current >= info.goal
        );
    });
}


/* =========================================
   HOMEPAGINA: SPORTIEVE WEEK
========================================= */

function updateWeeklyProgress() {
    const goal = 5;

    /*
       Geplande activiteiten tellen meteen mee,
       zoals gevraagd voor het prototype.
    */
    const current = Math.min(activities.length, goal);
    const percentage = Math.round((current / goal) * 100);

    const progressText = document.getElementById("weekly-progress-text");
    const percentageText = document.getElementById("weekly-percentage");
    const progressBar = document.getElementById("weekly-progress-bar");
    const profileProgress = document.getElementById("profile-week-progress");
    const profileBar = document.getElementById("profile-progress-bar");

    if (progressText) {
        progressText.textContent = current + " / " + goal;
    }

    if (percentageText) {
        percentageText.textContent = percentage + "%";
    }

    if (progressBar) {
        progressBar.style.width = percentage + "%";
    }

    if (profileProgress) {
        profileProgress.textContent = current + " / " + goal;
    }

    if (profileBar) {
        profileBar.style.width = percentage + "%";
    }
}


/* =========================================
   STREAK BIJWERKEN
========================================= */

function updateStreak() {
    const homeStreak = document.getElementById("home-streak");
    const profileStreak = document.getElementById("profile-streak");

    if (homeStreak) {
        homeStreak.textContent =
            streak + (streak === 1 ? " dag" : " dagen");
    }

    if (profileStreak) {
        profileStreak.textContent = streak;
    }
}


/* =========================================
   PROFIELSTATISTIEKEN
========================================= */

function updateProfileStats() {
    const activitiesElement = document.getElementById("profile-activities");
    const challengesElement = document.getElementById("profile-challenges");

    if (activitiesElement) {
        activitiesElement.textContent = completedActivities;
    }

    if (challengesElement) {
        challengesElement.textContent = joinedChallenges;
    }
}


/* =========================================
   ALLES BIJWERKEN
========================================= */

function updateAll() {
    updateStreak();
    updateWeeklyProgress();
    updateProfileStats();
    updateFriendsList();
    updateFriendOptions();
    updateChallengeCount();
    updateChallengeProgress();
    updatePlannedMealsDisplay();

    const profileName = document.getElementById("profile-name");
    const homeTitle = document.getElementById("home-title");
    const profileSport = document.getElementById("profile-sport");
    const profileSportOption = document.getElementById("profile-sport-option");

    if (profileName && userName) {
        profileName.textContent = userName;
    }

    if (homeTitle && userName) {
        homeTitle.textContent = "Hoi " + userName + "!";
    }

    if (profileSport) {
        profileSport.textContent = userSport || "Sportliefhebber";
    }

    if (profileSportOption) {
        profileSportOption.textContent = userSport || "Nog niet gekozen";
    }
}


/* =========================================
   START
========================================= */

document.querySelectorAll('input[type="date"]').forEach(function(input) {
    input.min = getTodayString();
});

updateAll();


