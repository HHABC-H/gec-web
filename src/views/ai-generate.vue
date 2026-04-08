<template>
  <div class="ai-generate-container">
    <div class="header">
      <div class="logo-container">
        <img src="@/assets/image/gdou.png" alt="GDou Logo" class="logo">
        <div class="title-container">
          <h1 class="main-title">海洋AI智能生成</h1>
          <p class="subtitle">图片与视频内容生成中心</p>
        </div>
      </div>
      <button class="clear-btn" @click="clearResult">清空结果</button>
    </div>

    <div class="main-content">
      <div class="panel">
        <div class="switch-row">
          <button
            class="switch-btn"
            :class="{ active: mode === 'image' }"
            @click="mode = 'image'"
          >
            图片生成
          </button>
          <button
            class="switch-btn"
            :class="{ active: mode === 'video' }"
            @click="mode = 'video'"
          >
            视频生成
          </button>
        </div>

        <div v-if="mode === 'image'" class="content-section">
          <label class="field-label">图片提示词</label>
          <textarea
            v-model="imagePrompt"
            class="message-input"
            rows="3"
            placeholder="例如：一只可爱的小猫在海边追逐浪花，日落光影"
          />
          <div class="actions">
            <button
              class="primary-btn"
              :disabled="isLoading || !imagePrompt.trim()"
              @click="handleImageGenerate"
            >
              {{ isLoading ? '生成中...' : '生成图片' }}
            </button>
          </div>

          <div v-if="imageUrl" class="result-card">
            <div class="result-title">图片生成结果</div>
            <img :src="imageUrl" alt="AI Generated" class="preview-image">
            <a :href="imageUrl" target="_blank" rel="noopener noreferrer" class="download-link">
              下载/查看原图
            </a>
          </div>
        </div>

        <div v-if="mode === 'video'" class="content-section">
          <label class="field-label">视频描述（用于文本生成视频）</label>
          <textarea
            v-model="videoPrompt"
            class="message-input"
            rows="4"
            placeholder="例如：海边夜空下，海浪拍岸，镜头缓慢推进到发光水母群"
          />

          <div class="actions video-actions">
            <button
              class="primary-btn"
              :disabled="isLoading || !videoPrompt.trim()"
              @click="handleTextToVideo"
            >
              {{ isLoading ? '处理中...' : '文本生成视频' }}
            </button>
            <button class="secondary-btn" :disabled="isLoading" @click="handleImageToVideo">
              {{ isLoading ? '处理中...' : '图片生成视频' }}
            </button>
            <button class="secondary-btn" :disabled="isLoading" @click="handleVideoEffect">
              {{ isLoading ? '处理中...' : '视频特效' }}
            </button>
          </div>

          <div v-if="videoResult" class="result-card">
            <div class="result-title">视频任务结果</div>
            <pre class="text-result">{{ videoResult }}</pre>
            <button class="copy-btn" @click="copyVideoResult">复制结果文本</button>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="errorMessage" class="error-toast">
        {{ errorMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import { getImageUrl, imageToVideo, textToVideo, videoEffect } from '@/api/ocean-ai'

export default {
  name: 'AiGenerate',
  data() {
    return {
      mode: 'image',
      imagePrompt: '海洋中的梦幻蓝鲸，电影级光影，高清细节',
      videoPrompt: '一只小猫在海边奔跑，浪花飞溅，镜头平滑跟拍，电影感',
      imageUrl: '',
      videoResult: '',
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    showError(message) {
      this.errorMessage = message
      setTimeout(() => {
        this.errorMessage = ''
      }, 3000)
    },
    clearResult() {
      this.imageUrl = ''
      this.videoResult = ''
      this.errorMessage = ''
    },
    async handleImageGenerate() {
      this.isLoading = true
      this.errorMessage = ''
      try {
        const res = await getImageUrl(this.imagePrompt.trim())
        if (res && res.success && res.url) {
          this.imageUrl = res.url
          return
        }
        throw new Error(res && res.error ? res.error : '图片生成失败')
      } catch (err) {
        this.showError(err.message || '图片生成失败')
      } finally {
        this.isLoading = false
      }
    },
    async handleTextToVideo() {
      this.isLoading = true
      this.errorMessage = ''
      this.videoResult = ''
      try {
        this.videoResult = await textToVideo(this.videoPrompt.trim())
      } catch (err) {
        this.showError(err.message || '文本生成视频失败')
      } finally {
        this.isLoading = false
      }
    },
    async handleImageToVideo() {
      this.isLoading = true
      this.errorMessage = ''
      this.videoResult = ''
      try {
        this.videoResult = await imageToVideo(this.videoPrompt.trim())
      } catch (err) {
        this.showError(err.message || '图片生成视频失败')
      } finally {
        this.isLoading = false
      }
    },
    async handleVideoEffect() {
      this.isLoading = true
      this.errorMessage = ''
      this.videoResult = ''
      try {
        this.videoResult = await videoEffect()
      } catch (err) {
        this.showError(err.message || '视频特效失败')
      } finally {
        this.isLoading = false
      }
    },
    async copyVideoResult() {
      try {
        await navigator.clipboard.writeText(this.videoResult)
      } catch (err) {
        this.showError('复制失败，请手动复制')
      }
    }
  }
}
</script>

<style scoped>
.ai-generate-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.header {
  padding: 20px 40px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  height: 50px;
}

.main-title {
  margin: 0;
  font-size: 28px;
  color: #1a237e;
}

.subtitle {
  margin: 4px 0 0;
  color: #5c6bc0;
  font-size: 14px;
}

.clear-btn {
  border: 1px solid #dcdcdc;
  background: #fff;
  color: #555;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
}

.main-content {
  flex: 1;
  padding: 20px 40px;
  overflow: auto;
}

.panel {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.switch-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.switch-btn {
  border: 1px solid #90caf9;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 18px;
  padding: 8px 18px;
  cursor: pointer;
}

.switch-btn.active {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: #fff;
  border-color: #1976d2;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-label {
  color: #455a64;
  font-weight: 600;
}

.message-input {
  width: 100%;
  border: 1px solid #cfd8dc;
  border-radius: 12px;
  padding: 12px;
  font-size: 14px;
  resize: vertical;
}

.actions {
  display: flex;
  gap: 10px;
}

.video-actions {
  flex-wrap: wrap;
}

.primary-btn,
.secondary-btn,
.copy-btn {
  border: none;
  border-radius: 20px;
  padding: 10px 18px;
  cursor: pointer;
}

.primary-btn {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: #fff;
}

.secondary-btn {
  background: #eff6ff;
  color: #1565c0;
  border: 1px solid #90caf9;
}

.primary-btn:disabled,
.secondary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-card {
  margin-top: 8px;
  border: 1px solid #e3f2fd;
  background: #f8fdff;
  border-radius: 12px;
  padding: 16px;
}

.result-title {
  font-weight: 600;
  color: #1565c0;
  margin-bottom: 10px;
}

.preview-image {
  width: 100%;
  max-width: 560px;
  border-radius: 10px;
  display: block;
  margin-bottom: 10px;
}

.download-link {
  color: #1565c0;
  text-decoration: underline;
}

.text-result {
  white-space: pre-wrap;
  word-break: break-all;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e0e0e0;
}

.copy-btn {
  margin-top: 10px;
  background: #fff;
  color: #1976d2;
  border: 1px solid #90caf9;
}

.error-toast {
  position: fixed;
  right: 30px;
  bottom: 30px;
  background: #ffebee;
  color: #b71c1c;
  padding: 12px 16px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .header {
    padding: 16px;
  }

  .main-content {
    padding: 12px;
  }

  .panel {
    padding: 16px;
  }
}
</style>
