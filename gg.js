const electron = require("electron");
const {ipcRenderer} = electron;

// Menu Events

let navbar = document.querySelector(".nav-bar")
let burger_menu = document.querySelector(".burger-menu");

document.querySelector(".burger-menu").addEventListener("click", () =>{
    document.querySelector(".burger-menu").classList.toggle('active');
    navbar.classList.toggle('active');
});

window.addEventListener("click", (e) =>{
    if(e.composedPath().includes(navbar) ||  e.composedPath().includes(burger_menu)){
    } else{
        document.querySelector(".burger-menu").classList.remove('active');
        navbar.classList.remove('active');
    }
});

// Live Lobby Status
let live_lobby_status = false;

let list = document.querySelector(".list");

// Live Lobby Clickable
let live_lobby_clickable = false;

// Live Lobby Events
let live_lobby = document.querySelector(".live-lobby");
let live_lobby_close_button = document.querySelector("#live-lobby-close-button");
let nav_live_lobby_button = document.querySelector("#nav-live-lobby-button");

live_lobby_close_button.addEventListener("click", () =>{
    live_lobby_clear();
    live_lobby.classList.remove('on');
    list.classList.remove('live-lobby-effect');
    live_lobby_status = false;
    all_user_champ.forEach(user_champ => {
        user_champ.classList.remove('found');
        user_champ.id ="";
    });
    live_lobby_clickable = false;
});

nav_live_lobby_button.addEventListener("click", () =>{
    if(live_lobby_status == true){
        live_lobby_clickable = false;
        live_lobby.classList.remove('on');
        list.classList.remove('live-lobby-effect');
        live_lobby_status = false;
    }else{
        live_lobby_clickable = true;
        live_lobby.classList.add('on');
        list.classList.add('live-lobby-effect');
        live_lobby_status = true;
    }
});

function live_lobby_clear(){
    for(let i = 0; i < 10; i++){
        all_user_image[i].src ="https://ddragon.leagueoflegends.com/cdn/10.18.1/img/profileicon/29.png";
        all_user_name[i].innerHTML ="S-"+(i+1);
    }
}


let timer = document.querySelector(".timer");

let timeInSeconds = 300;
let timerValue = timeInSeconds;

function timer_func() {
    setIntervalid = setInterval(() => {
        timerValue--;
        
        let minutes = Math.floor(timerValue / 60);
        let seconds = timerValue % 60;
        
        function addZero(i) {
            if (i < 10) {i = "0" + i}
            return i;
        }

        minutes = addZero(minutes);
        seconds = addZero(seconds);

        timer.innerHTML = minutes+":"+seconds;
      
      if (timerValue === 0) {
        timerValue = timeInSeconds;
        clearInterval(setIntervalid);
        timer.innerHTML = "Chronobreak";
        get_search_summer();
      }
    }, 1000);
}

timer_func();
clearInterval(setIntervalid);
timer.innerHTML = "";

// Searchable Status
let searchable = true;

// Auto Check
let auto_check = document.querySelector(".auto-check");
let auto_check_status = false;

auto_check.addEventListener("click", (e) =>{
    if(search_summoner_input.value != ""){
        if(searchable == true){
            if(auto_check_status == false){ 
                auto_check_status = true;
                get_search_summer();
                auto_check.classList.add('not-searchable');
                auto_check.innerHTML ="lock";
                search_summoner_input.classList.add('auto-mode-input');
                region_selection_container.classList.add('auto-mode-region');
                search_summoner.classList.add('auto-mode-button');
                search_summoner_input.setAttribute("disabled","");
            }else{
                auto_check.innerHTML ="lock_open";
                search_summoner_input.classList.remove('auto-mode-input');
                region_selection_container.classList.remove('auto-mode-region');
                search_summoner.classList.remove('auto-mode-button');
                auto_check.classList.remove('auto-mode-check');
                search_summoner_input.removeAttribute("disabled","");
                auto_check_status = false;
                send_auto_status();
                clearInterval(setIntervalid);
                timerValue = timeInSeconds;
                timer.innerHTML = "";
                searchable = true;
            }
        }else{
            return
        }
    }else{
        empty_input();
    }
});

// Search Button
let all_user_image = document.querySelectorAll(".user-image");
let all_user_name = document.querySelectorAll(".user-name-p");

