(function() {
    function MemoryUploader() {
        this.elements = {
            wrapper : null,
            uploader : null,
            previewImage : null,
            previewImageWrapper : null,
            memoryTextarea : null
        };
        this.state = {
            currentPhoto : null,
        };
        this.addMemory = function() {
            var memoryText = this.elements.memoryTextarea.value;
            if ( memoryText != "" || this.state.currentPhoto != null ) {
                this.state.memoriesRef.add({
                    memoryText : memoryText,
                    memoryImageUrl : this.state.currentPhoto,
                    created_at : Date.now()
                })
                .then(function(docRef) {
                    console.log("Document written with ID: ", docRef.id);
                    this.closeUploader();
                }.bind(this))
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                }.bind(this));
            } else {
                alert("You need to add a memory or upload a photo.");
            }
        };
        this.addPhoto = function(photoUrl) {
            window.PhotoUploader.hideUploader();
            this.state.currentPhoto = photoUrl;
            this.elements.previewImage = new Image();
            this.elements.previewImage.onload = function() {
                setTimeout(function() {
                    this.elements.previewImage.classList.add('showing');
                }.bind(this), 100);
            }.bind(this);
            this.elements.previewImage.src = this.state.currentPhoto;
            this.elements.previewImageWrapper.appendChild(this.elements.previewImage);
            this.elements.previewImageWrapper.classList.add('showing');
        };
        this.clearImage = function() {
            this.elements.previewImageWrapper.classList.remove('showing');
            this.elements.previewImageWrapper.innerHTML = '';
            this.elements.previewImage = null;
            this.state.currentPhoto = null;
            window.PhotoUploader.showUploader();
        };
        this.openUploader = function() {
            this.elements.wrapper.classList.add('showing');
            this.elements.fab.classList.add('hidden');
        };
        this.closeUploader = function() {
            this.clearImage();
            this.elements.wrapper.classList.remove('showing');
            this.elements.fab.classList.remove('hidden');
        };
        this.addEventListeners = function() {
            this.elements.fab.addEventListener('click', this.openUploader.bind(this));
            this.elements.background.addEventListener('click', this.closeUploader.bind(this));
            this.elements.previewImageWrapper.addEventListener('click', this.clearImage.bind(this));
            this.elements.cancelButton.addEventListener('click', this.closeUploader.bind(this));
            this.elements.confirmButton.addEventListener('click', this.addMemory.bind(this));
        };
        this.init = function() {
            this.state.db = firebase.firestore();
            this.state.memoriesRef = this.state.db.collection('memories');

            this.elements.wrapper = document.querySelector('.MemoryUploader__wrapper');
            this.elements.fab = document.querySelector('.MemoryUploader__fab');
            this.elements.background = document.querySelector('.MemoryUploader__background');
            this.elements.previewImageWrapper = document.querySelector('.MemoryUploader__preview-image__wrapper');
            this.elements.confirmButton = document.querySelector('.MemoryUploader__cta');
            this.elements.cancelButton = document.querySelector('.MemoryUploader__cta-deny');
            this.elements.memoryTextarea = document.querySelector('.MemoryUploader__memory-textarea');

            this.addEventListeners();
        };
    }

    window.MemoryUploader = new MemoryUploader();

    document.addEventListener('DOMContentLoaded', function() {
        window.MemoryUploader.init();
    });
})();