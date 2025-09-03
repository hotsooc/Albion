import React, { useState, useEffect } from 'react';
import { Card, Modal, Row, Col, Typography, Spin } from 'antd';
import ReactPlayer from 'react-player';
import { NorAlbion, VideoType } from '@/store/video';
import { getVideoThumbnail } from '@/utils/videoUltis';
import Image from 'next/image';

const { Meta } = Card;
const { Title, Paragraph } = Typography;

type VideoWithThumbnailType = VideoType & {
  thumbnail?: string; 
  isThumbnailLoading?: boolean;
};

const VideoPage = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
    const [videosWithThumbnails, setVideosWithThumbnails] = useState<VideoWithThumbnailType[]>(
      NorAlbion.map(video => ({ ...video, isThumbnailLoading: true }))
    );

    useEffect(() => {
      const loadThumbnails = async () => {
        const promises = videosWithThumbnails.map(async (video) => {
          try {
            const thumbnail = await getVideoThumbnail(video.url);
            return { ...video, thumbnail: thumbnail, isThumbnailLoading: false };
          } catch (error) {
            console.error(`Không thể tạo thumbnail cho ${video.name}`, error);
            return { ...video, thumbnail: 'URL_ANH_LOI_MAC_DINH.jpg', isThumbnailLoading: false };
          }
        });

        const results = await Promise.all(promises);
        setVideosWithThumbnails(results);
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
                        <Col key={video.name} className="video-card-col">
                            <Card
                                hoverable
                                style={{ width: 240 }}
                                onClick={() => showModal(video)}
                                cover={
                                  video.isThumbnailLoading ? (
                                    <div style={{ padding: '40px', textAlign: 'center' }}>
                                      <Spin />
                                    </div>
                                  ) : (
                                    <Image 
                                      alt={video.name} 
                                      src={video.thumbnail!} 
                                      width={240} 
                                      height={140}
                                      className='object-cover'
                                    />
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
                width={1600}
                height={1000}
                footer={null}
            >
                <Row gutter={24}>
                    <Col span={10}>
                        <Title level={4}>Chi tiết Video</Title>
                        <Paragraph>{selectedVideo?.description}</Paragraph>
                    </Col>
                    
                    <Col span={14}>
                        {selectedVideo && (
                            <ReactPlayer 
                                src={selectedVideo.url} 
                                controls={true} 
                                width="100%" 
                                height="auto" 
                            />
                        )}
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default VideoPage;