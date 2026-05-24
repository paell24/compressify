async function uploadVideo(){

    const fileInput =
        document.getElementById("videoInput");

    if(fileInput.files.length === 0){

        alert("Choose video first!");
        return;
    }

    const loading =
        document.getElementById("loading");

    const result =
        document.getElementById("result");

    loading.classList.remove("hidden");

    result.classList.add("hidden");

    const formData = new FormData();

    formData.append(
        "video",
        fileInput.files[0]
    );

    formData.append(
        "quality",
        document.getElementById("quality").value
    );

    try{

        const response =
            await fetch("/compress",{
                method:"POST",
                body:formData
            });

        const data =
            await response.json();

        loading.classList.add("hidden");

        result.classList.remove("hidden");

        document.getElementById("beforeSize")
            .innerText = data.before + " MB";

        document.getElementById("afterSize")
            .innerText = data.after + " MB";

        document.getElementById("summaryBefore")
            .innerText = data.before + " MB";

        document.getElementById("summaryAfter")
            .innerText = data.after + " MB";

        document.getElementById("compressionPercent")
            .innerText = data.compression + "%";

        document.getElementById("summaryCompression")
            .innerText = data.compression + "%";

        const originalVideo =
            document.getElementById("originalVideo");

        originalVideo.src =
            data.original_video;

        originalVideo.load();

        const compressedVideo =
            document.getElementById("compressedVideo");

        compressedVideo.src =
            data.compressed_video;

        compressedVideo.load();

        document.getElementById("downloadBtn")
            .href = data.download;

        originalVideo.onloadedmetadata = () => {

            const duration =
                formatTime(originalVideo.duration);

            document.getElementById("videoDuration")
                .innerText = duration;

            document.getElementById("compressedDuration")
                .innerText = duration;
        };

    }catch(error){

        loading.classList.add("hidden");

        alert("Failed to compress video!");
    }
}

function formatTime(seconds){

    const mins =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);

    return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}

document.getElementById("videoInput")
.addEventListener("change",function(){

    if(this.files.length > 0){

        document.getElementById("fileName")
            .innerText =
            this.files[0].name;
    }
});

function openAbout(){

    document.getElementById("aboutModal")
        .classList.remove("hidden");
}

function closeAbout(){

    document.getElementById("aboutModal")
        .classList.add("hidden");
}

window.addEventListener("click",function(e){

    const modal =
        document.getElementById("aboutModal");

    if(e.target === modal){

        closeAbout();
    }
});