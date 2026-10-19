const EMBED_URL = "https://www.youtube.com/embed/";

export function initProjectVideos() {
  const gallery = document.querySelector("[data-projects-gallery]");
  if (!gallery) return;

  let playing = null;

  function stop() {
    if (!playing) return;
    playing.iframe.replaceWith(playing.placeholder);
    playing.card.querySelectorAll(".project-episode.is-playing").forEach((item) => item.classList.remove("is-playing"));
    playing = null;
  }

  function play(trigger) {
    const card = trigger.closest(".project-card");
    const frame = card.querySelector(".project-video");

    stop();

    const placeholder = frame.querySelector(".project-play");
    if (!placeholder) return;

    const params = new URLSearchParams({ autoplay: "1", rel: "0", cc_load_policy: "0" });
    const iframe = document.createElement("iframe");
    iframe.src = `${EMBED_URL}${encodeURIComponent(trigger.dataset.videoId)}?${params}`;
    iframe.title = trigger.getAttribute("aria-label").replace(/^Assistir (ao vídeo|ao episódio): ?/, "");
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;

    placeholder.replaceWith(iframe);
    iframe.focus();
    if (trigger.classList.contains("project-episode")) trigger.classList.add("is-playing");
    playing = { card, iframe, placeholder };
  }

  gallery.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-video-id]");
    if (trigger) play(trigger);
  });
}
