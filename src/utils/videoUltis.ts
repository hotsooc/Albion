
export const getVideoThumbnail = (videoUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.autoplay = false;
    video.muted = true;
    video.preload = 'metadata'; 

    const handleError = () => {
      console.error(`Lỗi tải video hoặc tạo thumbnail cho ${videoUrl}:`);
      reject(new Error(`Không thể tạo thumbnail cho video: ${videoUrl}`));
      // resolve('URL_ANH_THU_NHO_MAC_DINH_NEU_LOI.jpg'); 
    };

    video.onloadedmetadata = () => {
      video.currentTime = 0.1; 
    };

    video.onseeked = () => { 
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        handleError();
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
        handleError();
      }
    };

    video.onerror = handleError; 
    video.onabort = handleError;

    video.load();
  });
};