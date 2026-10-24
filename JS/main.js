document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("audio-player");
    const canvas = document.getElementById("visualizer");
    const ctx = canvas.getContext("2d");

    const fallbackCover = "./images/logo-pm.png";
    const vaultDbName = "pulseMusicVault";
    const vaultStoreName = "savedTracks";
    const audioFilePattern = /\.(mp3|wav|ogg|oga|m4a|aac|flac|opus|webm)$/i;
    // Browsers silence Web Audio analysis for media opened via file://, so only
    // route playback through the analyser when the page is served over http(s).
    const canAnalyseAudio = location.protocol === "http:" || location.protocol === "https:";
    const accentPresets = ["#e1073b", "#ff6b2c", "#f5b301", "#1db954", "#2f80ed", "#8b5cf6", "#ec4899"];

    const tracks = [
        {
            id: "time-rise",
            title: "Time To Rise",
            artist: "VannDa",
            album: "Khmer Hip-Hop",
            year: 2019,
            src: "./music/VannDa-វណ្ណដា_Time_To_Right.mp3",
            cover: "https://i.scdn.co/image/ab67616d0000b273f8f43e519cd0e7cacd1f09e5",
            lyrics: "Lyrics are not added yet. Add your own lyrics in the song data when you have them."
        },
        {
            id: "mama",
            title: "MAMA",
            artist: "VannDa",
            album: "Singles",
            year: 2019,
            src: "./music/MAMA.mp3",
            cover: "https://i.ytimg.com/vi/WNL3zDgWZc0/hq720.jpg",
            lyrics: "A powerful VannDa track. Lyrics are not added yet."
        },
        {
            id: "catch-me",
            title: "Catch Me If You Can",
            artist: "VannDa",
            album: "Singles",
            year: 2021,
            src: "./music/Vannda-Catch-Me-If-You-Can.mp3",
            cover: "https://linkstorage.linkfire.com/medialinks/images/b2b2ffdf-caee-485f-b2f7-89cfd37faa2f/artwork-440x440.jpg",
            lyrics: "Lyrics are not added yet."
        },
        {
            id: "solo",
            title: "SOLO",
            artist: "VannDa",
            album: "Singles",
            year: 2020,
            src: "./music/VannDa-វណ្ណដា - SOLO (Explicit).mp3",
            cover: fallbackCover,
            lyrics: "Lyrics are not added yet."
        },
        {
            id: "sun-break",
            title: "ពេលមេឃបើកថ្ងៃ",
            artist: "VannDa x KWAN",
            album: "Khmer Hits",
            year: 2024,
            src: "./music/មេឃបើកថ្ងៃ.mp3",
            cover: "./images/ពេលមេឃបើកថ្ងៃ.png",
            lyrics: "Lyrics are not added yet."
        },
        {
            id: "wooden-box",
            title: "WOODEN BOX",
            artist: "VannDa",
            album: "Singles",
            year: 2020,
            src: "./music/WOODEN-BOX.mp3",
            cover: "https://i.ytimg.com/vi/O-n9cWeS7Is/sddefault.jpg",
            lyrics: "Lyrics are not added yet."
        },
        {
            id: "khmer-boy",
            title: "កម្លោះស្រុកខ្មែរ",
            artist: "Vanthan x VannDa",
            album: "Khmer Hits",
            year: 2020,
            src: "./music/Vanthan_x_VannDa_កម្លោះស្រុកខ្មែរ_Official_Video.mp3",
            cover: "https://i.scdn.co/image/ab67616d0000b273e5fdf77426bfa1a4819da82b",
            lyrics: "Lyrics are not added yet."
        },
        {
            id: "miss-you",
            title: "ជម្ងឺនឹកគេ",
            artist: "Sokmean",
            album: "Khmer Pop",
            year: 2022,
            src: "./music/ជម្ងឺនឹកគេ-Sokmean.mp3",
            cover: "./images/ជំងឺនឹកគេ.png",
            lyrics: "Lyrics are not added yet."
        }
    ];

    const playlists = [
        { id: "favorites", name: "Favorites", description: "Songs you mark with the heart button.", icon: "fa-heart", trackIds: [] },
        { id: "khmer-hits", name: "Khmer Hits", description: "Local favorites from your folder.", icon: "fa-star", trackIds: ["sun-break", "khmer-boy", "miss-you"] },
        { id: "vannda", name: "VannDa Essentials", description: "A quick run through the VannDa tracks.", icon: "fa-microphone", trackIds: ["time-rise", "mama", "catch-me", "solo", "wooden-box"] },
        { id: "uploads", name: "My Uploads", description: "Everything saved in your safe vault.", icon: "fa-cloud-arrow-up", trackIds: [] }
    ];

    const sections = {
        library: { eyebrow: "Browse", title: "Library" },
        playlists: { eyebrow: "Collections", title: "Playlists" },
        upload: { eyebrow: "Safe place", title: "Music Vault" },
        lyrics: { eyebrow: "Sing along", title: "Lyrics" },
        settings: { eyebrow: "Personalize", title: "Settings" }
    };

    const $ = (id) => document.getElementById(id);
    const elements = {
        albumArt: $("album-art"),
        heroBackdrop: $("hero-backdrop"),
        songTitle: $("song-title"),
        songArtist: $("song-artist"),
        playState: $("play-state"),
        playContext: $("play-context"),
        playBtn: $("play-btn"),
        heroPlayBtn: $("hero-play-btn"),
        prevBtn: $("prev-btn"),
        nextBtn: $("next-btn"),
        shuffleBtn: $("shuffle-btn"),
        repeatBtn: $("repeat-btn"),
        favoriteBtn: $("favorite-btn"),
        barFavoriteBtn: $("bar-favorite-btn"),
        heroLyricsBtn: $("hero-lyrics-btn"),
        barLyricsBtn: $("bar-lyrics-btn"),
        barArt: $("bar-art"),
        barTitle: $("bar-title"),
        barArtist: $("bar-artist"),
        muteBtn: $("mute-btn"),
        volumeSlider: $("volume-slider"),
        progressSlider: $("progress-slider"),
        currentTime: $("current-time"),
        totalTime: $("total-time"),
        sectionEyebrow: $("section-eyebrow"),
        sectionTitle: $("section-title"),
        searchInput: $("search-input"),
        trackList: $("track-list"),
        trackCount: $("track-count"),
        mixList: $("mix-list"),
        shelfCount: $("shelf-count"),
        playlistGrid: $("playlist-grid"),
        uploadedList: $("uploaded-list"),
        lyricsBox: $("lyrics-box"),
        lyricsArt: $("lyrics-art"),
        lyricsTitle: $("lyrics-title"),
        lyricsArtist: $("lyrics-artist"),
        fileInput: $("file-input"),
        uploadZone: $("upload-zone"),
        clearFilterBtn: $("clear-filter-btn"),
        clearVaultBtn: $("clear-vault-btn"),
        accentPicker: $("accent-picker"),
        accentSwatches: $("accent-swatches"),
        autoplayToggle: $("autoplay-toggle"),
        rememberVolumeToggle: $("remember-volume-toggle"),
        sidebarSongCount: $("sidebar-song-count"),
        sidebarArtistCount: $("sidebar-artist-count"),
        metricTotalTracks: $("metric-total-tracks"),
        metricStoredTracks: $("metric-stored-tracks"),
        metricVaultTracks: $("metric-vault-tracks"),
        vaultStatus: $("vault-status"),
        vaultCount: $("vault-count"),
        vaultUsed: $("vault-used"),
        vaultMeterFill: $("vault-meter-fill"),
        toast: $("toast")
    };

    const state = {
        library: [...tracks],
        order: tracks.map((track) => track.id),
        orderName: "Library",
        currentId: tracks[0].id,
        isPlaying: false,
        isShuffle: false,
        isRepeat: false,
        isSeeking: false,
        favorites: new Set(readSetting("pulseFavorites", [])),
        storedSongs: new Set(readSetting("pulseStoredSongs", [])),
        uploaded: [],
        audioContext: null,
        analyser: null,
        frequencyData: null,
        visualizerFrame: null,
        accentColor: "#e1073b",
        vaultSupported: "indexedDB" in window
    };

    async function init() {
        renderSwatches();
        applySavedSettings();
        bindEvents();
        resizeVisualizer();
        drawIdleVisualizer();

        state.uploaded = await loadUploadedTracksFromVault();
        state.library = [...tracks, ...state.uploaded];
        state.order = state.library.map((track) => track.id);

        loadTrack(state.library[0].id, false);
        renderAll();
        probeDurations(state.library);
        setupMediaSession();
        showToast(state.uploaded.length ? "Saved songs restored from your vault." : "Welcome to Pulse Music.");
    }

    /* ---------- Settings ---------- */

    function readSetting(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return fallback;
            try {
                return JSON.parse(raw);
            } catch {
                return raw;
            }
        } catch {
            return fallback;
        }
    }

    function writeSetting(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Storage can be full or blocked; the player still works without it.
        }
    }

    function applySavedSettings() {
        setAccent(readSetting("pulseAccent", accentPresets[0]));
        elements.autoplayToggle.checked = readSetting("pulseAutoplay", true) !== false;
        elements.rememberVolumeToggle.checked = readSetting("pulseRememberVolume", true) !== false;

        const savedVolume = Number(readSetting("pulseVolume", NaN));
        if (elements.rememberVolumeToggle.checked && Number.isFinite(savedVolume)) {
            elements.volumeSlider.value = Math.min(Math.max(savedVolume, 0), 100);
        }
        setVolume(Number(elements.volumeSlider.value));
    }

    function renderSwatches() {
        elements.accentSwatches.innerHTML = accentPresets.map((color) => `
            <button class="swatch" data-accent="${color}" style="--swatch: ${color}" title="${color}" aria-label="Accent ${color}"></button>
        `).join("");
    }

    function setAccent(color) {
        if (!/^#[0-9a-f]{6}$/i.test(color)) return;
        state.accentColor = color;
        document.documentElement.style.setProperty("--accent", color);
        elements.accentPicker.value = color;
        elements.accentSwatches.querySelectorAll(".swatch").forEach((swatch) => {
            swatch.classList.toggle("active", swatch.dataset.accent.toLowerCase() === color.toLowerCase());
        });
        if (!state.isPlaying) drawIdleVisualizer();
    }

    /* ---------- Events ---------- */

    function bindEvents() {
        document.querySelectorAll(".nav-link").forEach((button) => {
            button.addEventListener("click", () => switchSection(button.dataset.section));
        });

        elements.playBtn.addEventListener("click", togglePlay);
        elements.heroPlayBtn.addEventListener("click", togglePlay);
        elements.prevBtn.addEventListener("click", playPrevious);
        elements.nextBtn.addEventListener("click", playNext);
        elements.shuffleBtn.addEventListener("click", toggleShuffle);
        elements.repeatBtn.addEventListener("click", toggleRepeat);
        elements.favoriteBtn.addEventListener("click", toggleFavorite);
        elements.barFavoriteBtn.addEventListener("click", toggleFavorite);
        elements.heroLyricsBtn.addEventListener("click", () => switchSection("lyrics"));
        elements.barLyricsBtn.addEventListener("click", () => switchSection("lyrics"));
        elements.muteBtn.addEventListener("click", toggleMute);
        elements.clearFilterBtn.addEventListener("click", clearSearch);

        elements.volumeSlider.addEventListener("input", () => {
            setVolume(Number(elements.volumeSlider.value));
            if (elements.rememberVolumeToggle.checked) {
                writeSetting("pulseVolume", Number(elements.volumeSlider.value));
            }
        });

        // Hold progress updates while the user drags so the thumb does not jump back.
        elements.progressSlider.addEventListener("input", () => {
            state.isSeeking = true;
            paintRange(elements.progressSlider);
            if (Number.isFinite(audio.duration)) {
                elements.currentTime.textContent = formatTime((elements.progressSlider.value / 1000) * audio.duration);
            }
        });
        elements.progressSlider.addEventListener("change", () => {
            if (Number.isFinite(audio.duration)) {
                audio.currentTime = (elements.progressSlider.value / 1000) * audio.duration;
            }
            state.isSeeking = false;
        });

        elements.searchInput.addEventListener("input", () => {
            if (!document.getElementById("library-section").classList.contains("active")) {
                switchSection("library");
            }
            renderTrackList();
        });

        elements.accentPicker.addEventListener("input", () => {
            setAccent(elements.accentPicker.value);
            writeSetting("pulseAccent", elements.accentPicker.value);
        });

        elements.accentSwatches.addEventListener("click", (event) => {
            const swatch = event.target.closest("[data-accent]");
            if (!swatch) return;
            setAccent(swatch.dataset.accent);
            writeSetting("pulseAccent", swatch.dataset.accent);
        });

        elements.autoplayToggle.addEventListener("change", () => {
            writeSetting("pulseAutoplay", elements.autoplayToggle.checked);
        });

        elements.rememberVolumeToggle.addEventListener("change", () => {
            writeSetting("pulseRememberVolume", elements.rememberVolumeToggle.checked);
            if (elements.rememberVolumeToggle.checked) {
                writeSetting("pulseVolume", Number(elements.volumeSlider.value));
            }
        });

        elements.trackList.addEventListener("click", (event) => {
            const storeButton = event.target.closest("[data-store-id]");
            if (storeButton) {
                storeTrack(storeButton.dataset.storeId);
                return;
            }
            const row = event.target.closest("[data-track-id]");
            if (row) playFromLibrary(row.dataset.trackId);
        });

        elements.mixList.addEventListener("click", (event) => {
            const removeButton = event.target.closest("[data-shelf-remove]");
            if (removeButton) {
                unstoreTrack(removeButton.dataset.shelfRemove);
                return;
            }
            if (event.target.closest("[data-play-stored]")) {
                playTrackSet([...state.storedSongs], "Stored Music");
                return;
            }
            const card = event.target.closest("[data-shelf-play]");
            if (card) playTrackSet([...state.storedSongs], "Stored Music", card.dataset.shelfPlay);
        });

        elements.playlistGrid.addEventListener("click", (event) => {
            const button = event.target.closest("[data-playlist-id]");
            if (!button) return;
            const playlist = playlists.find((item) => item.id === button.dataset.playlistId);
            if (playlist) playTrackSet(playlist.trackIds, playlist.name);
        });

        elements.uploadedList.addEventListener("click", (event) => {
            const removeButton = event.target.closest("[data-remove-id]");
            if (removeButton) {
                removeUploadedTrack(removeButton.dataset.removeId);
                return;
            }
            const row = event.target.closest("[data-track-id]");
            if (row) playTrackSet(state.uploaded.map((track) => track.id), "My Uploads", row.dataset.trackId);
        });

        // Rows act as buttons, so let Enter play them from the keyboard.
        [elements.trackList, elements.uploadedList, elements.mixList].forEach((list) => {
            list.addEventListener("keydown", (event) => {
                if (event.key !== "Enter" || event.target.closest("button")) return;
                const row = event.target.closest("[role='button']");
                if (row) {
                    event.preventDefault();
                    row.click();
                }
            });
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

        elements.albumArt.addEventListener("error", () => useFallbackCover(elements.albumArt));
        elements.barArt.addEventListener("error", () => useFallbackCover(elements.barArt));
        elements.lyricsArt.addEventListener("error", () => useFallbackCover(elements.lyricsArt));

        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("play", () => setPlaying(true));
        audio.addEventListener("pause", () => setPlaying(false));
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", () => {
            if (!audio.getAttribute("src")) return;
            setPlaying(false);
            const track = getCurrentTrack();
            showToast(`Could not play "${track ? track.title : "this song"}". Check that the file exists.`);
        });

        window.addEventListener("resize", () => {
            resizeVisualizer();
            if (!state.isPlaying) drawIdleVisualizer();
        });

        document.addEventListener("keydown", handleShortcut);
    }

    function handleShortcut(event) {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        const target = event.target;
        const isSlider = target.tagName === "INPUT" && target.type === "range";
        const isTyping = !isSlider && target.closest("input, textarea, select, [contenteditable='true']");
        const key = (event.key || "").toLowerCase();

        if (key === "/" && !isTyping) {
            event.preventDefault();
            switchSection("library");
            elements.searchInput.focus();
            return;
        }
        if (isTyping) return;

        if (event.code === "Space" || key === "k") {
            // Stop Space from also clicking whatever button has focus.
            event.preventDefault();
            togglePlay();
        } else if (isSlider) {
            // Let a focused slider keep its native arrow-key behaviour.
            return;
        } else if (event.key === "ArrowRight") {
            playNext();
        } else if (event.key === "ArrowLeft") {
            playPrevious();
        } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            const step = event.key === "ArrowUp" ? 5 : -5;
            elements.volumeSlider.value = Math.min(Math.max(Number(elements.volumeSlider.value) + step, 0), 100);
            elements.volumeSlider.dispatchEvent(new Event("input"));
        } else if (key === "m") {
            toggleMute();
        } else if (key === "s") {
            toggleShuffle();
        } else if (key === "r") {
            toggleRepeat();
        } else if (key === "f") {
            toggleFavorite();
        }
    }

    function switchSection(section) {
        if (!sections[section]) return;

        document.querySelectorAll(".nav-link").forEach((button) => {
            button.classList.toggle("active", button.dataset.section === section);
        });

        document.querySelectorAll(".view").forEach((view) => {
            view.classList.toggle("active", view.id === `${section}-section`);
        });

        elements.sectionEyebrow.textContent = sections[section].eyebrow;
        elements.sectionTitle.textContent = sections[section].title;
        document.querySelector(".main").scrollTop = 0;

        if (section === "library") {
            requestAnimationFrame(() => {
                resizeVisualizer();
                if (!state.isPlaying) drawIdleVisualizer();
            });
        }
    }

    /* ---------- Playback ---------- */

    function findTrack(trackId) {
        return state.library.find((track) => track.id === trackId);
    }

    function getCurrentTrack() {
        return findTrack(state.currentId);
    }

    function loadTrack(trackId, shouldPlay = state.isPlaying) {
        const track = findTrack(trackId) || state.library[0];
        if (!track) return;

        state.currentId = track.id;
        audio.src = track.src;

        updateNowPlaying(track);
        elements.totalTime.textContent = track.duration || "0:00";
        elements.currentTime.textContent = "0:00";
        setRangeValue(elements.progressSlider, 0);
        renderTrackList();
        renderMixes();
        renderUploaded();

        if (shouldPlay) playAudio();
    }

    function updateNowPlaying(track) {
        const cover = track.cover || fallbackCover;
        const details = [track.artist, track.album, track.year].filter(Boolean).join(" · ");

        [elements.albumArt, elements.barArt, elements.lyricsArt].forEach((image) => {
            image.src = cover;
        });
        elements.albumArt.alt = `${track.title} cover`;
        elements.heroBackdrop.style.backgroundImage = `url("${cover}")`;
        elements.songTitle.textContent = track.title;
        elements.songArtist.textContent = details;
        elements.playContext.textContent = state.orderName;
        elements.barTitle.textContent = track.title;
        elements.barArtist.textContent = track.artist;
        elements.lyricsTitle.textContent = track.title;
        elements.lyricsArtist.textContent = details;
        elements.lyricsBox.textContent = track.lyrics || "No lyrics have been added for this song yet.";
        document.title = `${track.title} · ${track.artist} | Pulse Music`;

        updateFavoriteButton();
        updateMediaSession(track);
    }

    function useFallbackCover(image) {
        if (!image.src.endsWith("logo-pm.png")) image.src = fallbackCover;
    }

    function playAudio() {
        setupAudioGraph();
        if (state.audioContext && state.audioContext.state === "suspended") {
            state.audioContext.resume();
        }
        const attempt = audio.play();
        if (attempt) {
            attempt.catch((error) => {
                if (error.name === "NotAllowedError") showToast("Press play to start listening.");
            });
        }
    }

    function togglePlay() {
        if (audio.paused) {
            playAudio();
        } else {
            audio.pause();
        }
    }

    function setPlaying(isPlaying) {
        state.isPlaying = isPlaying;
        document.body.classList.toggle("is-playing", isPlaying);
        updatePlayButton();
        if (isPlaying) {
            startVisualizer();
        } else {
            stopVisualizer();
            drawIdleVisualizer();
        }
        if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
        }
    }

    function handleEnded() {
        if (state.isRepeat) {
            audio.currentTime = 0;
            playAudio();
        } else if (elements.autoplayToggle.checked) {
            playNext();
        } else {
            setPlaying(false);
        }
    }

    // The order is what next/previous walk through: the library, a playlist, the shelf...
    function getOrder() {
        const ids = state.order.filter((id) => findTrack(id));
        return ids.length ? ids : state.library.map((track) => track.id);
    }

    function playNext() {
        const order = getOrder();
        if (state.isShuffle && order.length > 1) {
            const choices = order.filter((id) => id !== state.currentId);
            loadTrack(choices[Math.floor(Math.random() * choices.length)], true);
            return;
        }
        const index = order.indexOf(state.currentId);
        loadTrack(order[(index + 1) % order.length], true);
    }

    function playPrevious() {
        if (audio.currentTime > 4) {
            audio.currentTime = 0;
            return;
        }
        const order = getOrder();
        const index = order.indexOf(state.currentId);
        loadTrack(order[index <= 0 ? order.length - 1 : index - 1], true);
    }

    function playFromLibrary(trackId) {
        const query = elements.searchInput.value.trim();
        state.order = getVisibleStoreTracks(query).map((track) => track.id);
        state.orderName = query ? "Search results" : "Library";
        if (trackId === state.currentId) {
            elements.playContext.textContent = state.orderName;
            togglePlay();
            return;
        }
        loadTrack(trackId, true);
    }

    function playTrackSet(ids, name, startId) {
        const list = ids.filter((id) => findTrack(id));
        if (list.length === 0) {
            showToast(`${name} has no songs yet.`);
            return;
        }

        state.order = list;
        state.orderName = name;
        const firstId = list.includes(startId)
            ? startId
            : state.isShuffle ? list[Math.floor(Math.random() * list.length)] : list[0];
        loadTrack(firstId, true);
        if (!startId) showToast(`Playing ${name}`);
    }

    function toggleShuffle() {
        state.isShuffle = !state.isShuffle;
        elements.shuffleBtn.classList.toggle("active", state.isShuffle);
        showToast(state.isShuffle ? "Shuffle on" : "Shuffle off");
    }

    function toggleRepeat() {
        state.isRepeat = !state.isRepeat;
        elements.repeatBtn.classList.toggle("active", state.isRepeat);
        showToast(state.isRepeat ? "Repeat one on" : "Repeat off");
    }

    function setVolume(value) {
        audio.volume = value / 100;
        if (value > 0 && audio.muted) audio.muted = false;
        paintRange(elements.volumeSlider);
        updateVolumeIcon();
    }

    function toggleMute() {
        audio.muted = !audio.muted;
        updateVolumeIcon();
        showToast(audio.muted ? "Muted" : "Sound on");
    }

    function updateVolumeIcon() {
        const level = audio.muted ? 0 : audio.volume;
        const icon = level === 0 ? "xmark" : level < 0.5 ? "low" : "high";
        elements.muteBtn.innerHTML = `<i class="fa-solid fa-volume-${icon}"></i>`;
        elements.muteBtn.title = audio.muted ? "Unmute (M)" : "Mute (M)";
    }

    function toggleFavorite() {
        const track = getCurrentTrack();
        if (!track) return;

        if (state.favorites.has(track.id)) {
            state.favorites.delete(track.id);
            showToast("Removed from Favorites");
        } else {
            state.favorites.add(track.id);
            showToast("Added to Favorites");
        }

        writeSetting("pulseFavorites", [...state.favorites]);
        updateFavoriteButton();
        renderPlaylists();
    }

    function storeTrack(trackId) {
        const track = findTrack(trackId);
        if (!track) return;

        state.storedSongs.add(trackId);
        saveStoredSongs();
        renderTrackList();
        renderMixes();
        updateStats();
        showToast(`Moved "${track.title}" to your shelf.`);
    }

    function unstoreTrack(trackId) {
        const track = findTrack(trackId);
        if (!track) return;

        state.storedSongs.delete(trackId);
        saveStoredSongs();
        renderTrackList();
        renderMixes();
        updateStats();
        showToast(`Moved "${track.title}" back to the library.`);
    }

    function saveStoredSongs() {
        writeSetting("pulseStoredSongs", [...state.storedSongs]);
    }

    function updateFavoriteButton() {
        const track = getCurrentTrack();
        const isFavorite = Boolean(track && state.favorites.has(track.id));
        const iconClass = `${isFavorite ? "fa-solid" : "fa-regular"} fa-heart`;

        elements.favoriteBtn.classList.toggle("active", isFavorite);
        elements.favoriteBtn.innerHTML = `<i class="${iconClass}"></i><span>${isFavorite ? "Favorited" : "Favorite"}</span>`;
        elements.barFavoriteBtn.classList.toggle("active", isFavorite);
        elements.barFavoriteBtn.innerHTML = `<i class="${iconClass}"></i>`;
        elements.barFavoriteBtn.title = isFavorite ? "Remove from Favorites (F)" : "Add to Favorites (F)";
    }

    function updatePlayButton() {
        const icon = state.isPlaying ? "pause" : "play";
        const label = state.isPlaying ? "Pause" : "Play";
        elements.playBtn.innerHTML = `<i class="fa-solid fa-${icon}"></i>`;
        elements.playBtn.title = `${label} (Space)`;
        elements.heroPlayBtn.innerHTML = `<i class="fa-solid fa-${icon}"></i><span>${label}</span>`;
        elements.playState.textContent = state.isPlaying ? "Now playing" : "Paused";
    }

    function updateDuration() {
        elements.totalTime.textContent = formatTime(audio.duration);
        const track = getCurrentTrack();
        if (track && !track.duration && Number.isFinite(audio.duration)) {
            setTrackDuration(track, audio.duration);
        }
    }

    function updateProgress() {
        if (state.isSeeking || !Number.isFinite(audio.duration) || audio.duration === 0) return;
        setRangeValue(elements.progressSlider, (audio.currentTime / audio.duration) * 1000);
        elements.currentTime.textContent = formatTime(audio.currentTime);
        if ("mediaSession" in navigator && navigator.mediaSession.setPositionState) {
            try {
                navigator.mediaSession.setPositionState({
                    duration: audio.duration,
                    position: Math.min(audio.currentTime, audio.duration),
                    playbackRate: audio.playbackRate
                });
            } catch {
                // Some browsers reject position updates mid-load.
            }
        }
    }

    function setRangeValue(input, value) {
        input.value = value;
        paintRange(input);
    }

    function paintRange(input) {
        const min = Number(input.min) || 0;
        const max = Number(input.max) || 100;
        const percent = ((Number(input.value) - min) / (max - min)) * 100;
        input.style.setProperty("--fill", `${percent}%`);
    }

    // Read the real length of each song instead of trusting hard-coded values.
    function probeDurations(list) {
        list.filter((track) => !track.duration).forEach((track) => {
            const probe = new Audio();
            probe.preload = "metadata";
            probe.addEventListener("loadedmetadata", () => {
                setTrackDuration(track, probe.duration);
                probe.removeAttribute("src");
                probe.load();
            }, { once: true });
            probe.src = track.src;
        });
    }

    function setTrackDuration(track, seconds) {
        if (!Number.isFinite(seconds)) return;
        track.duration = formatTime(seconds);
        document.querySelectorAll(`[data-duration="${track.id}"]`).forEach((cell) => {
            cell.textContent = track.duration;
        });
        if (track.id === state.currentId && !Number.isFinite(audio.duration)) {
            elements.totalTime.textContent = track.duration;
        }
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

    /* ---------- Rendering ---------- */

    function renderAll() {
        renderTrackList();
        renderMixes();
        renderPlaylists();
        renderUploaded();
        updateStats();
    }

    function coverImage(track) {
        return `<img src="${escapeHtml(track.cover || fallbackCover)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${fallbackCover}'">`;
    }

    function indexCell(number) {
        return `
            <span class="track-index">
                <span class="index-num">${number}</span>
                <i class="fa-solid fa-play index-play"></i>
                <span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>
            </span>
        `;
    }

    function renderTrackList() {
        const query = elements.searchInput.value.trim();
        const visible = getVisibleStoreTracks(query);

        elements.trackCount.textContent = query
            ? `${visible.length} ${visible.length === 1 ? "result" : "results"} for "${query}"`
            : `${visible.length} ${visible.length === 1 ? "song" : "songs"}`;
        elements.clearFilterBtn.hidden = !query;

        if (visible.length === 0) {
            elements.trackList.innerHTML = query
                ? `<div class="empty-state"><i class="fa-solid fa-magnifying-glass"></i><strong>No matches</strong><span>No songs match "${escapeHtml(query)}".</span></div>`
                : `<div class="empty-state"><i class="fa-solid fa-box-archive"></i><strong>Everything is on your shelf</strong><span>Move a song back to see it here.</span></div>`;
            return;
        }

        elements.trackList.innerHTML = visible.map((track, index) => `
            <div class="track-row ${track.id === state.currentId ? "active" : ""}" data-track-id="${track.id}" role="button" tabindex="0" aria-label="Play ${escapeHtml(track.title)}">
                ${indexCell(index + 1)}
                ${coverImage(track)}
                <span class="track-copy">
                    <strong>${escapeHtml(track.title)}</strong>
                    <span>${escapeHtml(track.artist)}</span>
                </span>
                <span class="track-album">${escapeHtml(track.album)}</span>
                <span class="track-time" data-duration="${track.id}">${track.duration || "--:--"}</span>
                <button class="row-btn" data-store-id="${track.id}" title="Move to shelf" aria-label="Move ${escapeHtml(track.title)} to shelf">
                    <i class="fa-solid fa-box-archive"></i>
                </button>
            </div>
        `).join("");
    }

    function renderMixes() {
        const storedTracks = [...state.storedSongs].map(findTrack).filter(Boolean);
        elements.shelfCount.textContent = storedTracks.length
            ? `${storedTracks.length} ${storedTracks.length === 1 ? "song" : "songs"} saved`
            : "Your personal shelf";

        if (storedTracks.length === 0) {
            elements.mixList.innerHTML = `
                <div class="shelf-empty">
                    <i class="fa-solid fa-box-open"></i>
                    <strong>No stored songs yet</strong>
                    <span>Use the shelf button on any song to keep it here.</span>
                </div>
            `;
            return;
        }

        elements.mixList.innerHTML = `
            <button class="btn btn-ghost shelf-play-all" data-play-stored>
                <i class="fa-solid fa-circle-play"></i>
                <span>Play all stored songs</span>
            </button>
            ${storedTracks.map((track) => `
                <div class="stored-card ${track.id === state.currentId ? "active" : ""}" data-shelf-play="${track.id}" role="button" tabindex="0" aria-label="Play ${escapeHtml(track.title)}">
                    ${coverImage(track)}
                    <div>
                        <strong>${escapeHtml(track.title)}</strong>
                        <span>${escapeHtml(track.artist)}</span>
                    </div>
                    <span class="track-time" data-duration="${track.id}">${track.duration || ""}</span>
                    <button class="row-btn" data-shelf-remove="${track.id}" title="Move back to library" aria-label="Move ${escapeHtml(track.title)} back to library">
                        <i class="fa-solid fa-arrow-rotate-left"></i>
                    </button>
                </div>
            `).join("")}
        `;
    }

    function getVisibleStoreTracks(query = "") {
        const normalizedQuery = query.trim().toLowerCase();

        return state.library.filter((track) => {
            if (state.storedSongs.has(track.id)) return false;
            return [track.title, track.artist, track.album, track.year]
                .join(" ")
                .toLowerCase()
                .includes(normalizedQuery);
        });
    }

    function renderPlaylists() {
        playlists[0].trackIds = [...state.favorites];
        playlists[3].trackIds = state.uploaded.map((track) => track.id);

        elements.playlistGrid.innerHTML = playlists.map((playlist) => {
            const list = playlist.trackIds.map(findTrack).filter(Boolean);
            const covers = [...new Set(list.map((track) => track.cover || fallbackCover))];
            let art;

            if (covers.length >= 4) {
                art = `<div class="playlist-art mosaic">${covers.slice(0, 4).map((cover) => `<img src="${escapeHtml(cover)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${fallbackCover}'">`).join("")}</div>`;
            } else if (covers.length > 0) {
                art = `<div class="playlist-art"><img src="${escapeHtml(covers[0])}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${fallbackCover}'"></div>`;
            } else {
                art = `<div class="playlist-art placeholder"><i class="fa-solid ${playlist.icon}"></i></div>`;
            }

            return `
                <article class="playlist-card">
                    ${art}
                    <div class="playlist-body">
                        <strong>${escapeHtml(playlist.name)}</strong>
                        <span>${escapeHtml(playlist.description)}</span>
                        <span class="playlist-meta">${list.length} ${list.length === 1 ? "song" : "songs"}</span>
                    </div>
                    <button class="btn btn-primary btn-sm" data-playlist-id="${playlist.id}" ${list.length ? "" : "disabled"}>
                        <i class="fa-solid fa-play"></i>
                        <span>Play</span>
                    </button>
                </article>
            `;
        }).join("");
    }

    function renderUploaded() {
        if (state.uploaded.length === 0) {
            elements.uploadedList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-shield-halved"></i>
                    <strong>Your vault is empty</strong>
                    <span>Upload songs above and they will stay after refresh.</span>
                </div>
            `;
            return;
        }

        elements.uploadedList.innerHTML = state.uploaded.map((track, index) => `
            <div class="track-row ${track.id === state.currentId ? "active" : ""}" data-track-id="${track.id}" role="button" tabindex="0" aria-label="Play ${escapeHtml(track.title)}">
                ${indexCell(index + 1)}
                ${coverImage(track)}
                <span class="track-copy">
                    <strong>${escapeHtml(track.title)}</strong>
                    <span>${track.saved ? "Saved in vault" : "This session only"}</span>
                </span>
                <span class="track-time" data-duration="${track.id}">${track.duration || "--:--"}</span>
                <button class="row-btn danger" data-remove-id="${track.id}" title="Remove upload" aria-label="Remove ${escapeHtml(track.title)}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `).join("");
    }

    function clearSearch() {
        elements.searchInput.value = "";
        renderTrackList();
        elements.searchInput.focus();
    }

    function updateStats() {
        const artists = new Set(state.library.map((track) => track.artist));
        elements.sidebarSongCount.textContent = state.library.length;
        elements.sidebarArtistCount.textContent = artists.size;
        elements.metricTotalTracks.textContent = state.library.length;
        elements.metricStoredTracks.textContent = [...state.storedSongs].filter(findTrack).length;
        elements.metricVaultTracks.textContent = state.uploaded.length;
        updateVaultStatus();
    }

    /* ---------- Uploads ---------- */

    async function handleFiles(fileList) {
        const files = [...fileList].filter((file) => file.type.startsWith("audio/") || audioFilePattern.test(file.name));
        elements.fileInput.value = "";

        if (files.length === 0) {
            showToast("Choose audio files only.");
            return;
        }

        showToast(state.vaultSupported
            ? "Saving songs to your safe vault..."
            : "This browser cannot save songs permanently. They will stay for this session only.");

        const newTracks = files.map((file, index) => ({
            id: `upload-${Date.now()}-${index}`,
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Uploaded file",
            album: "Uploads",
            year: new Date().getFullYear(),
            duration: "",
            src: URL.createObjectURL(file),
            cover: fallbackCover,
            lyrics: "No lyrics have been added for this uploaded track yet.",
            file,
            saved: false
        }));

        const saveResults = await Promise.all(newTracks.map((track) => saveUploadedTrackToVault(track)));
        newTracks.forEach((track, index) => {
            track.saved = saveResults[index];
            delete track.file;
        });

        state.uploaded.push(...newTracks);
        state.library.push(...newTracks);
        if (state.orderName === "Library") {
            state.order.push(...newTracks.map((track) => track.id));
        }

        renderAll();
        probeDurations(newTracks);

        const savedCount = saveResults.filter(Boolean).length;
        showToast(savedCount === files.length
            ? `${files.length} ${files.length === 1 ? "song" : "songs"} saved in your vault.`
            : `${files.length} added, ${savedCount} saved permanently.`);
    }

    function forgetUploads(ids) {
        const removedCurrent = ids.has(state.currentId);

        ids.forEach((id) => state.storedSongs.delete(id));
        saveStoredSongs();
        state.library = state.library.filter((track) => !ids.has(track.id));
        state.order = state.order.filter((id) => !ids.has(id));

        if (removedCurrent) {
            audio.pause();
            loadTrack(state.library[0].id, false);
        }
    }

    async function removeUploadedTrack(trackId) {
        const track = state.uploaded.find((item) => item.id === trackId);
        if (!track) return;

        await deleteUploadedTrackFromVault(trackId);
        state.uploaded = state.uploaded.filter((item) => item.id !== trackId);
        forgetUploads(new Set([trackId]));
        URL.revokeObjectURL(track.src);

        renderAll();
        showToast(`Removed "${track.title}" from the vault.`);
    }

    async function clearUploadedVault() {
        if (state.uploaded.length === 0) {
            showToast("The vault is already empty.");
            return;
        }
        if (!confirm(`Remove all ${state.uploaded.length} uploaded songs from the vault? This cannot be undone.`)) return;

        const removed = state.uploaded;
        await clearVaultStore();
        state.uploaded = [];
        forgetUploads(new Set(removed.map((track) => track.id)));
        removed.forEach((track) => URL.revokeObjectURL(track.src));

        renderAll();
        showToast("Uploaded songs cleared from the vault.");
    }

    async function updateVaultStatus() {
        const count = state.uploaded.length;
        const label = `${count} saved ${count === 1 ? "song" : "songs"}`;
        elements.vaultStatus.textContent = state.vaultSupported ? label : "Storage not supported";
        elements.vaultCount.textContent = label;

        if (!navigator.storage || !navigator.storage.estimate) {
            elements.vaultUsed.textContent = state.vaultSupported ? "Saved in this browser" : "Session storage only";
            elements.vaultMeterFill.style.width = count ? "18%" : "0%";
            return;
        }

        try {
            const estimate = await navigator.storage.estimate();
            const usage = estimate.usage || 0;
            const quota = estimate.quota || 1;
            const percent = Math.min((usage / quota) * 100, 100);
            elements.vaultUsed.textContent = `${formatBytes(usage)} used of ${formatBytes(quota)}`;
            elements.vaultMeterFill.style.width = `${Math.max(percent, count ? 4 : 0)}%`;
        } catch {
            elements.vaultUsed.textContent = "Saved in this browser";
        }
    }

    /* ---------- Visualizer ---------- */

    function setupAudioGraph() {
        if (state.audioContext || !canAnalyseAudio) return;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        try {
            state.audioContext = new AudioContext();
            const source = state.audioContext.createMediaElementSource(audio);
            state.analyser = state.audioContext.createAnalyser();
            state.analyser.fftSize = 256;
            state.analyser.smoothingTimeConstant = 0.8;
            state.frequencyData = new Uint8Array(state.analyser.frequencyBinCount);
            source.connect(state.analyser);
            state.analyser.connect(state.audioContext.destination);
        } catch (error) {
            console.error(error);
            state.analyser = null;
        }
    }

    function resizeVisualizer() {
        const ratio = window.devicePixelRatio || 1;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (!width || !height) return;
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function barCount() {
        return Math.max(Math.floor(canvas.clientWidth / 7), 12);
    }

    function startVisualizer() {
        if (state.visualizerFrame) return;

        const draw = (time) => {
            state.visualizerFrame = requestAnimationFrame(draw);
            const count = barCount();
            let levels;

            if (state.analyser) {
                state.analyser.getByteFrequencyData(state.frequencyData);
                // The top of the spectrum is mostly empty, so spread the lower 70% across the bars.
                const usable = state.frequencyData.length * 0.7;
                levels = Array.from({ length: count }, (_, index) => state.frequencyData[Math.floor((index / count) * usable)] / 255);
            } else {
                const t = time / 1000;
                levels = Array.from({ length: count }, (_, index) => {
                    const wave = Math.abs(Math.sin(index * 0.33 + t * 2.4)) * (0.55 + 0.45 * Math.sin(t * 1.3 + index * 0.11));
                    return 0.15 + wave * 0.7;
                });
            }

            drawBars(levels);
        };

        state.visualizerFrame = requestAnimationFrame(draw);
    }

    function stopVisualizer() {
        if (!state.visualizerFrame) return;
        cancelAnimationFrame(state.visualizerFrame);
        state.visualizerFrame = null;
    }

    function drawIdleVisualizer() {
        const count = barCount();
        drawBars(Array.from({ length: count }, (_, index) => 0.08 + Math.abs(Math.sin(index * 0.45)) * 0.14));
    }

    function drawBars(levels) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (!width || !height) return;

        const gap = 3;
        const barWidth = Math.max((width - gap * (levels.length - 1)) / levels.length, 1);

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = state.accentColor;

        levels.forEach((level, index) => {
            const barHeight = Math.max(level, 0.05) * height;
            const x = index * (barWidth + gap);
            const y = height - barHeight;
            ctx.globalAlpha = 0.35 + Math.min(level, 1) * 0.65;
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
            } else {
                ctx.rect(x, y, barWidth, barHeight);
            }
            ctx.fill();
        });

        ctx.globalAlpha = 1;
    }

    /* ---------- Media Session (OS media keys / lock screen) ---------- */

    function setupMediaSession() {
        if (!("mediaSession" in navigator)) return;

        const handlers = {
            play: playAudio,
            pause: () => audio.pause(),
            previoustrack: playPrevious,
            nexttrack: playNext,
            seekto: (details) => {
                if (Number.isFinite(details.seekTime)) audio.currentTime = details.seekTime;
            }
        };

        Object.entries(handlers).forEach(([action, handler]) => {
            try {
                navigator.mediaSession.setActionHandler(action, handler);
            } catch {
                // Action not supported in this browser.
            }
        });
    }

    function updateMediaSession(track) {
        if (!("mediaSession" in navigator) || !window.MediaMetadata) return;
        navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title,
            artist: track.artist,
            album: track.album,
            artwork: [{ src: new URL(track.cover || fallbackCover, location.href).href }]
        });
    }

    /* ---------- Vault storage (IndexedDB) ---------- */

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
            showToast(`Could not save "${track.title}" to the vault.`);
            return false;
        }
    }

    async function loadUploadedTracksFromVault() {
        if (!state.vaultSupported) return [];

        try {
            const records = await readVaultStore("readonly", (store) => store.getAll());
            return records
                .filter((record) => record.file)
                .sort((a, b) => (a.savedAt || 0) - (b.savedAt || 0))
                .map((record) => ({
                    id: record.id,
                    title: record.title,
                    artist: record.artist || "Uploaded file",
                    album: record.album || "Uploads",
                    year: record.year || new Date().getFullYear(),
                    duration: "",
                    src: URL.createObjectURL(record.file),
                    cover: record.cover || fallbackCover,
                    lyrics: record.lyrics || "No lyrics have been added for this uploaded track yet.",
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

    /* ---------- Helpers ---------- */

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
