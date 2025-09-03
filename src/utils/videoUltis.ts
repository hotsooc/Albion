
export const getVideoThumbnail = (videoUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.autoplay = false;
    video.muted = true;
    video.preload = 'metadata'; 

const handleError: OnErrorEventHandler = (event, error) => {
  if (event instanceof Event) {
    const videoElement = (event.target as HTMLVideoElement);
    if (videoElement && videoElement.error) {
      console.error(
        `Lỗi video #${videoElement.error.code}: ${videoElement.error.message}`,
        `Lỗi cho URL: ${videoUrl}`
      );
    } else {
      console.error(
        `Lỗi tải video hoặc tạo thumbnail cho ${videoUrl}:`,
        event
      );
    }
  } else {
    console.error(
      `Lỗi tải video hoặc tạo thumbnail cho ${videoUrl}:`,
      event || error
    );
  }
  reject(new Error(`Không thể tạo thumbnail cho video: ${videoUrl}`));
};

video.onerror = handleError;

    video.onloadedmetadata = () => {
      video.currentTime = 0.1; 
    };

    video.onseeked = () => { 
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        handleError("Video dimensions are zero");
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8); 
        resolve(thumbnail);
      } else {
        handleError("Canvas context is null");
      }
    };

    video.onerror = handleError; 
    video.onabort = handleError;

    video.load();
  });
};