let search_summoner_input = document.querySelector(".search-summoner-input");
let search_summoner = document.querySelector(".search-summoner");

search_summoner.addEventListener("click", () =>{
    if(auto_check_status == false){
        get_search_summer();
        live_lobby_clickable = false;
    }else{
        return
    }
});

//Summoner name is empty norification

function empty_input(){
    const notification_bar = document.createElement("div");
    const notification_p = document.createElement("p");
    notification_bar.classList.add("notification");
    notification_p.classList.add("notification-p");
    notification_p.innerText = "Summoner Name is empty.";
    screen.appendChild(notification_bar);
    notification_bar.appendChild(notification_p);
}

// Send Autocheck status
function send_auto_status(){
    ipcRenderer.send("auto_check_status",auto_check_status);
}


let region_selected_inner = "Europe West";
function get_search_summer(){
    if(search_summoner_input.value != ""){
        live_lobby_clear();
        if(searchable == true){
            send_auto_status();
            all_user_champ.forEach(user_champ => {
                user_champ.classList.remove('found');
            });
            ipcRenderer.send("summoner_name",search_summoner_input.value,region_selected_inner);
            searchable = false;
            search_summoner.classList.add('not-searchable');
            clear_preview();
            click_number = "";
        }else{
            return
        }
    }else{
        empty_input();
    }
}

let search_list_menu = document.querySelector(".search-list");

$('body').keyup(function(e){
    if(search_summoner_input === document.activeElement){
        if(e.keyCode == 13 && search_summoner_input.value != ""){
            search_list_menu.style.display = "none";
            get_search_summer();
        }
    }
});

