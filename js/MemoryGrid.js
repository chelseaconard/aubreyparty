(function() {
    function MemoryGrid() {
        this.elements = {
            grid : null,
            rows : [],
            images : []
        };
        this.state = {
            memories : []
        };
        this.createMemoryElement = function(memory) {
            var memoryElement = document.createElement('div');
            memoryElement.classList.add('MemoryGrid__memory-element');

            var hasMemoryText = memory.memoryText != "";
            var hasMemoryImage = memory.memoryImageUrl;

            if ( hasMemoryText ) {
                if ( !hasMemoryImage ) {
                    memoryElement.classList.add('text-memory')
                };
            } else {
                if ( hasMemoryImage ) {
                    memoryElement.classList.add('image-memory');
                }
            }
            if ( hasMemoryText ) {
                var memoryTextElement = document.createElement('div');
                memoryTextElement.classList.add('MemoryGrid__memory-text');
                memoryTextElement.innerText = memory.memoryText;
                memoryElement.appendChild(memoryTextElement);
            }
            if ( hasMemoryImage ) {
                var memoryImageWrapperElement = document.createElement('div');
                memoryImageWrapperElement.classList.add('MemoryGrid__image-wrapper');

                var memoryImageElement = document.createElement('img');
                memoryImageElement.classList.add('MemoryGrid__image');

                memoryImageElement.onload = function() {
                    memoryImageElement.classList.add('displayed');
                    setTimeout(function() {
                        memoryImageElement.classList.add('showing');
                    }.bind(this), 250);
                }.bind(this);
                memoryImageElement.src = memory.memoryImageUrl;

                memoryImageWrapperElement.appendChild(memoryImageElement);
                memoryElement.appendChild(memoryImageWrapperElement);
            }

            this.elements.grid.appendChild(memoryElement);
        }
        this.addPhoto = function(currentImageUrl) {
            var currentImage = new Image();
            currentImage.classList.add('MemoryGrid__image');
            currentImage.onload = function() {
                currentImage.classList.add('displayed');
                setTimeout(function() {
                    currentImage.classList.add('showing');
                }.bind(this), 250);
            }.bind(this);
            this.elements.grid.appendChild(currentImage);
            this.elements.images.push(currentImage);
            currentImage.src = currentImageUrl;
        };
        this.displayImages = function() {
            for ( var imageIndex = 0; imageIndex < this.state.images.length; imageIndex++ ) {
                var currentImageUrl = this.state.images[imageIndex];
                this.addPhoto(currentImageUrl);
            }
        };
        this.displayMemory = function(memory) {
            this.createMemoryElement(memory);
        };
        this.getImages = function() {
            this.state.memoriesRef.where("approved", "==", true).onSnapshot(function(snapshot) {
                // var promises = [];
                snapshot.docChanges().forEach(function(change) {
                    var memory = change.doc.data();
                    console.log(memory);
                    this.state.memories.push(memory.memoryImageUrl);
                    this.displayMemory(memory);
                }.bind(this));

                // this.displayImages();
            }.bind(this));
        };
        this.addEventListeners = function() {

        };
        this.init = function() {
            this.elements.grid = document.querySelector('.MemoryGrid__grid');
            this.state.db = firebase.firestore();
            this.state.memoriesRef = this.state.db.collection('memories');
            
            // Create a reference from a Google Cloud Storage URI
            this.addEventListeners();
            this.getImages();
        }
    }

    window.MemoryGrid = new MemoryGrid();

    document.addEventListener('DOMContentLoaded', function() {
        window.MemoryGrid.init();
    });
})();