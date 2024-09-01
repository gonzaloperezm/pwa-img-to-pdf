<template>
  <div class="container">
    <!-- Drag and Drop Area -->
    <div
      class="drop-area"
      @drop.prevent="handleDrop"
      @dragover.prevent
      @click="selectFiles"
    >
      <input
        type="file"
        ref="fileInput"
        @change="handleFileUpload"
        multiple
        accept="image/*"
        style="display: none;"
      />
      <div class="drop-content">
        <i class="fas fa-cloud-upload-alt upload-icon"></i>
        <p class="upload-text">Drag and drop your images here or click to select</p>
      </div>
    </div>

    <!-- Preview Area -->
    <div v-if="files.length" class="preview-area">
      <div v-for="(file, index) in files" :key="index" class="image-preview">
        <img :src="file.preview" :alt="file.name" class="thumbnail" />
        <p class="image-name">{{ file.name }}</p>
      </div>
    </div>

    <!-- Convert Button -->
    <button
      class="btn convert-button"
      @click="convertToPDF"
      :disabled="!files.length || loading"
    >
      Convert to PDF
    </button>

    <!-- Loading Modal -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-modal">
        <div class="spinner"></div>
        <p>Processing...</p>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '../services/APIService.js';

export default {
  data() {
    return {
      files: [],
      loading: false,
    };
  },
  methods: {
    selectFiles() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const selectedFiles = Array.from(event.target.files);
      this.processFiles(selectedFiles);
      event.target.value = null; // Reset input
    },
    handleDrop(event) {
      const droppedFiles = Array.from(event.dataTransfer.files);
      this.processFiles(droppedFiles);
    },
    processFiles(files) {
      const validImages = files.filter(file => file.type.startsWith('image/'));
      const newFiles = validImages.map(file => ({
        file,
        name: file.name,
        preview: URL.createObjectURL(file),
      }));
      this.files = [...this.files, ...newFiles];
    },
    async convertToPDF() {
      this.loading = true;
      try {
        const filesToUpload = this.files.map(f => f.file);
        const pdfBlob = await apiService.convertImagesToPDF(filesToUpload);
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); // Clean up
      } catch (error) {
        console.error('Error converting images to PDF:', error);
      } finally {
        this.loading = false;
      }
    },
  },
  beforeDestroy() {
    // Revoke all object URLs to prevent memory leaks
    this.files.forEach(file => URL.revokeObjectURL(file.preview));
  },
};
</script>

<style scoped>


.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Quicksand', sans-serif;

}

/* Drop Area */
.drop-area {
  border: 2px dashed #6c757d;
  border-radius: 12px;
  padding: 40px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  margin-bottom: 10px;
}

.drop-area:hover {
  background-color: #e2e6ea;
  border-color: #5a6268;
}

.upload-icon {
  font-size: 50px;
  color: #6c757d;
  margin-bottom: 15px;
}

.upload-text {
  font-size: 18px;
  color: #6c757d;
}

/* Preview Area */
.preview-area {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 30px 0;
  gap: 15px;
}

.image-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
}

.thumbnail {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  margin-bottom: 8px;
}

.image-name {
  font-size: 14px;
  color: #343a40;
  word-break: break-word;
}

/* Convert Button */
.convert-button {
  background-color: #28a745;
  color: #fff;
  font-size: 18px;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.convert-button:hover:not(:disabled) {
  background-color: #218838;
}

.convert-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-modal {
  background-color: #fff;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #007bff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 576px) {
  .drop-area {
    padding: 30px;
  }

  .upload-icon {
    font-size: 40px;
  }

  .upload-text {
    font-size: 16px;
  }

  .thumbnail {
    height: 80px;
  }

  .convert-button {
    width: 100%;
    padding: 12px;
  }
}
</style>
