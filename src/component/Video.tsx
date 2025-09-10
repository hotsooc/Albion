'use client';

import React, { useState, useEffect } from "react";
import { Card, Modal, Row, Col, Spin, Input, Button, Form } from "antd";
import ReactPlayer from "react-player";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import { supabase } from "../../lib/supabase/client";
import { VideoAlbion } from "@/store/video";
import { Baloo_2 } from "next/font/google";
import CommentSection from "./Comment";

const { Meta } = Card;

const getYouTubeVideoId = (url: string | null) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getYouTubeThumbnail = (videoId: string | null) => {
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "/placeholder.jpg";
};

type SupabaseVideo = {
  id: string;
  name: string | null;
  url: string | null;
  description: string | null;
  category: string | null;
};

type VideoWithThumbnailType = {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  thumbnail: string;
};

const tabs = ["Highlight", "Funny Moment", "Record"];
const balooFont = Baloo_2({
  subsets: ['vietnamese'],
  weight: ['800'],
});

const VideoPage = () => {
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoWithThumbnailType | null>(null);
  const [videosWithThumbnails, setVideosWithThumbnails] = useState<VideoWithThumbnailType[]>([]);
  const [activeTab, setActiveTab] = useState("Highlight");
  const [searchValue, setSearchValue] = useState("");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('category', activeTab);

      if (error || !data || data.length === 0) {
        console.error('Error fetching videos or no data, falling back to local data:', error);
        const fallbackVideos = VideoAlbion[activeTab] || [];
        const dataWithThumbnails: VideoWithThumbnailType[] = fallbackVideos.map((video) => {
          const videoId = getYouTubeVideoId(video.url);
          const thumbnail = getYouTubeThumbnail(videoId);
          return {
            id: video.id.toString(),
            name: video.name,
            url: video.url || '',
            description: video.description,
            category: activeTab,
            thumbnail: thumbnail,
          };
        });
        setVideosWithThumbnails(dataWithThumbnails);
      } else {
        const dataWithThumbnails: VideoWithThumbnailType[] = data.map((video: SupabaseVideo) => {
          const videoId = getYouTubeVideoId(video.url);
          const thumbnail = getYouTubeThumbnail(videoId);

          return {
            id: video.id,
            name: video.name || 'Untitled',
            url: video.url || '',
            description: video.description || 'No description provided.',
            category: video.category || 'General',
            thumbnail: thumbnail,
          };
        });
        setVideosWithThumbnails(dataWithThumbnails);
      }
      setLoading(false);
    };

    fetchVideos();
  }, [activeTab]);

  // const showModal = (video: VideoWithThumbnailType) => {
  //   setSelectedVideo(video);
  //   setIsModalVisible(true);
  // };

  // const handleCancel = () => {
  //   setIsModalVisible(false);
  //   setSelectedVideo(null);
  // };

  const showUploadModal = () => {
    setIsUploadModalVisible(true);
  };

  const handleUploadCancel = () => {
    setIsUploadModalVisible(false);
    form.resetFields();
  };

  const handleUploadSubmit = async (values: { name: string; url: string; description: string }) => {
    const { data, error } = await supabase
      .from('videos')
      .insert({
        name: values.name,
        url: values.url,
        description: values.description,
        category: activeTab
      })
      .select();

    if (error) {
      console.error('Error uploading video:', error);
      return;
    }
    
    if (data && data.length > 0) {
      const newVideo = data[0] as SupabaseVideo;
      const videoId = getYouTubeVideoId(newVideo.url);
      const thumbnail = getYouTubeThumbnail(videoId);

      const newVideoWithThumbnail: VideoWithThumbnailType = {
        id: newVideo.id,
        name: newVideo.name || 'Untitled',
        url: newVideo.url || '',
        description: newVideo.description || 'No description provided.',
        category: newVideo.category || 'General',
        thumbnail: thumbnail
      };

      setVideosWithThumbnails(prevVideos => [...prevVideos, newVideoWithThumbnail]);
    }

    handleUploadCancel();
  };

  const filteredVideos = videosWithThumbnails.filter((video) =>
    video.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="p-4 w-full h-full rounded-2xl bg-[#E4FFFE] shadow-xl border border-solid">
      <div className="flex gap-2 mb-6">
      {viewMode === "detail" && (
        <>
        <div className="!flex !justify-between w-1/4">
          <Button onClick={() => setViewMode("list")} className="!bg-[#97DDD9] !h-[46px] !font-bold !text-black !hover:bg-[#97DDD9] !rounded-xl">
            <img src='/back_icon.png' alt="" width={20} height={20} />
            <span className="text-black font bold text-[20px]">Back</span>
          </Button>
          <div></div>
        </div>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${balooFont.className} not-only-of-type:px-4 py-2 w-1/6 !shadow-xl !rounded-full !font-normal !text-[24px] !text-black cursor-pointer transition ${
                activeTab === tab ? "bg-[#77BFFA] text-black" : "bg-[#8BDDFB] text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </>
      )}
      </div>
      <div className="flex justify-center gap-2 mb-6">
      {viewMode === "list" && (
        <>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${balooFont.className} not-only-of-type:px-4 py-2 w-1/6 !shadow-xl !rounded-full !font-normal !text-[24px] !text-black cursor-pointer transition ${
                activeTab === tab ? "bg-[#77BFFA] text-black" : "bg-[#8BDDFB] text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </>
      )}
      </div>

    {viewMode === "list" && (
      <>
      <div className="flex justify-center mb-6">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="!border !border-gray-300 !shadow-xl bg-white !w-1/3 !h-10 px-4 !rounded-full focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredVideos.map((video) => (
            <Col key={video.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="w-full rounded-lg overflow-hidden"
                onClick={() => {
                  setSelectedVideo(video);
                  setViewMode("detail");
                }}
                cover={
                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                    <Image
                      alt={video.name}
                      src={video.thumbnail}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                }
              >
                <Meta title={video.name} />
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <div className="flex gap-2 mt-4 justify-between">
        {/* <Button icon={<FilterOutlined />} /> */}
        <div></div>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          className="!bg-[#97DDD9] !h-[46px] !font-bold !text-black !hover:bg-[#97DDD9]"
          onClick={showUploadModal}
        >
          Upload
        </Button>
      </div>
      </>
      )}

      {viewMode === "detail" && selectedVideo && (
        <div className="grid grid-cols-[4fr_2fr] gap-4 p-4">
          <div className="video-wrapper" style={{ position: "relative", paddingTop: "56.25%" }}>
            <ReactPlayer
              src={selectedVideo.url}
              controls={true}
              width="100%"
              height="100%"
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          </div>
          {/* <Comment
            className="rounded-2xl p-4"
            author={<a>Thewise: ai kêu m ngu</a>}
            avatar={<Avatar icon={<UserOutlined />} />}
            content={
              <p>
                Đây là nội dung của bình luận. Bạn có thể thay đổi nó.
              </p>
            }
            datetime={
              <span>1:00 PM 7/9/2025</span>
            }
          /> */}
          <CommentSection />
        </div>
      )}
      <Modal
        title="Upload Video"
        open={isUploadModalVisible}
        onCancel={handleUploadCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Form form={form} onFinish={handleUploadSubmit} layout="vertical">
          <Form.Item
            name="name" 
            label="Video Title"
            rules={[{ required: true, message: "Please enter the video title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="url" 
            label="YouTube URL"
            rules={[{ required: true, message: "Please enter the YouTube URL!" }, { type: 'url', message: 'Please enter a valid URL!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description" 
            label="Description"
            rules={[{ required: true, message: "Please enter a description!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VideoPage;