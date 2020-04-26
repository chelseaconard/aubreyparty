(function() {
    function PhotoUploader(wrapper) {
        this.elements = {
            uploader : document.querySelector('.PhotoUploader__uploader'),
            imagePreview : document.querySelector('.PhotoUploader__image-preview__wrapper'),
            confirmation : document.querySelector('.PhotoUploader__confirmation'),
            confirmButton : document.querySelector('.PhotoUploader__button.confirm'),
            denyButton : document.querySelector('.PhotoUploader__button.deny'),
            wrapper : document.querySelector('.PhotoUploader__wrapper'),
            fileInput : document.querySelector('.PhotoUploader__cta')
        };
        this.state = {

        };
        this.uuidv4 = function() {
            return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        };
        this.getFileExtension = function(filename) {
            var extension = filename.split('.').pop();
            if ( extension == filename ) return "";
            return extension;
        };
        this.closeConfirmationDialog = function() {
            this.elements.confirmation.classList.remove('showing');
            this.elements.imagePreview.innerHTML = '';
            this.handleDragLeave();
        };
        this.uploadPhoto = function() {
            var storageRef = firebase.storage().ref();
            // Create a reference to 'images/mountains.jpg'
            var imagesRef = storageRef.child('images/' + this.uuidv4() + "." + this.getFileExtension(this.state.currentFile.name));
            imagesRef.put(this.state.currentFile).then(function(snapshot) {
                console.log(snapshot);
                if ( snapshot.state == "success" ) {
                    this.closeConfirmationDialog();
                    snapshot.ref.getDownloadURL().then(function(url) {
                        // window.MemoryGrid.addPhoto(url);
                        window.MemoryUploader.addPhoto(url);
                    });
                }
            }.bind(this));
        };
        this.previewImage = function(file) {
            var fileExtension = this.getFileExtension(file.name);
            if ( fileExtension == "jpg" || fileExtension == "png" || fileExtension == "jpeg" ) {
                var reader = new FileReader()
                reader.readAsDataURL(file)
                this.state.currentFile = file;
                reader.onloadend = function() {
                    this.elements.confirmation.classList.add('showing')
                    var previewImage = new Image();
                    this.state.previewSrc = reader.result;
                    previewImage.src = reader.result;
                    previewImage.classList.add("PhotoUploader__image-preview")
                    this.elements.imagePreview.appendChild(previewImage);
                }.bind(this);
            } else {
                this.handleDragLeave();
                this.elements.fileInput.value = "";
                alert('You must upload an image');
            }
        };
        this.hideUploader = function() {
            this.elements.wrapper.classList.add('hidden');
        };
        this.showUploader = function() {
            this.elements.wrapper.classList.remove('hidden');
        };
        this.handleDragEnter = function(e) {
            e.preventDefault();
            this.elements.uploader.classList.add('dragged');
        };
        this.handleDragLeave = function(e) {
            this.elements.uploader.classList.remove('dragged');
        };
        this.handleDragOver = function(e) {
            e.preventDefault();
        };
        this.handleDrop = function(e) {
            console.log(e)
            e.preventDefault();
            e.stopPropagation();
            var dataTransfer = e.dataTransfer;
            var files = dataTransfer.files;
            this.previewImage(files[0]);    
        };
        this.handleFileSelect = function(e) {
            this.previewImage(e.currentTarget.files[0]);
        };
        this.addEventListeners = function() {
            this.elements.fileInput.addEventListener('change', this.handleFileSelect.bind(this)),
            this.elements.uploader.addEventListener('dragenter', this.handleDragEnter.bind(this), false)
            this.elements.uploader.addEventListener('dragover', this.handleDragOver.bind(this), false)
            this.elements.uploader.addEventListener('dragleave', this.handleDragLeave.bind(this), false)
            this.elements.uploader.addEventListener('drop', this.handleDrop.bind(this), false);
            this.elements.confirmButton.addEventListener('click', this.uploadPhoto.bind(this), false);
            this.elements.denyButton.addEventListener('click', this.closeConfirmationDialog.bind(this), false);
        };
        this.init = function() {
            this.addEventListeners();
        };
    }

    window.PhotoUploader = new PhotoUploader(document.querySelector('.PhotoUploader__wrapper'));

    document.addEventListener('DOMContentLoaded', function() {
        window.PhotoUploader.init();
    });
})();