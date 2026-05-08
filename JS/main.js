document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("audio-player");
    const canvas = document.getElementById("visualizer");
    const ctx = canvas.getContext("2d");

    const fallbackCover = "./images/logo-pm.png";
    const vaultDbName = "pulseMusicVault";
    const vaultStoreName = "savedTracks";
    const tracks = [
        {
            id: "time-rise",
            title: "Time To Rise",
            artist: "VannDa",
            album: "Khmer Hip-Hop",
            year: 2019,
            duration: "5:02",
            src: "./music/VannDa-វណ្ណដា_Time_To_Right.mp3",
            cover: "https://i.scdn.co/image/ab67616d0000b273f8f43e519cd0e7cacd1f09e5",
            lyrics: "Time To Rise\n\nLyrics are not added yet. Add your own lyrics in the song data when you have them."
        },
        {
            id: "mama",
            title: "MAMA",
            artist: "VannDa",
            album: "Singles",
            year: 2019,
            duration: "7:15",
            src: "./music/MAMA.mp3",
            cover: "https://i.ytimg.com/vi/WNL3zDgWZc0/hq720.jpg",
            lyrics: "MAMA\n\nA powerful VannDa track. Lyrics are not added yet."
        },
        {
            id: "catch-me",
            title: "Catch Me If You Can",
            artist: "VannDa",
            album: "Singles",
            year: 2021,
            duration: "5:42",
            src: "./music/Vannda-Catch-Me-If-You-Can.mp3",
            cover: "https://linkstorage.linkfire.com/medialinks/images/b2b2ffdf-caee-485f-b2f7-89cfd37faa2f/artwork-440x440.jpg",
            lyrics: "Catch Me If You Can\n\nLyrics are not added yet."
        },
        {
            id: "solo",
            title: "SOLO",
            artist: "VannDa",
            album: "Singles",
            year: 2020,
            duration: "3:48",
            src: "./music/VannDa-វណ្ណដា - SOLO (Explicit).mp3",
            cover: fallbackCover,
            lyrics: "SOLO\n\nLyrics are not added yet."
        },
        {
            id: "sun-break",
            title: "ពេលមេឃបើកថ្ងៃ",
            artist: "VannDa x KWAN",
            album: "Khmer Hits",
            year: 2024,
            duration: "3:48",
            src: "./music/មេឃបើកថ្ងៃ.mp3",
            cover: "./images/ពេលមេឃបើកថ្ងៃ.png",
            lyrics: "ពេលមេឃបើកថ្ងៃ\n\nLyrics are not added yet."
        },
        {
            id: "wooden-box",
            title: "WOODEN BOX",
            artist: "VannDa",
            album: "Singles",
            year: 2020,
            duration: "3:48",
            src: "./music/WOODEN-BOX.mp3",
            cover: "https://i.ytimg.com/vi/O-n9cWeS7Is/sddefault.jpg",
            lyrics: "WOODEN BOX\n\nLyrics are not added yet."
        },
        {
            id: "khmer-boy",
            title: "កម្លោះស្រុកខ្មែរ",
            artist: "Vanthan x VannDa",
            album: "Khmer Hits",
            year: 2020,
            duration: "3:48",
            src: "./music/Vanthan_x_VannDa_កម្លោះស្រុកខ្មែរ_Official_Video.mp3",
            cover: "https://i.scdn.co/image/ab67616d0000b273e5fdf77426bfa1a4819da82b",
            lyrics: "កម្លោះស្រុកខ្មែរ\n\nLyrics are not added yet."
        },
        {
            id: "miss-you",
            title: "ជម្ងឺនឹកគេ",
            artist: "Sokmean",
            album: "Khmer Pop",
            year: 2022,
            duration: "3:48",
            src: "./music/ជម្ងឺនឹកគេ-Sokmean.mp3",
            cover: "./images/ជំងឺនឹកគេ.png",
            lyrics: "ជម្ងឺនឹកគេ\n\nLyrics are not added yet."
        }
    ];

    const playlists = [
        { id: "favorites", name: "Favorites", description: "Songs you mark with the heart button.", trackIds: [] },
        { id: "khmer-hits", name: "Khmer Hits", description: "Local favorites from your folder.", trackIds: ["sun-break", "khmer-boy", "miss-you"] },
        { id: "vannda", name: "VannDa Essentials", description: "A quick run through the VannDa tracks.", trackIds: ["time-rise", "mama", "catch-me", "solo", "wooden-box"] }
    ];

    const elements = {
        albumArt: document.getElementById("album-art"),
        songTitle: document.getElementById("song-title"),
        songArtist: document.getElementById("song-artist"),
        playState: document.getElementById("play-state"),
        playBtn: document.getElementById("play-btn"),
        prevBtn: document.getElementById("prev-btn"),
        nextBtn: document.getElementById("next-btn"),
        shuffleBtn: document.getElementById("shuffle-btn"),
        repeatBtn: document.getElementById("repeat-btn"),
        favoriteBtn: document.getElementById("favorite-btn"),
        volumeSlider: document.getElementById("volume-slider"),
        progressSlider: document.getElementById("progress-slider"),
        currentTime: document.getElementById("current-time"),
        totalTime: document.getElementById("total-time"),
        searchInput: document.getElementById("search-input"),
        trackList: document.getElementById("track-list"),
        mixList: document.getElementById("mix-list"),
        playlistGrid: document.getElementById("playlist-grid"),
        uploadedList: document.getElementById("uploaded-list"),
        lyricsBox: document.getElementById("lyrics-box"),
        fileInput: document.getElementById("file-input"),
        uploadZone: document.getElementById("upload-zone"),
        clearFilterBtn: document.getElementById("clear-filter-btn"),
        clearVaultBtn: document.getElementById("clear-vault-btn"),
        accentPicker: document.getElementById("accent-picker"),
        autoplayToggle: document.getElementById("autoplay-toggle"),
        rememberVolumeToggle: document.getElementById("remember-volume-toggle"),
        sidebarSongCount: document.getElementById("sidebar-song-count"),
        sidebarArtistCount: document.getElementById("sidebar-artist-count"),
        metricTotalTracks: document.getElementById("metric-total-tracks"),
        metricStoredTracks: document.getElementById("metric-stored-tracks"),
        metricVaultTracks: document.getElementById("metric-vault-tracks"),
        vaultStatus: document.getElementById("vault-status"),
        vaultCount: document.getElementById("vault-count"),
        vaultUsed: document.getElementById("vault-used"),
        vaultMeterFill: document.getElementById("vault-meter-fill"),
        toast: document.getElementById("toast")
    };

    const state = {
        queue: [...tracks],
        filteredQueue: [...tracks],
        currentIndex: 0,
        isPlaying: false,
        isShuffle: false,
        isRepeat: false,
        favorites: new Set(JSON.parse(localStorage.getItem("pulseFavorites") || "[]")),
        storedSongs: new Set(JSON.parse(localStorage.getItem("pulseStoredSongs") || "[]")),
        uploaded: [],
        audioContext: null,
        source: null,
        analyser: null,
        visualizerFrame: null,
        vaultSupported: "indexedDB" in window
    };

    async function init() {
        const savedAccent = localStorage.getItem("pulseAccent");
        const savedVolume = localStorage.getItem("pulseVolume");

        if (savedAccent) {
            setAccent(savedAccent);
            elements.accentPicker.value = savedAccent;
        }

        if (savedVolume !== null) {
            elements.volumeSlider.value = savedVolume;
        }

        audio.volume = Number(elements.volumeSlider.value) / 100;
        elements.albumArt.addEventListener("error", () => {
            elements.albumArt.src = fallbackCover;
        });

        state.uploaded = await loadUploadedTracksFromVault();
        state.queue = [...tracks, ...state.uploaded];
        state.filteredQueue = [...state.queue];

        loadTrack(0, false);
        bindEvents();
        renderAll();
        drawIdleVisualizer();
        updateVaultStatus();
        showToast(state.uploaded.length ? "Saved songs restored from your vault." : "Music vault is ready.");
    }

    function bindEvents() {
        document.querySelectorAll(".nav-link").forEach((button) => {
            button.addEventListener("click", () => switchSection(button.dataset.section));
        });

        elements.playBtn.addEventListener("click", togglePlay);
        elements.prevBtn.addEventListener("click", playPrevious);
        elements.nextBtn.addEventListener("click", playNext);
        elements.shuffleBtn.addEventListener("click", toggleShuffle);
        elements.repeatBtn.addEventListener("click", toggleRepeat);
        elements.favoriteBtn.addEventListener("click", toggleFavorite);
        elements.clearFilterBtn.addEventListener("click", clearSearch);

        elements.volumeSlider.addEventListener("input", () => {
            audio.volume = Number(elements.volumeSlider.value) / 100;
            if (elements.rememberVolumeToggle.checked) {
                localStorage.setItem("pulseVolume", elements.volumeSlider.value);
            }
        });

        elements.progressSlider.addEventListener("input", () => {
            if (!Number.isFinite(audio.duration)) return;
            audio.currentTime = (Number(elements.progressSlider.value) / 1000) * audio.duration;
        });

        elements.searchInput.addEventListener("input", () => {
            state.filteredQueue = getVisibleStoreTracks(elements.searchInput.value);
            renderTrackList();
        });

        elements.accentPicker.addEventListener("input", () => {
            setAccent(elements.accentPicker.value);
            localStorage.setItem("pulseAccent", elements.accentPicker.value);
        });

        elements.fileInput.addEventListener("change", () => handleFiles(elements.fileInput.files));
        elements.clearVaultBtn.addEventListener("click", clearUploadedVault);

        ["dragenter", "dragover"].forEach((eventName) => {
            elements.uploadZone.addEventListener(eventName, (event) => {
                event.preventDefault();
                elements.uploadZone.classList.add("dragover");
            });
        });

        ["dragleave", "drop"].forEach((eventName) => {
            elements.uploadZone.addEventListener(eventName, (event) => {
                event.preventDefault();
                elements.uploadZone.classList.remove("dragover");
            });
        });

        elements.uploadZone.addEventListener("drop", (event) => handleFiles(event.dataTransfer.files));

        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("play", () => {
            state.isPlaying = true;
            updatePlayButton();
            startVisualizer();
        });
        audio.addEventListener("pause", () => {
            state.isPlaying = false;
            updatePlayButton();
            stopVisualizer();
            drawIdleVisualizer();
        });
        audio.addEventListener("ended", () => {
            if (state.isRepeat) {
                audio.currentTime = 0;
                playAudio();
            } else if (elements.autoplayToggle.checked) {
                playNext();
            } else {
                state.isPlaying = false;
                updatePlayButton();
            }
        });
        audio.addEventListener("error", () => {
            const track = getCurrentTrack();
            showToast(`Could not play "${track.title}". Check that the file exists.`);
        });

        document.addEventListener("keydown", (event) => {
            const tag = event.target.tagName.toLowerCase();
            if (tag === "input" || tag === "textarea") return;

            if (event.code === "Space" || event.key.toLowerCase() === "k") {
                event.preventDefault();
                togglePlay();
            }
            if (event.key === "ArrowRight") playNext();
            if (event.key === "ArrowLeft") playPrevious();
            if (event.key.toLowerCase() === "s") toggleShuffle();
            if (event.key.toLowerCase() === "r") toggleRepeat();
            if (event.key.toLowerCase() === "f") toggleFavorite();
        });
    }

    function setAccent(color) {
        document.documentElement.style.setProperty("--accent", color);
    }

    function switchSection(section) {
        document.querySelectorAll(".nav-link").forEach((button) => {
            button.classList.toggle("active", button.dataset.section === section);
        });

        document.querySelectorAll(".section-view").forEach((view) => {
            view.classList.toggle("active", view.id === `${section}-section`);
        });
    }

    function loadTrack(index, shouldPlay = state.isPlaying) {
        const normalizedIndex = normalizeIndex(index);
        state.currentIndex = normalizedIndex;

        const track = getCurrentTrack();
        audio.src = track.src;
        audio.load();

        elements.albumArt.src = track.cover || fallbackCover;
        elements.albumArt.alt = `${track.title} cover`;
        elements.songTitle.textContent = track.title;
        elements.songArtist.textContent = `${track.artist} / ${track.album} / ${track.year}`;
        elements.lyricsBox.textContent = track.lyrics || `${track.title}\n\nNo lyrics have been added for this song yet.`;
        elements.progressSlider.value = 0;
        elements.currentTime.textContent = "0:00";
        updateFavoriteButton();
        renderTrackList();

        if (shouldPlay) playAudio();
    }

    function normalizeIndex(index) {
        if (index < 0) return state.queue.length - 1;
        if (index >= state.queue.length) return 0;
        return index;
    }

    function getCurrentTrack() {
        return state.queue[state.currentIndex];
    }

    function playAudio() {
        setupAudioGraph();
        if (state.audioContext && state.audioContext.state === "suspended") {
            state.audioContext.resume();
        }
        audio.play().catch(() => {
            showToast("Your browser blocked autoplay. Press play again.");
        });
    }

    function togglePlay() {
        if (audio.paused) {
            playAudio();
        } else {
            audio.pause();
        }
    }

    function playNext() {
        if (state.isShuffle && state.queue.length > 1) {
            let nextIndex = state.currentIndex;
            while (nextIndex === state.currentIndex) {
                nextIndex = Math.floor(Math.random() * state.queue.length);
            }
            loadTrack(nextIndex, true);
            return;
        }
        loadTrack(state.currentIndex + 1, true);
    }

    function playPrevious() {
        if (audio.currentTime > 4) {
            audio.currentTime = 0;
            return;
        }
        loadTrack(state.currentIndex - 1, true);
    }

    function toggleShuffle() {
        state.isShuffle = !state.isShuffle;
        elements.shuffleBtn.classList.toggle("active", state.isShuffle);
        showToast(state.isShuffle ? "Shuffle on" : "Shuffle off");
    }

    function toggleRepeat() {
        state.isRepeat = !state.isRepeat;
        elements.repeatBtn.classList.toggle("active", state.isRepeat);
        showToast(state.isRepeat ? "Repeat on" : "Repeat off");
    }

    function toggleFavorite() {
        const track = getCurrentTrack();
        if (state.favorites.has(track.id)) {
            state.favorites.delete(track.id);
            showToast("Removed from Favorites");
        } else {
            state.favorites.add(track.id);
            showToast("Added to Favorites");
        }

        playlists[0].trackIds = [...state.favorites];
        localStorage.setItem("pulseFavorites", JSON.stringify([...state.favorites]));
        updateFavoriteButton();
        renderPlaylists();
        renderMixes();
    }

    function storeTrack(trackId) {
        const track = state.queue.find((item) => item.id === trackId);
        if (!track) return;

        state.storedSongs.add(trackId);
        saveStoredSongs();
        renderTrackList();
        renderMixes();
        showToast(`Stored "${track.title}" on your music shelf.`);
    }

    function unstoreTrack(trackId) {
        const track = state.queue.find((item) => item.id === trackId);
        if (!track) return;

        state.storedSongs.delete(trackId);
        saveStoredSongs();
        state.filteredQueue = getVisibleStoreTracks();
        renderTrackList();
        renderMixes();
        showToast(`Moved "${track.title}" back to the library.`);
    }

    function saveStoredSongs() {
        localStorage.setItem("pulseStoredSongs", JSON.stringify([...state.storedSongs]));
    }

    function updateFavoriteButton() {
        const isFavorite = state.favorites.has(getCurrentTrack().id);
        elements.favoriteBtn.classList.toggle("active", isFavorite);
        elements.favoriteBtn.innerHTML = `
            <i class="${isFavorite ? "fa-solid" : "fa-regular"} fa-heart"></i>
            <span>${isFavorite ? "Favorited" : "Favorite"}</span>
        `;
    }

    function updatePlayButton() {
        elements.playBtn.innerHTML = `<i class="fa-solid fa-${state.isPlaying ? "pause" : "play"}"></i>`;
        elements.playBtn.title = state.isPlaying ? "Pause" : "Play";
        elements.playState.textContent = state.isPlaying ? "Playing" : "Paused";
    }

    function updateDuration() {
        elements.totalTime.textContent = formatTime(audio.duration);
    }

    function updateProgress() {
        if (!Number.isFinite(audio.duration)) return;
        const progress = (audio.currentTime / audio.duration) * 1000;
        elements.progressSlider.value = progress || 0;
        elements.currentTime.textContent = formatTime(audio.currentTime);
    }

    function formatTime(seconds) {
        if (!Number.isFinite(seconds)) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${minutes}:${remainder}`;
    }

    function formatBytes(bytes) {
        if (!bytes) return "0 MB";
        const units = ["B", "KB", "MB", "GB"];
        const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
        const value = bytes / Math.pow(1024, exponent);
        return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
    }

    function renderAll() {
        playlists[0].trackIds = [...state.favorites];
        state.filteredQueue = getVisibleStoreTracks(elements.searchInput.value);
        renderTrackList();
        renderMixes();
        renderPlaylists();
        renderUploaded();
        updateStats();
    }

    function renderTrackList() {
        state.filteredQueue = getVisibleStoreTracks(elements.searchInput.value);

        if (state.filteredQueue.length === 0) {
            elements.trackList.innerHTML = `<div class="empty-state">All matching songs are stored. Check your Stored Music shelf.</div>`;
            return;
        }

        elements.trackList.innerHTML = state.filteredQueue.map((track) => {
            const queueIndex = state.queue.findIndex((song) => song.id === track.id);
            const isActive = queueIndex === state.currentIndex;

            return `
                <article class="track-row store-row ${isActive ? "active" : ""}" data-track-id="${track.id}">
                    <img src="${track.cover || fallbackCover}" alt="" onerror="this.src='${fallbackCover}'">
                    <span class="track-copy">
                        <strong>${escapeHtml(track.title)}</strong>
                        <span>${escapeHtml(track.artist)} / ${escapeHtml(track.album)}</span>
                    </span>
                    <span class="track-time">${track.duration || ""}</span>
                    <span class="row-actions">
                        <button class="mini-action" data-play-id="${track.id}" title="Play song">
                            <i class="fa-solid fa-play"></i>
                        </button>
                        <button class="mini-action store-action" data-store-id="${track.id}" title="Store song">
                            <i class="fa-solid fa-box-archive"></i>
                            <span>Store</span>
                        </button>
                    </span>
                </article>
            `;
        }).join("");

        elements.trackList.querySelectorAll("[data-play-id]").forEach((button) => {
            button.addEventListener("click", () => {
                const queueIndex = state.queue.findIndex((track) => track.id === button.dataset.playId);
                loadTrack(queueIndex, true);
            });
        });

        elements.trackList.querySelectorAll("[data-store-id]").forEach((button) => {
            button.addEventListener("click", () => storeTrack(button.dataset.storeId));
        });
    }

    function renderMixes() {
        const storedTracks = [...state.storedSongs]
            .map((id) => state.queue.find((track) => track.id === id))
            .filter(Boolean);

        if (storedTracks.length === 0) {
            elements.mixList.innerHTML = `
                <div class="shelf-empty">
                    <i class="fa-solid fa-box-open"></i>
                    <strong>No stored songs yet</strong>
                    <span>Use the Store button to move music into this shelf.</span>
                </div>
            `;
            return;
        }

        elements.mixList.innerHTML = `
            <button class="soft-btn shelf-play-all" data-play-stored>
                <i class="fa-solid fa-circle-play"></i>
                <span>Play Stored Songs</span>
            </button>
            ${storedTracks.map((track) => `
                <article class="stored-card">
                    <img src="${track.cover || fallbackCover}" alt="" onerror="this.src='${fallbackCover}'">
                    <div>
                        <strong>${escapeHtml(track.title)}</strong>
                        <span>${escapeHtml(track.artist)}</span>
                    </div>
                    <button class="mini-action" data-shelf-play="${track.id}" title="Play">
                        <i class="fa-solid fa-play"></i>
                    </button>
                    <button class="mini-action" data-shelf-remove="${track.id}" title="Move back">
                        <i class="fa-solid fa-arrow-rotate-left"></i>
                    </button>
                </article>
            `).join("")}
        `;

        elements.mixList.querySelector("[data-play-stored]").addEventListener("click", () => {
            playTrackSet(storedTracks.map((track) => track.id), "Stored Music");
        });

        elements.mixList.querySelectorAll("[data-shelf-play]").forEach((button) => {
            button.addEventListener("click", () => {
                const queueIndex = state.queue.findIndex((track) => track.id === button.dataset.shelfPlay);
                loadTrack(queueIndex, true);
            });
        });

        elements.mixList.querySelectorAll("[data-shelf-remove]").forEach((button) => {
            button.addEventListener("click", () => unstoreTrack(button.dataset.shelfRemove));
        });
    }

    function getVisibleStoreTracks(query = "") {
        const normalizedQuery = query.trim().toLowerCase();

        return state.queue.filter((track) => {
            const isStored = state.storedSongs.has(track.id);
            const matchesSearch = [track.title, track.artist, track.album, track.year]
                .join(" ")
                .toLowerCase()
                .includes(normalizedQuery);

            return !isStored && matchesSearch;
        });
    }

    function renderPlaylists() {
        elements.playlistGrid.innerHTML = playlists.map((playlist) => {
            const count = playlist.trackIds.length;
            return `
                <article class="playlist-card">
                    <strong>${playlist.name}</strong>
                    <span>${playlist.description}</span>
                    <span>${count} ${count === 1 ? "song" : "songs"}</span>
                    <button class="soft-btn" data-playlist-id="${playlist.id}">
                        <i class="fa-solid fa-circle-play"></i>
                        <span>Play playlist</span>
                    </button>
                </article>
            `;
        }).join("");

        elements.playlistGrid.querySelectorAll("button").forEach((button) => {
            button.addEventListener("click", () => {
                const playlist = playlists.find((item) => item.id === button.dataset.playlistId);
                playTrackSet(playlist.trackIds, playlist.name);
            });
        });
    }

    function playTrackSet(ids, name) {
        const list = ids.map((id) => state.queue.find((track) => track.id === id)).filter(Boolean);
        if (list.length === 0) {
            showToast(`${name} has no tracks yet.`);
            return;
        }

        state.queue = [...list, ...state.queue.filter((track) => !ids.includes(track.id))];
        state.filteredQueue = [...state.queue];
        elements.searchInput.value = "";
        loadTrack(0, true);
        showToast(`Playing ${name}`);
        renderAll();
        switchSection("library");
    }

    async function handleFiles(fileList) {
        const files = [...fileList].filter((file) => file.type.startsWith("audio/"));
        if (files.length === 0) {
            showToast("Choose audio files only.");
            return;
        }

        if (!state.vaultSupported) {
            showToast("This browser cannot save songs permanently. They will stay for this session only.");
        } else {
            showToast("Saving songs to your safe vault...");
        }

        const newTracks = files.map((file, index) => ({
            id: `upload-${Date.now()}-${index}`,
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Uploaded file",
            album: "Uploads",
            year: new Date().getFullYear(),
            duration: "",
            src: URL.createObjectURL(file),
            cover: fallbackCover,
            lyrics: `${file.name}\n\nNo lyrics have been added for this uploaded track yet.`,
            file,
            saved: false
        }));

        const saveResults = await Promise.all(newTracks.map((track) => saveUploadedTrackToVault(track)));
        newTracks.forEach((track, index) => {
            track.saved = saveResults[index];
            delete track.file;
        });

        state.uploaded.push(...newTracks);
        state.queue.push(...newTracks);
        state.filteredQueue = [...state.queue];
        renderAll();
        updateVaultStatus();
        showToast(`${files.length} ${files.length === 1 ? "song" : "songs"} saved in your vault.`);
        elements.fileInput.value = "";
    }

    function renderUploaded() {
        if (state.uploaded.length === 0) {
            elements.uploadedList.innerHTML = `<div class="empty-state">Your safe vault is empty. Upload songs here and they will stay after refresh.</div>`;
            return;
        }

        elements.uploadedList.innerHTML = state.uploaded.map((track) => `
            <button class="track-row" data-track-id="${track.id}">
                <img src="${track.cover}" alt="" onerror="this.src='${fallbackCover}'">
                <span class="track-copy">
                    <strong>${escapeHtml(track.title)}</strong>
                    <span>${track.saved ? "Saved in vault" : "Session only"} / ${escapeHtml(track.artist)}</span>
                </span>
                <span class="track-time">${track.saved ? "Safe" : "New"}</span>
                <span class="track-remove" data-remove-id="${track.id}" title="Remove upload">
                    <i class="fa-solid fa-trash-can"></i>
                </span>
            </button>
        `).join("");

        elements.uploadedList.querySelectorAll(".track-row").forEach((row) => {
            row.addEventListener("click", (event) => {
                if (event.target.closest(".track-remove")) return;
                const queueIndex = state.queue.findIndex((track) => track.id === row.dataset.trackId);
                loadTrack(queueIndex, true);
                switchSection("library");
            });
        });

        elements.uploadedList.querySelectorAll(".track-remove").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                removeUploadedTrack(button.dataset.removeId);
            });
        });
    }

    async function removeUploadedTrack(trackId) {
        const track = state.uploaded.find((item) => item.id === trackId);
        if (!track) return;

        if (track.src && track.src.startsWith("blob:")) {
            URL.revokeObjectURL(track.src);
        }

        await deleteUploadedTrackFromVault(trackId);
        state.storedSongs.delete(trackId);
        saveStoredSongs();
        state.uploaded = state.uploaded.filter((item) => item.id !== trackId);
        state.queue = state.queue.filter((item) => item.id !== trackId);
        state.filteredQueue = state.filteredQueue.filter((item) => item.id !== trackId);

        if (state.currentIndex >= state.queue.length) {
            state.currentIndex = 0;
        }

        if (audio.src.includes(track.src)) {
            loadTrack(state.currentIndex, false);
        }

        renderAll();
        updateVaultStatus();
        showToast(`Removed "${track.title}" from the vault.`);
    }

    async function clearUploadedVault() {
        if (state.uploaded.length === 0) {
            showToast("The vault is already empty.");
            return;
        }

        state.uploaded.forEach((track) => {
            if (track.src && track.src.startsWith("blob:")) {
                URL.revokeObjectURL(track.src);
            }
        });

        await clearVaultStore();
        const uploadedIds = new Set(state.uploaded.map((track) => track.id));
        uploadedIds.forEach((id) => state.storedSongs.delete(id));
        saveStoredSongs();
        state.uploaded = [];
        state.queue = state.queue.filter((track) => !uploadedIds.has(track.id));
        state.filteredQueue = state.filteredQueue.filter((track) => !uploadedIds.has(track.id));
        state.currentIndex = 0;
        loadTrack(0, false);
        renderAll();
        updateVaultStatus();
        showToast("Uploaded songs cleared from the vault.");
    }

    function clearSearch() {
        elements.searchInput.value = "";
        state.filteredQueue = [...state.queue];
        renderTrackList();
    }

    function updateStats() {
        const artists = new Set(state.queue.map((track) => track.artist));
        elements.sidebarSongCount.textContent = state.queue.length;
        elements.sidebarArtistCount.textContent = artists.size;
        elements.metricTotalTracks.textContent = state.queue.length;
        elements.metricStoredTracks.textContent = state.storedSongs.size;
        elements.metricVaultTracks.textContent = state.uploaded.length;
        updateVaultStatus();
    }

    async function updateVaultStatus() {
        const count = state.uploaded.length;
        elements.vaultStatus.textContent = state.vaultSupported
            ? `${count} saved ${count === 1 ? "song" : "songs"}`
            : "Storage not supported";
        elements.vaultCount.textContent = `${count} saved ${count === 1 ? "song" : "songs"}`;

        if (!navigator.storage || !navigator.storage.estimate) {
            elements.vaultUsed.textContent = state.vaultSupported ? "Saved in this browser" : "Session storage only";
            elements.vaultMeterFill.style.width = count ? "18%" : "0%";
            return;
        }

        const estimate = await navigator.storage.estimate();
        const usage = estimate.usage || 0;
        const quota = estimate.quota || 1;
        const percent = Math.min((usage / quota) * 100, 100);
        elements.vaultUsed.textContent = `${formatBytes(usage)} used of ${formatBytes(quota)}`;
        elements.vaultMeterFill.style.width = `${Math.max(percent, count ? 4 : 0)}%`;
    }

    function setupAudioGraph() {
        if (state.audioContext) return;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        state.audioContext = new AudioContext();
        state.source = state.audioContext.createMediaElementSource(audio);
        state.analyser = state.audioContext.createAnalyser();
        state.analyser.fftSize = 128;
        state.source.connect(state.analyser);
        state.analyser.connect(state.audioContext.destination);
    }

    function startVisualizer() {
        if (!state.analyser) {
            drawIdleVisualizer();
            return;
        }

        const bufferLength = state.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            state.visualizerFrame = requestAnimationFrame(draw);
            state.analyser.getByteFrequencyData(dataArray);
            drawBars(dataArray);
        };

        if (!state.visualizerFrame) draw();
    }

    function stopVisualizer() {
        if (!state.visualizerFrame) return;
        cancelAnimationFrame(state.visualizerFrame);
        state.visualizerFrame = null;
    }

    function drawIdleVisualizer() {
        const data = Array.from({ length: 42 }, (_, index) => 30 + Math.sin(index * 0.8) * 18 + (index % 4) * 8);
        drawBars(data);
    }

    function drawBars(dataArray) {
        const width = canvas.width;
        const height = canvas.height;
        const gap = 4;
        const barWidth = width / dataArray.length - gap;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#211d24";
        ctx.fillRect(0, 0, width, height);

        dataArray.forEach((value, index) => {
            const normalized = Math.max(value / 255, 0.12);
            const barHeight = normalized * (height - 22);
            const x = index * (barWidth + gap);
            const y = height - barHeight - 10;
            const gradient = ctx.createLinearGradient(0, y, 0, height);
            gradient.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue("--accent").trim());
            gradient.addColorStop(1, "#f48a18");
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);
        });
    }

    function openVaultDb() {
        return new Promise((resolve, reject) => {
            if (!state.vaultSupported) {
                reject(new Error("IndexedDB is not supported."));
                return;
            }

            const request = indexedDB.open(vaultDbName, 1);

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(vaultStoreName)) {
                    db.createObjectStore(vaultStoreName, { keyPath: "id" });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async function readVaultStore(mode, callback) {
        const db = await openVaultDb();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(vaultStoreName, mode);
            const store = transaction.objectStore(vaultStoreName);
            const request = callback(store);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            transaction.oncomplete = () => db.close();
            transaction.onerror = () => {
                db.close();
                reject(transaction.error);
            };
        });
    }

    async function saveUploadedTrackToVault(track) {
        if (!state.vaultSupported || !track.file) return false;

        const record = {
            id: track.id,
            title: track.title,
            artist: track.artist,
            album: track.album,
            year: track.year,
            duration: track.duration,
            cover: track.cover,
            lyrics: track.lyrics,
            fileName: track.file.name,
            fileType: track.file.type,
            file: track.file,
            savedAt: Date.now()
        };

        try {
            await readVaultStore("readwrite", (store) => store.put(record));
            return true;
        } catch (error) {
            console.error(error);
            track.saved = false;
            showToast(`Could not save "${track.title}" to the vault.`);
            return false;
        }
    }

    async function loadUploadedTracksFromVault() {
        if (!state.vaultSupported) return [];

        try {
            const records = await readVaultStore("readonly", (store) => store.getAll());
            return records
                .sort((a, b) => (a.savedAt || 0) - (b.savedAt || 0))
                .map((record) => ({
                    id: record.id,
                    title: record.title,
                    artist: record.artist || "Uploaded file",
                    album: record.album || "Uploads",
                    year: record.year || new Date().getFullYear(),
                    duration: record.duration || "",
                    src: URL.createObjectURL(record.file),
                    cover: record.cover || fallbackCover,
                    lyrics: record.lyrics || `${record.fileName}\n\nNo lyrics have been added for this uploaded track yet.`,
                    saved: true
                }));
        } catch (error) {
            console.error(error);
            showToast("Could not open the music vault.");
            return [];
        }
    }

    async function deleteUploadedTrackFromVault(trackId) {
        if (!state.vaultSupported) return;

        try {
            await readVaultStore("readwrite", (store) => store.delete(trackId));
        } catch (error) {
            console.error(error);
            showToast("Could not remove that song from the vault.");
        }
    }

    async function clearVaultStore() {
        if (!state.vaultSupported) return;

        try {
            await readVaultStore("readwrite", (store) => store.clear());
        } catch (error) {
            console.error(error);
            showToast("Could not clear the vault.");
        }
    }

    function showToast(message) {
        elements.toast.textContent = message;
        elements.toast.classList.add("show");
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => elements.toast.classList.remove("show"), 2600);
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    init();
});