// FOR REMOVE TAB KEY EVENT
$(document).keydown(function (e) 
    {
        var keycode1 = (e.keyCode ? e.keyCode : e.which);
        if (keycode1 == 0 || keycode1 == 9) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
);
// CTRL + R Shurtkey

$(document).keydown(function(e) {
    if (e.keyCode == 82 && e.ctrlKey) {
        ipcRenderer.send("reload");
    }
});

search_summoner_input.addEventListener("click", () =>{
    if(auto_check_status == false){
        if(search_list.length != 0){
            search_list_menu.style.display = "block";
        }
    }else{
        return
    }
});


let region_list = document.querySelector(".region-list");
let region_selection_container = document.querySelector(".region-selection-container");
let region_selected = document.querySelector(".region-selected");
let region_icon = document.querySelector(".region-icon");
let region_list_options = document.querySelectorAll(".region-options");

let region_menu = false;
region_selection_container.addEventListener("click", (e) =>{
    if(auto_check_status == false){    
        region_list.classList.toggle('on');
        region_icon.classList.toggle('on');
        region_menu = true;
    }else{
        return
    }
})

region_list_options.forEach(region_options =>{
    region_options.addEventListener("click", (e) =>{
        region_selected.innerText = e.target.innerText;
        region_selected_inner = e.target.innerText;
        region_list.classList.toggle('on');
        region_icon.classList.toggle('on');
        region_menu = false;
    })
})
window.addEventListener("click", (e) =>{
    if(e.composedPath().includes(region_list) || e.composedPath().includes(region_selection_container)){
    }else{
        region_list.classList.remove('on');
        region_icon.classList.remove('on');
        region_menu = false;
    }
});


// Search List
// The application works when it is first installed.
let search_list = [];
let search_list_json = JSON.parse(localStorage.getItem("search_list"));
if(localStorage.getItem('search_list') != undefined){
    for (let i = 0; i < search_list_json.length; i++){
        //search_list.push(search_list_json[i].user_name);
        search_list.push(
            {
                "user_name":search_list_json[i].user_name,
                "user_region":search_list_json[i].user_region,
                "user_id":search_list_json[i].user_id,
                "full_summoner_region":search_list_json[i].full_summoner_region
            }
        );
        add_search_list(search_list_json[i].user_name,search_list_json[i].user_region,search_list_json[i].user_id,search_list_json[i].full_summoner_region);
    }
}else if(localStorage.getItem('search_list') == undefined){
    localStorage.setItem('search_list', JSON.stringify(search_list));
}


// If the Search Returns True, it works.
ipcRenderer.on("name_exist", (e, input_summoner_name_splitless,summoner_region,user_id,full_summoner_region) =>{
    if(!localStorage.getItem('search_list').includes(user_id)){
        search_list.push(
            {
                "user_name":input_summoner_name_splitless,
                "user_region":summoner_region,
                "user_id":user_id,
                "full_summoner_region":full_summoner_region
            }
        );
        localStorage.setItem('search_list', JSON.stringify(search_list));
        add_search_list(input_summoner_name_splitless,summoner_region,user_id,full_summoner_region);
    }
});

function add_search_list(input_summoner_name_splitless,summoner_region,user_id,full_summoner_region){
    const new_search_element_div = document.createElement("div");
    const new_search_element_p = document.createElement("p");
    const new_search_element_span = document.createElement("span");
    const new_search_element_delete = document.createElement("span");

    new_search_element_div.classList.add("search-summoner-list");
    new_search_element_span.classList.add("search-summoner-list-region");
    new_search_element_delete.classList.add("search-summoner-list-delete");
    new_search_element_delete.classList.add("material-symbols-outlined");
    
    new_search_element_delete.setAttribute("id","search_delete_button");

    new_search_element_delete.innerHTML = "close";

    new_search_element_div.setAttribute("summoner_name",input_summoner_name_splitless);
    new_search_element_div.setAttribute("summoner_region",summoner_region);
    new_search_element_div.setAttribute("user_id",user_id);
    new_search_element_div.setAttribute("full_summoner_region",full_summoner_region);

    new_search_element_p.innerText = input_summoner_name_splitless;
    new_search_element_span.innerText = summoner_region;


    search_list_menu.appendChild(new_search_element_div);
    new_search_element_div.appendChild(new_search_element_span);
    new_search_element_div.appendChild(new_search_element_p);
    new_search_element_div.appendChild(new_search_element_delete);
    new_search_element_div.addEventListener("click", (e) =>{
        search_element_action(e);
    });
}

function search_element_action(e){
    if(e.target.id == "search_delete_button"){
        let delete_this_search_list = document.querySelectorAll(`.search-summoner-list`);
        delete_this_search_list.forEach(delete_element => {
            if(delete_element.getAttribute(`user_id`) == e.target.parentNode.getAttribute("user_id")){
                delete_element.remove();
                search_summoner_input.value = "";
            }
        });
        let delete_this_l = search_list.findIndex(x => x.user_id === e.target.parentNode.getAttribute("user_id"));
        search_list.splice(delete_this_l, 1);
        localStorage.setItem('search_list', JSON.stringify(search_list));
    
    }else if(e.target.getAttribute("class") == "search-summoner-list"){
        search_summoner_input.value = e.target.getAttribute('summoner_name');
        region_selected_inner = e.target.getAttribute('full_summoner_region');
        region_selected.innerText = e.target.getAttribute('full_summoner_region');
        region_selected.id = e.target.getAttribute('summoner_region');
    }else{
        search_summoner_input.value = e.target.parentNode.getAttribute('summoner_name');
        region_selected_inner = e.target.parentNode.getAttribute('full_summoner_region');
        region_selected.innerText = e.target.parentNode.getAttribute('full_summoner_region');
        region_selected.id = e.target.parentNode.getAttribute('summoner_region');
    }
}

window.addEventListener("click", (e) =>{
    if(!e.composedPath().includes(search_summoner_input)){
        if(search_list.length == 0){
            search_list_menu.style.display = "none";
        }
        if(e.target.id != "search_delete_button"){
            search_list_menu.style.display = "none";
        }
    }
});

let all_user_champ = document.querySelectorAll(".user-champ");

let preview_user_image = document.querySelector("#preview-user-image");
let preview_ally_name = document.querySelector(".preview-ally-name");

let preview_history = document.querySelector(".preview-history");
let preview_history_c = preview_history.children;

// Preview Container Events
let preview_status = false;
let preview_close = document.querySelector(".preview-close");
let preview = document.querySelector(".preview");
preview_close.addEventListener("click", () =>{
    preview.classList.toggle('on');
    preview_status = false;
});

let delete_user_button = document.querySelector(".delete_user_mylist");

// Get Summoners Data
//Found Summoners
let notification_game_id = 0;

let click_number;
ipcRenderer.on("summoners_list", (e, summoners_list) =>{
    live_lobby_clickable = true;
    if(auto_check_status == true){
        searchable = true;
        search_summoner.classList.remove('not-searchable');
        auto_check.classList.remove('not-searchable');
        auto_check.classList.add('auto-mode-check');
    }else{
        searchable = true;
        search_summoner.classList.remove('not-searchable');
    }
    if(live_lobby_status == false){
        live_lobby.classList.toggle('on');
        list.classList.toggle('live-lobby-effect');
        live_lobby_status = true;
    }
    for(let i = 0; i < summoners_list.length; i++){
        all_user_image[i].src = summoners_list[i].champion_image;
        all_user_name[i].innerText = summoners_list[i].name;
        all_user_champ[i].id = i;
        all_user_champ[i].setAttribute("live_lobby_id",summoners_list[i].id);

        // !! SUMMONER HAS BEEN FOUND
        black_list.forEach(black_list_summoner => {
            if(black_list_summoner.id == summoners_list[i].id){
                all_user_champ[i].classList.add("found");
                if(notification_game_id != summoners_list[i].game_id){
                    ipcRenderer.send("foundSummoner");
                    notification_game_id = summoners_list[i].game_id;
                }
                let match_history_array = [];
                for(let a = 0; a < black_list_summoner.match_history.length; a++){
                    match_history_array.push(black_list_summoner.match_history[a].game_id)
                }
                if(!match_history_array.includes(summoners_list[i].game_id)){
                    black_list_summoner.match_history.push(
                        {
                            "game_id":summoners_list[i].game_id,
                            "champion_image":summoners_list[i].champion_image,
                            "region":summoners_list[i].region
                        }
                    );
                    localStorage.setItem('black_list', JSON.stringify(black_list));
                }
            }
        });
    }
    all_user_champ.forEach(user_champ => {
        user_champ.addEventListener("click", (e) =>{
            note_upgrade_button.style.display ="none";
            if(live_lobby_clickable == true){
                if(user_champ.getAttribute("class") == "user-champ found"){
                    add_user_mylist.style.display="none";
                    delete_user_button.style.display="block";
                }else{
                    add_user_mylist.style.display="block";
                    delete_user_button.style.display="none";
                }

                if(preview_status == false){
                    preview.classList.toggle('on');
                }
                preview_status = true;
                click_number = user_champ.getAttribute("id");
                if(!click_number =="" || click_number == undefined){
                    get_preview(summoners_list[click_number]);
                }
            }
        });
    });
});

const banlist_users = document.querySelector(".banlist-users");

let the_summoner = [];

let preview_note = document.querySelector(".preview-note");
function get_preview(summoner){
    the_summoner = summoner;
    preview_user_image.src = summoner.champion_image;
    preview_ally_name.innerText = summoner.name;
    preview_note.innerText = summoner.note;

    Array.from(preview_history_c).forEach(div => {
        div.remove()
    });
    
    black_list.forEach(black_list_summoner => {
        // Find Match History 
        if(black_list_summoner.id == summoner.id){
            for(let i = 0; i < black_list_summoner.match_history.length; i++){
                // Automatic ADD to Match History
                    
                const match_container = document.createElement("div");
                    const match_container_image = document.createElement("div");
                    const match_container_p = document.createElement("p");
                    const match_container_span = document.createElement("span");

                match_container.classList.add("summoner-match-container");
                    match_container_image.classList.add("summoner-match-image");
                    match_container_image.style.backgroundImage  = `url(${black_list_summoner.match_history[i].champion_image})`;
                    match_container_p.classList.add("summoner-view-match");
                    match_container_span.classList.add("material-symbols-outlined");

                    match_container_p.innerText = "View Match";
                    match_container_span.innerText = "chevron_right";
                
                    match_container.setAttribute("game_id",black_list_summoner.match_history[i].game_id);
                    match_container.setAttribute("region",black_list_summoner?.region);
                    match_container.addEventListener("click", openMatchDetails);

                preview_history.appendChild(match_container);
                    match_container.appendChild(match_container_image);
                    match_container.appendChild(match_container_p);
                    match_container.appendChild(match_container_span);
            }
        }
    });
};

// Open Match Details
function openMatchDetails(e){
    let wiev_region;
    let wiev_game_id;
    if(e.target.getAttribute("region")){
        wiev_region = e.target.getAttribute("region");
        wiev_game_id = e.target.getAttribute("game_id");
    }else if(e.target.parentNode.getAttribute("region")){
        wiev_region = e.target.parentNode.getAttribute("region");
        wiev_game_id = e.target.parentNode.getAttribute("game_id");
    }else{
        return
    }
    ipcRenderer.send("wievTheMatch",wiev_game_id,wiev_region);
}


// Add Black List
let add_user_mylist = document.querySelector(".add_user_mylist");

let black_list = [];
let black_list_json = JSON.parse(localStorage.getItem("black_list"));
if(localStorage.getItem('black_list') != undefined){
    for (let i = 0; i < black_list_json.length; i++){
        black_list.push(black_list_json[i]);
        show_blacklist(black_list[i]);
    }
}else if(localStorage.getItem('black_list') == undefined){
    localStorage.setItem('black_list', JSON.stringify(black_list));
}



add_user_mylist.addEventListener("click", () =>{
    if(!localStorage.getItem('black_list').includes(the_summoner.id)){
        the_summoner.note = preview_note.innerText;
        
        //-------------------
        the_summoner.match_history.push(
            {
                "game_id":the_summoner.game_id,
                "champion_image":the_summoner.champion_image,
                "region":the_summoner.region
            }
        );
        const match_container = document.createElement("div");
            const match_container_image = document.createElement("div");
            const match_container_p = document.createElement("p");
            const match_container_span = document.createElement("span");

        match_container.classList.add("summoner-match-container");
            match_container_image.classList.add("summoner-match-image");
            match_container_image.style.backgroundImage  = `url(${the_summoner.champion_image})`;
            match_container_p.classList.add("summoner-view-match");
            match_container_span.classList.add("material-symbols-outlined");

            match_container_p.innerText = "View Match";
            match_container_span.innerText = "chevron_right";
        
            match_container.setAttribute("game_id",the_summoner.game_id)
            match_container.addEventListener("click", openMatchDetails);

        preview_history.appendChild(match_container);
            match_container.appendChild(match_container_image);
            match_container.appendChild(match_container_p);
            match_container.appendChild(match_container_span);
            //-------------------

        let add_this_border = document.getElementById(click_number);
        if(add_this_border.getAttribute("class") == "user-champ"){
            add_this_border.classList.add("found");
        }

        add_user_mylist.style.display="none";
        delete_user_button.style.display="block";

        black_list.push(the_summoner);
        localStorage.setItem('black_list', JSON.stringify(black_list));
        show_blacklist(the_summoner);
    }
});


function show_blacklist(the_summoner){
    const banned_user = document.createElement("div");
        const banned_user_img = document.createElement("img");
        const banned_user_name = document.createElement("p");
        const banned_user_region = document.createElement("p");

    banned_user.classList.add("banned-user");
        banned_user_img.classList.add("banned-champ");
        banned_user_name.classList.add("banned-user-name");
        banned_user_region.classList.add("region");

        banned_user_img.src = the_summoner.champion_image;
        banned_user_name.innerText = the_summoner.name;
        banned_user_region.innerText = the_summoner.region;

    banned_user.setAttribute("id",the_summoner.id);
    banlist_users.appendChild(banned_user);
        banned_user.appendChild(banned_user_img);
        banned_user.appendChild(banned_user_name);
        banned_user.appendChild(banned_user_region);

        banned_user.addEventListener("click", (e) =>{
            get_preview(the_summoner);
            note_upgrade_button.style.display ="none";
            add_user_mylist.style.display="none";
            delete_user_button.style.display="block";
            black_list.forEach(preview_user => {
                if(the_summoner.id == preview_user.id){
                    if(preview_status == false){
                        preview.classList.toggle('on');
                    }
                    preview_status = true;
                    preview_user_image.src = preview_user.champion_image;
                    preview_ally_name.innerText = preview_user.name;
                    preview_note.innerText = preview_user.note;
                    the_summoner.id = preview_user.id;
                }
            });
        });
}


//Get Notification's
let screen = document.querySelector(".screen");

ipcRenderer.on("notification", (e, notification,error_code) =>{
    if(error_code == 101){
        auto_check.innerHTML ="lock_open";        
        live_lobby_clear();
        auto_check_status = false;
        send_auto_status();
        clearInterval(setIntervalid);
        timerValue = timeInSeconds;
        timer.innerHTML = "";
        search_summoner.classList.remove('auto-mode-button');
        auto_check.classList.remove('auto-mode-button');
        region_selection_container.classList.remove('auto-mode-region');
        search_summoner_input.classList.remove('auto-mode-input');
        auto_check.classList.remove('not-searchable');
        search_summoner_input.removeAttribute("disabled","");
        live_lobby_clickable = false;

        for(let i = 0; i < 10; i++){
            all_user_champ[i].id = i;
            all_user_champ[i].classList.remove('found');
        }
    }
    const notification_bar = document.createElement("div");
    const notification_p = document.createElement("p");
    notification_bar.classList.add("notification");
    notification_p.classList.add("notification-p");
    notification_p.innerText = notification;
    screen.appendChild(notification_bar);
    notification_bar.appendChild(notification_p);
    searchable = true;

    
    if(auto_check_status == false){
        
        clearInterval(setIntervalid);
        timer.innerHTML = "";
        search_summoner.classList.remove('not-searchable');
        search_summoner.classList.remove('auto-mode-button');
    }else if(auto_check_status == true){    
        timer_func(); 
        search_summoner.classList.remove('not-searchable');
        search_summoner.classList.add('auto-mode-button');
        
        auto_check.classList.remove('not-searchable');
        auto_check.classList.add('auto-mode-check');
    }
});


// Confirm screen
let confirm_background = document.querySelector(".confirm-background");
let confirm_container = document.querySelector(".confirm-container");
let reply_yes = document.querySelector("#reply-yes");
let reply_no = document.querySelector("#reply-no");

let confirm_username = document.querySelector(".confirm-username");
let confirm_question = document.querySelector(".confirm-question");

confirm_background.addEventListener("click", (e) =>{
    if(!e.composedPath().includes(confirm_container) || e.target.id == "search_delete_button"){
        confirm_background.style.display = "none";
    }
});

let confirm_cancel_button = document.querySelector("#confirm_cancel_button");
confirm_cancel_button.addEventListener("click", ()=>{
    confirm_background.style.display = "none";
})

// Delete user from my list
delete_user_button.addEventListener("click", (e) =>{
    delete_user(e);
});

function delete_user(e){
    confirm_background.style.display = "flex";
    confirm_username.innerHTML = the_summoner.name;
    confirm_question.innerHTML = "<br>This player and past matches will be deleted, are you sure?";
}

reply_yes.addEventListener("click", (e) =>{
    let delete_this_summoner = document.getElementById(the_summoner.id);
    all_user_champ.forEach(element => {
        if(delete_this_summoner.id == element.getAttribute("live_lobby_id")){
            if(element.getAttribute("class") == "user-champ found"){
                element.classList.remove('found');
            }
        }
    });

    delete_this_summoner.remove();
    clear_preview();
    confirm_background.style.display = "none";
    let delete_this_s = black_list.findIndex(x => x.id === the_summoner.id);
    black_list.splice(delete_this_s, 1);
    localStorage.setItem('black_list', JSON.stringify(black_list));
    click_number = "";
    the_summoner = [];
});

reply_no.addEventListener("click", () =>{
    confirm_background.style.display = "none";
    return;
});

// Clear Preview Banner
function clear_preview(){
    preview_ally_name.innerText = "Summoner";
    preview_user_image.src = "https://ddragon.leagueoflegends.com/cdn/10.18.1/img/profileicon/29.png";
    preview_note.innerText = "";
    delete_user_button.style.display ="none";
    if(preview_status == true){
        preview.classList.toggle('on');
        preview_status = false;
    }
}


let lines = document.querySelectorAll(".line");

// Donation Screen
let donation_background = document.querySelector(".donation-background");
let donation_container = document.querySelector(".donation-container");
let nav_donation_button = document.querySelector("#nav-donation-button");
let donation_close_button = document.querySelector("#donation-close-button");

let donation_button = document.querySelector("#donation-button");

lines.forEach(line => {
    line.addEventListener("click", (e) =>{
        if(navbar.className == "nav-bar active"){
            navbar.classList.toggle('active');
            burger_menu.classList.toggle('active');
        }
    });
});

nav_donation_button.addEventListener("click", (e) =>{
    donation_background.style.display ="flex";
});

donation_button.addEventListener("click", (e) => {
    ipcRenderer.send("donation");
    donation_background.style.display = "none";
});

donation_close_button.addEventListener("click", (e) =>{
    donation_background.style.display = "none";
});


donation_background.addEventListener("click", (e) =>{
    if(!e.composedPath().includes(donation_container) || e.target == nav_donation_button){
        donation_background.style.display = "none";
    }
});


// Information Screen
let information_background = document.querySelector(".information-background");
let information_container = document.querySelector(".information-container");
let nav_information_button = document.querySelector("#nav-information-button");
let information_close_button = document.querySelector("#information-close-button");

let information_github_button = document.querySelector(".information-github-container");

nav_information_button.addEventListener("click", (e) =>{
    information_background.style.display ="flex";
});

information_github_button.addEventListener("click", (e) =>{
    ipcRenderer.send("github");
    information_background.style.display = "none";
});

information_close_button.addEventListener("click", (e) =>{
    information_background.style.display = "none";
});

information_background.addEventListener("click", (e) =>{
    if(!e.composedPath().includes(information_container) || e.target == nav_information_button){
        information_background.style.display = "none";
    }
});

// Help Screen
let help_background = document.querySelector(".help-background");
let help_container = document.querySelector(".help-container");
let nav_help_button = document.querySelector("#nav-help-button");
let help_close_button = document.querySelector("#help-close-button");


nav_help_button.addEventListener("click", (e) =>{
    help_background.style.display ="flex";
});

information_github_button.addEventListener("click", (e) =>{
    help_background.style.display = "none";
});

help_close_button.addEventListener("click", (e) =>{
    help_background.style.display = "none";
});

help_background.addEventListener("click", (e) =>{
    if(!e.composedPath().includes(help_container) || e.target == nav_help_button){
        help_background.style.display = "none";
    }
});

// Doubleclick Events
//Copy EasterEgg
let copyText = document.querySelector(".copy-notification");
let copyCounter = 1;
let copyTexts = ["Copyed!","Double Copy!","Triple Copy!","Quadra Copy!","Penta Copy!","Hexa Copy!","Unstoppable!"];
let timeOut_value = 2000;
let copyWindow = false;
preview_ally_name.addEventListener('click', (e) => {
    if(copyWindow == false){
        copyWindow = true;
        copyText.style.display = "block";
        if(copyCounter == 1){
            copyText.innerHTML = copyTexts[0];
        }else if( copyCounter == 2){
            copyText.innerHTML = copyTexts[1];
        }else if( copyCounter == 3){
            copyText.innerHTML = copyTexts[2];
        }else if( copyCounter == 4){
            copyText.innerHTML = copyTexts[3];
        }else if( copyCounter == 5){
            copyText.innerHTML = copyTexts[4];
        }else if( copyCounter == 6){
            copyText.innerHTML = copyTexts[5];
        }else if( copyCounter > 6){
            copyText.innerHTML = copyTexts[6];
        }
    
        copyCounter += 1;
        setTimeout(function(){
            copyText.style.display = "none";
            copyWindow = false;
        }, timeOut_value);
    }
    
    var text = preview_ally_name.innerText;
    var tempInput = document.createElement("textarea");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
});


// Note Upgrade


function edit_this(){
    let edit_this;
    note_upgrade_button.style.display ="none";
    black_list.forEach(x => {
        if(x.id == the_summoner.id){
            edit_this = x;
        }
    });
    edit_this.note = preview_note.innerText;
    localStorage.setItem('black_list', JSON.stringify(black_list));
}

let note_upgrade_button = document.querySelector(".preview-note-button");
let preview_note_container = document.querySelector(".preview-note");
preview_note_container.addEventListener('keydown', (e) => {
    if(localStorage.getItem('black_list').includes(the_summoner.id)){
        note_upgrade_button.style.display ="block";
    }else{
        note_upgrade_button.style.display ="none";
    }
});

note_upgrade_button.addEventListener('click', (e) => {
    edit_this();
});

$(preview_note_container).keydown(function(e) {
    if (e.keyCode == 13 && e.ctrlKey) {
        edit_this();
    }
});