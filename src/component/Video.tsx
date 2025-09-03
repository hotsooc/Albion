import React, { useState, useEffect } from 'react';
import { Card, Modal, Row, Col, Typography, Spin } from 'antd';
import ReactPlayer from 'react-player';
import { VideoAlbion, VideoType } from '@/store/video';
import Image from 'next/image';

const { Meta } = Card;
const { Title, Paragraph } = Typography;

const getYouTubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getYouTubeThumbnail = (videoId: string | null) => {
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/placeholder.jpg';
};

type VideoWithThumbnailType = VideoType & {
  id: string | number;
  thumbnail?: string;
  isThumbnailLoading?: boolean;
};

const VideoPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [videosWithThumbnails, setVideosWithThumbnails] = useState<VideoWithThumbnailType[]>([]);

  useEffect(() => {
    const loadThumbnails = async () => {
      const initialData = VideoAlbion.map(video => {
        const videoId = getYouTubeVideoId(video.url);
        const thumbnail = getYouTubeThumbnail(videoId);
        return {
          ...video,
          id: video.id, 
          thumbnail: thumbnail,
          isThumbnailLoading: false,
        };
      });
      setVideosWithThumbnails(initialData);
    };

    loadThumbnails();
  }, []);

  const showModal = (video: VideoType) => {
    setSelectedVideo(video);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedVideo(null);
  };

  return (
    <div className="video-page-container">
      <Title level={2}>Danh sách video</Title>

      <div className="video-list-scrollable">
        <Row gutter={[16, 16]}>
          {videosWithThumbnails.map((video) => (
            <Col key={video.id} className="video-card-col" xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className='w-full rounded-lg'
                onClick={() => showModal(video)}
                cover={
                  video.isThumbnailLoading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                      <Spin />
                    </div>
                  ) : (
                    <div className="rounded-lg flex">
                      <Image
                        alt={video.name}
                        src={video.thumbnail!}
                        width={240}
                        height={140}
                        className='object-cover rounded-lg'
                      />
                    </div>
                  )
                }
              >
                <Meta title={video.name} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Modal
      title={selectedVideo?.name}
      open={isModalVisible}
      onCancel={handleCancel}
      width='80%'
      footer={null}
      centered
    >
      <Row gutter={24}>
        <Col span={10}>
          <Title level={4}>Chi tiết Video</Title>
          <Paragraph>{selectedVideo?.description}</Paragraph>
        </Col>

        <Col span={14}>
          {selectedVideo && (
            <div className="video-responsive-scroll">
              <div className="video-wrapper">
                <ReactPlayer
                  src={selectedVideo.url}
                  controls={true}
                  className='react-player'
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Modal>
    </div>
  );
};

export default VideoPage;